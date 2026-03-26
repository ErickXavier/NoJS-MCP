import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { loadJSON, loadDoc, listDocs } from "../knowledge.js";
import type { DirectivesKB, FiltersKB, ApiKB, PluginsKB } from "../knowledge.js";

export function registerResources(server: McpServer): void {
    // ── Documentation resources ──
    const docs = listDocs();

    for (const doc of docs) {
        server.resource(
            `docs-${doc}`,
            `nojs://docs/${doc}`,
            {
                description: `NoJS documentation: ${doc.replace(/-/g, " ")}`,
                mimeType: "text/markdown",
            },
            async () => ({
                contents: [
                    {
                        uri: `nojs://docs/${doc}`,
                        mimeType: "text/markdown" as const,
                        text: loadDoc(`${doc}.md`),
                    },
                ],
            })
        );
    }

    // ── Directive reference ──
    server.resource(
        "ref-directives",
        "nojs://ref/directives",
        {
            description:
                "Complete reference of all NoJS directives with syntax and examples",
            mimeType: "application/json",
        },
        async () => {
            const kb = loadJSON<DirectivesKB>("directives.json");
            return {
                contents: [
                    {
                        uri: "nojs://ref/directives",
                        mimeType: "application/json" as const,
                        text: JSON.stringify(kb, null, 2),
                    },
                ],
            };
        }
    );

    // ── API reference ──
    server.resource(
        "ref-api",
        "nojs://ref/api",
        {
            description: "NoJS public API reference (config, init, directive, filter, etc.)",
            mimeType: "application/json",
        },
        async () => {
            const kb = loadJSON<ApiKB>("api.json");
            return {
                contents: [
                    {
                        uri: "nojs://ref/api",
                        mimeType: "application/json" as const,
                        text: JSON.stringify(kb, null, 2),
                    },
                ],
            };
        }
    );

    // ── Filters reference ──
    server.resource(
        "ref-filters",
        "nojs://ref/filters",
        {
            description: "All 32 built-in NoJS filters with syntax and examples",
            mimeType: "application/json",
        },
        async () => {
            const kb = loadJSON<FiltersKB>("filters.json");
            return {
                contents: [
                    {
                        uri: "nojs://ref/filters",
                        mimeType: "application/json" as const,
                        text: JSON.stringify(kb, null, 2),
                    },
                ],
            };
        }
    );

    // ── Plugins reference ──
    server.resource(
        "ref-plugins",
        "nojs://ref/plugins",
        {
            description:
                "NoJS plugin system reference: registration, lifecycle, globals, sentinels, and security",
            mimeType: "application/json",
        },
        async () => {
            const kb = loadJSON<PluginsKB>("plugins.json");
            return {
                contents: [
                    {
                        uri: "nojs://ref/plugins",
                        mimeType: "application/json" as const,
                        text: JSON.stringify(kb, null, 2),
                    },
                ],
            };
        }
    );
}
