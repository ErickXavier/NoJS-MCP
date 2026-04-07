import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { loadJSON, loadDoc } from "../knowledge.js";
import type { DirectivesKB, FiltersKB, ApiKB } from "../knowledge.js";

// ── Known NoJS directives for validation ──
let _directiveNames: Set<string> | null = null;

function getDirectiveNames(): Set<string> {
    if (!_directiveNames) {
        const kb = loadJSON<DirectivesKB>("directives.json");
        _directiveNames = new Set(
            kb.directives.map((d) => d.name.replace(/\*$/, "").replace(/:$/, ""))
        );
    }
    return _directiveNames;
}

export function registerTools(server: McpServer): void {
    // ── validate_template ──
    server.tool(
        "validate_template",
        "Validate a NoJS HTML template for syntax errors, unknown directives, and best practices",
        { html: z.string().describe("The HTML template to validate") },
        async ({ html }) => {
            const errors: string[] = [];
            const warnings: string[] = [];
            const knownDirectives = getDirectiveNames();

            // Extract all attributes from HTML
            const attrRegex = /\s([a-z][a-z0-9\-:]*?)(?:=|[\s>])/gi;
            const attrs = new Set<string>();
            let match: RegExpExecArray | null;
            while ((match = attrRegex.exec(html)) !== null) {
                attrs.add(match[1].toLowerCase());
            }

            // Check for potential NoJS directive typos
            const possibleTypos: Record<string, string> = {
                bnd: "bind",
                bing: "bind",
                binde: "bind",
                "bind-htm": "bind-html",
                iff: "if",
                els: "else",
                "else-iff": "else-if",
                shw: "show",
                hid: "hide",
                ech: "each",
                forech: "foreach",
                modle: "model",
                stat: "state",
                stor: "store",
                rout: "route",
                "route-vew": "route-view",
                validat: "validate",
                animat: "animate",
                "on-click": "on:click",
                "on-submit": "on:submit",
                "on-input": "on:input",
            };

            for (const attr of attrs) {
                if (possibleTypos[attr]) {
                    errors.push(
                        `Unknown attribute "${attr}" — did you mean "${possibleTypos[attr]}"?`
                    );
                }
            }

            // Check for each without "in" keyword
            const eachRegex = /each="([^"]+)"/g;
            while ((match = eachRegex.exec(html)) !== null) {
                if (!match[1].includes(" in ")) {
                    errors.push(
                        `Invalid "each" syntax: "${match[1]}" — expected format: "item in items"`
                    );
                }
            }

            // Check foreach without from
            if (html.includes("foreach=") && !html.includes("from=")) {
                errors.push(
                    `"foreach" directive requires a "from" attribute to specify the source array`
                );
            }

            // Check for deprecated syntax
            if (html.includes('mode="hash"') || html.includes("mode=\"history\"")) {
                warnings.push(
                    `Deprecated: router "mode" option. Use "useHash: true" instead of "mode: 'hash'"`
                );
            }

            // Check model on non-input elements
            const modelOnDivRegex =
                /<(div|span|p|h[1-6]|section|article|main|header|footer)\s[^>]*model=/gi;
            while ((match = modelOnDivRegex.exec(html)) !== null) {
                warnings.push(
                    `"model" directive on <${match[1]}> — "model" is designed for form inputs (<input>, <select>, <textarea>)`
                );
            }

            // Check bind-html without sanitization warning
            if (html.includes("bind-html=")) {
                warnings.push(
                    `"bind-html" renders HTML (sanitized by default via the built-in DOMParser-based sanitizer). Review content sources to prevent XSS.`
                );
            }

            // Check for on: events without correct syntax
            const onRegex = /on:([a-z]+)\.([a-z.]+)/gi;
            const validModifiers = new Set([
                "prevent",
                "stop",
                "once",
                "self",
                "debounce",
                "throttle",
                "enter",
                "escape",
                "tab",
                "space",
                "delete",
                "backspace",
                "up",
                "down",
                "left",
                "right",
                "ctrl",
                "alt",
                "shift",
                "meta",
            ]);
            while ((match = onRegex.exec(html)) !== null) {
                const mods = match[2].split(".");
                for (const mod of mods) {
                    if (!validModifiers.has(mod)) {
                        warnings.push(
                            `Unknown event modifier ".${mod}" on "on:${match[1]}" — valid modifiers: ${[...validModifiers].join(", ")}`
                        );
                    }
                }
            }

            const valid = errors.length === 0;

            let summary = valid
                ? "✅ Template is valid."
                : `❌ Found ${errors.length} error(s).`;
            if (warnings.length > 0) {
                summary += ` ${warnings.length} warning(s).`;
            }

            return {
                content: [
                    {
                        type: "text" as const,
                        text: JSON.stringify({ valid, errors, warnings, summary }, null, 2),
                    },
                ],
            };
        }
    );

    // ── explain_directive ──
    server.tool(
        "explain_directive",
        "Get a detailed explanation of a NoJS directive with syntax and examples",
        {
            directive: z
                .string()
                .describe(
                    'The directive name to explain (e.g., "bind", "each", "model")'
                ),
        },
        async ({ directive }) => {
            const kb = loadJSON<DirectivesKB>("directives.json");
            const name = directive.toLowerCase().trim();

            // Find exact match or partial match
            const found = kb.directives.find(
                (d) =>
                    d.name === name ||
                    d.name === `${name}` ||
                    d.name.startsWith(name)
            );

            if (!found) {
                // Suggest similar
                const suggestions = kb.directives
                    .filter(
                        (d) => d.name.includes(name) || d.category.includes(name)
                    )
                    .map((d) => d.name)
                    .slice(0, 5);

                return {
                    content: [
                        {
                            type: "text" as const,
                            text: `Directive "${directive}" not found.${suggestions.length > 0 ? ` Did you mean: ${suggestions.join(", ")}?` : ""}\n\nUse list_directives to see all available directives.`,
                        },
                    ],
                };
            }

            const category = kb.categories.find((c) => c.id === found.category);
            let explanation = `# ${found.name}\n\n`;
            explanation += `**Category**: ${category?.name || found.category}\n`;
            explanation += `**Description**: ${found.description}\n\n`;
            explanation += `## Syntax\n\n\`\`\`html\n${found.syntax}\n\`\`\`\n\n`;

            if (found.examples && found.examples.length > 0) {
                explanation += `## Examples\n\n`;
                for (const ex of found.examples) {
                    explanation += `### ${ex.description}\n\n\`\`\`html\n${ex.html}\n\`\`\`\n\n`;
                }
            }

            if (found.notes) {
                explanation += `## Notes\n\n${found.notes}\n`;
            }

            return {
                content: [{ type: "text" as const, text: explanation }],
            };
        }
    );

    // ── list_directives ──
    server.tool(
        "list_directives",
        "List all NoJS directives, optionally filtered by category",
        {
            category: z
                .string()
                .optional()
                .describe(
                    'Filter by category: data, state, binding, conditionals, loops, events, styling, forms, routing, animation, dnd (plugin), modal (plugin), dropdown (plugin), tooltip (plugin), popover (plugin), toast (plugin), tabs (plugin), tree (plugin), stepper (plugin), skeleton (plugin), split (plugin), table (plugin), i18n, refs, head, misc'
                ),
        },
        async ({ category }) => {
            const kb = loadJSON<DirectivesKB>("directives.json");

            let directives = kb.directives;
            if (category) {
                directives = directives.filter(
                    (d) => d.category === category.toLowerCase()
                );
            }

            if (directives.length === 0) {
                const cats = kb.categories.map((c) => c.id).join(", ");
                return {
                    content: [
                        {
                            type: "text" as const,
                            text: `No directives found for category "${category}". Available categories: ${cats}`,
                        },
                    ],
                };
            }

            // Group by category
            const groups: Record<string, typeof directives> = {};
            for (const d of directives) {
                if (!groups[d.category]) groups[d.category] = [];
                groups[d.category].push(d);
            }

            let output = `# NoJS Directives${category ? ` (${category})` : ""}\n\n`;
            output += `Total: ${directives.length} directives\n\n`;

            for (const [cat, items] of Object.entries(groups)) {
                const catInfo = kb.categories.find((c) => c.id === cat);
                output += `## ${catInfo?.name || cat}\n\n`;
                output += `| Directive | Description |\n|---|---|\n`;
                for (const d of items) {
                    output += `| \`${d.name}\` | ${d.description} |\n`;
                }
                output += `\n`;
            }

            return {
                content: [{ type: "text" as const, text: output }],
            };
        }
    );

    // ── scaffold_component ──
    server.tool(
        "scaffold_component",
        "Generate a NoJS component template following framework conventions",
        {
            type: z
                .enum(["form", "list", "detail", "card", "modal", "nav", "tabs", "dropdown", "stepper", "table", "tree", "split"])
                .describe("Component type to scaffold"),
            features: z
                .array(z.string())
                .optional()
                .describe(
                    'Optional features to include: "validation", "i18n", "state", "fetch", "animation", "dnd", "modal", "dropdown", "tooltip", "popover", "toast", "tabs", "tree", "stepper", "skeleton", "split", "table" (dnd and element features require nojs-elements plugin)'
                ),
        },
        async ({ type, features = [] }) => {
            const templates: Record<string, string> = {
                form: `<div state="{ email: '', password: '', loading: false }">
  <h2>Login</h2>
  <form validate on:submit.prevent="loading = true">
    <div class="field">
      <label>Email</label>
      <input model="email" type="email" validate="required,email"
             error-required="Email is required" error-email="Invalid email">
    </div>
    <div class="field">
      <label>Password</label>
      <input model="password" type="password" validate="required"
             error-required="Password is required">
    </div>
    <p if="$form.firstError" class="error" bind="$form.firstError"></p>
    <button type="submit" class-disabled="!$form.valid || loading">
      <span hide="loading">Submit</span>
      <span show="loading">Loading...</span>
    </button>
  </form>
</div>`,

                list: `<div state="{ search: '' }">
  <input model="search" placeholder="Search...">
  <div get="/items" as="items">
    <div each="item in items" key="item.id"
         animate="fadeIn" animate-stagger="50">
      <h3 bind="item.title"></h3>
      <p bind="item.description | truncate(100)"></p>
    </div>
    <p if="items.length === 0">No items found.</p>
  </div>
</div>`,

                detail: `<div get="/items/{$route.params.id}" as="item">
  <template if="item">
    <h1 bind="item.title"></h1>
    <p bind="item.description"></p>
    <span bind="item.createdAt | relative"></span>
  </template>
  <template else>
    <p>Loading...</p>
  </template>
</div>`,

                card: `<div class="card" state="{ expanded: false }">
  <div class="card-header">
    <h3 bind="title"></h3>
    <button on:click="expanded = !expanded">
      <span hide="expanded">▸</span>
      <span show="expanded">▾</span>
    </button>
  </div>
  <div class="card-body" show="expanded" animate="fadeInDown">
    <p bind="description"></p>
  </div>
</div>`,

                modal: `<div state="{ open: false }">
  <button on:click="open = true">Open Modal</button>
  <div class="modal-overlay" show="open" on:click.self="open = false"
       animate-enter="fadeIn" animate-leave="fadeOut">
    <div class="modal-content" animate-enter="fadeInUp" animate-leave="fadeOutDown">
      <div class="modal-header">
        <h2>Modal Title</h2>
        <button on:click="open = false">&times;</button>
      </div>
      <div class="modal-body">
        <p>Modal content goes here.</p>
      </div>
      <div class="modal-footer">
        <button on:click="open = false">Close</button>
      </div>
    </div>
  </div>
</div>`,

                tabs: `<div tabs>
  <button tab>Overview</button>
  <button tab>Details</button>
  <button tab>Settings</button>

  <div panel>
    <h2>Overview</h2>
    <p>Overview content goes here.</p>
  </div>
  <div panel>
    <h2>Details</h2>
    <p>Details content goes here.</p>
  </div>
  <div panel>
    <h2>Settings</h2>
    <p>Settings content goes here.</p>
  </div>
</div>`,

                dropdown: `<div dropdown>
  <button dropdown-toggle>Actions</button>
  <ul dropdown-menu>
    <li dropdown-item on:click="handleEdit()">Edit</li>
    <li dropdown-item on:click="handleDuplicate()">Duplicate</li>
    <li dropdown-item disabled>Archive (unavailable)</li>
    <li dropdown-item on:click="handleDelete()">Delete</li>
  </ul>
</div>`,

                stepper: `<div stepper state="{ name: '', email: '', agreed: false }">
  <div step step-label="Info">
    <h3>Personal Information</h3>
    <input model="name" required placeholder="Name" />
    <input model="email" type="email" required placeholder="Email" />
  </div>
  <div step step-label="Terms" step-validate="agreed">
    <h3>Terms &amp; Conditions</h3>
    <label>
      <input type="checkbox" model="agreed" />
      I agree to the terms
    </label>
  </div>
  <div step step-label="Done">
    <h3>All Set!</h3>
    <p>Welcome, <span bind="name"></span>!</p>
  </div>
</div>`,

                table: `<div state="{ items: [] }">
  <div get="/api/items" as="items">
    <table sortable>
      <thead fixed-header>
        <tr>
          <th sort="name" sort-default="asc">Name</th>
          <th sort="value" sort-type="number">Value</th>
          <th sort="date" sort-type="date">Date</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr each="item in items" key="item.id">
          <td bind="item.name"></td>
          <td bind="item.value"></td>
          <td bind="item.date"></td>
          <td><button on:click="edit(item)">Edit</button></td>
        </tr>
      </tbody>
    </table>
  </div>
</div>`,

                tree: `<ul tree>
  <li branch="expanded">
    Documents
    <ul subtree>
      <li branch>
        Projects
        <ul subtree>
          <li>Report.pdf</li>
          <li>Slides.pptx</li>
        </ul>
      </li>
      <li>README.md</li>
    </ul>
  </li>
  <li branch>
    Photos
    <ul subtree>
      <li>Vacation.jpg</li>
      <li>Profile.png</li>
    </ul>
  </li>
</ul>`,

                split: `<div split style="height: 100vh">
  <div pane="250px" pane-min="150" pane-collapsible="true">
    <h3>Sidebar</h3>
    <nav>
      <a route="/">Home</a>
      <a route="/settings">Settings</a>
    </nav>
  </div>
  <div pane>
    <h3>Main Content</h3>
    <p>Resize the gutter to adjust panel sizes.</p>
  </div>
</div>`,

                nav: `<nav class="navbar">
  <a route="/" class="logo">App</a>
  <div class="nav-links">
    <a route="/" route-active="active">Home</a>
    <a route="/features" route-active="active">Features</a>
    <a route="/about" route-active="active">About</a>
    <a route="/contact" route-active="active">Contact</a>
  </div>
</nav>`,
            };

            let html = templates[type] || templates["card"];
            let description = `NoJS ${type} component template`;

            // Add feature hints
            const featureNotes: string[] = [];
            if (features.includes("i18n")) {
                featureNotes.push(
                    "Add t=\"key\" to text elements for i18n support"
                );
            }
            if (features.includes("animation")) {
                featureNotes.push(
                    'Add animate="fadeIn" or transition="slide" for animations'
                );
            }
            if (features.includes("dnd")) {
                featureNotes.push(
                    "Add drag/drop attributes for drag-and-drop support (requires @erickxavier/nojs-elements plugin: NoJS.use(NoJSElements))"
                );
            }
            if (features.includes("modal")) {
                featureNotes.push(
                    'Add modal="id", modal-open="id", modal-close for modal dialogs (requires @erickxavier/nojs-elements plugin: NoJS.use(NoJSElements))'
                );
            }
            if (features.includes("dropdown")) {
                featureNotes.push(
                    "Add dropdown, dropdown-toggle, dropdown-menu, dropdown-item for dropdown menus (requires @erickxavier/nojs-elements plugin: NoJS.use(NoJSElements))"
                );
            }
            if (features.includes("tooltip")) {
                featureNotes.push(
                    'Add tooltip="text" for hover/focus tooltips (requires @erickxavier/nojs-elements plugin: NoJS.use(NoJSElements))'
                );
            }
            if (features.includes("popover")) {
                featureNotes.push(
                    'Add popover="id", popover-trigger, popover-dismiss for click popovers (requires @erickxavier/nojs-elements plugin: NoJS.use(NoJSElements))'
                );
            }
            if (features.includes("toast")) {
                featureNotes.push(
                    'Add toast="expr" or use $toast() for toast notifications (requires @erickxavier/nojs-elements plugin: NoJS.use(NoJSElements))'
                );
            }
            if (features.includes("tabs")) {
                featureNotes.push(
                    "Add tabs, tab, panel for tab navigation (requires @erickxavier/nojs-elements plugin: NoJS.use(NoJSElements))"
                );
            }
            if (features.includes("tree")) {
                featureNotes.push(
                    "Add tree, branch, subtree for hierarchical tree views (requires @erickxavier/nojs-elements plugin: NoJS.use(NoJSElements))"
                );
            }
            if (features.includes("stepper")) {
                featureNotes.push(
                    "Add stepper, step for multi-step wizards with validation (requires @erickxavier/nojs-elements plugin: NoJS.use(NoJSElements))"
                );
            }
            if (features.includes("skeleton")) {
                featureNotes.push(
                    'Add skeleton="loading" for shimmer loading placeholders (requires @erickxavier/nojs-elements plugin: NoJS.use(NoJSElements))'
                );
            }
            if (features.includes("split")) {
                featureNotes.push(
                    "Add split, pane for resizable split panels (requires @erickxavier/nojs-elements plugin: NoJS.use(NoJSElements))"
                );
            }
            if (features.includes("table")) {
                featureNotes.push(
                    "Add sortable, sort, fixed-header, fixed-col for sortable tables (requires @erickxavier/nojs-elements plugin: NoJS.use(NoJSElements))"
                );
            }

            let output = `## Generated ${type} template\n\n\`\`\`html\n${html}\n\`\`\`\n`;
            if (featureNotes.length > 0) {
                output += `\n## Feature Notes\n\n${featureNotes.map((n) => `- ${n}`).join("\n")}\n`;
            }

            return {
                content: [{ type: "text" as const, text: output }],
            };
        }
    );

    // ── get_cheatsheet ──
    server.tool(
        "get_cheatsheet",
        "Get a condensed NoJS directive cheatsheet for quick reference",
        {},
        async () => {
            const cheatsheet = loadDoc("cheatsheet.md");
            return {
                content: [{ type: "text" as const, text: cheatsheet }],
            };
        }
    );
}
