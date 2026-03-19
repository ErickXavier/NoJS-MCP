# @erickxavier/nojs-mcp

MCP (Model Context Protocol) server that provides AI assistants with deep knowledge of the **No.JS** framework — The HTML-First Reactive Framework.

## What is this?

This MCP server gives AI assistants (GitHub Copilot, Claude, Cursor, etc.) structured access to:

- **80+ directives** with syntax, examples, and usage notes
- **32 built-in filters** (text, numbers, arrays, dates, utility)
- **Full public API** reference (config, init, router, i18n, store, etc.)
- **23 documentation pages** (getting started, routing, forms, drag-and-drop, etc.)
- **Template validation** tool to catch NoJS syntax errors
- **Component scaffolding** for common UI patterns

## Installation

### VS Code / Cursor

Add to your MCP configuration (`.vscode/mcp.json` or settings):

```json
{
  "mcpServers": {
    "nojs": {
      "command": "npx",
      "args": ["-y", "@erickxavier/nojs-mcp"]
    }
  }
}
```

### Claude Desktop

Add to `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "nojs": {
      "command": "npx",
      "args": ["-y", "@erickxavier/nojs-mcp"]
    }
  }
}
```

## Resources

| URI | Description |
|-----|-------------|
| `nojs://ref/directives` | All directives with syntax and examples |
| `nojs://ref/api` | Complete public API reference |
| `nojs://ref/filters` | All 32 built-in filters |
| `nojs://docs/{topic}` | Documentation pages (getting-started, routing, forms-validation, etc.) |

## Tools

### `validate_template`
Validate a NoJS HTML template for syntax errors, typos, and best practices.

```
validate_template({ html: '<div bnd="name"></div>' })
// → Error: Unknown attribute "bnd" — did you mean "bind"?
```

### `explain_directive`
Get a detailed explanation of any NoJS directive.

```
explain_directive({ directive: "each" })
// → Full explanation with syntax, examples, and notes
```

### `list_directives`
List all directives, optionally filtered by category.

```
list_directives({ category: "data" })
// → All data-fetching directives (get, post, put, patch, delete, etc.)
```

**Categories:** `data`, `state`, `binding`, `conditionals`, `loops`, `events`, `styling`, `forms`, `routing`, `animation`, `dnd`, `i18n`, `refs`, `misc`

### `scaffold_component`
Generate NoJS component templates.

```
scaffold_component({ type: "form", features: ["validation", "i18n"] })
// → Complete login form with validation
```

**Types:** `form`, `list`, `detail`, `card`, `modal`, `nav`

### `get_cheatsheet`
Get a condensed directive cheatsheet for quick reference.

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Run locally
node dist/index.js
```

## Versioning

This package version always matches the No.JS framework version. Current: **1.9.1**

## Links

- [No.JS Framework](https://no-js.dev/)
- [No.JS GitHub](https://github.com/ErickXavier/no-js)
- [No.JS LSP](https://lsp.no-js.dev/)
- [NoJS Discord](https://discord.gg/CaSbGYg3xY)

## License

MIT © Erick Xavier
