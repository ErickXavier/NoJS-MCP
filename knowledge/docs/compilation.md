# Compilation (AOT Expression Compiler)

## Concept

No.JS is a zero-build framework by design, but for production deployments the CLI provides an **ahead-of-time (AOT) compiler** that pre-compiles directive expressions during the build step. This eliminates runtime parsing overhead without changing the developer experience.

The compiler operates at **build time** via the `nojs build` command and produces **the same HTML** augmented with pre-compiled data. No source format changes are required.

---

## Compilation Levels

The compiler produces output at four levels. Levels 1 and 2 are always generated; levels 3 and 4 are enabled by default but can be limited via the `--compile` flag.

| Level | Name | What it produces | Runtime benefit |
|-------|------|------------------|-----------------|
| **1** | AST Cache | Pre-parsed AST stored in a `<script id="__nojs_ast_cache" type="application/json">` block | Skips expression parsing entirely |
| **2** | Template Descriptors | Directive metadata per `<template>`, stored in `<script id="__nojs_descriptors" type="application/json">` | Skips re-analyzing template bindings on each instantiation |
| **3** | Compiled Functions | Pre-compiled JavaScript functions in `<script id="__nojs_compiled">`, registered in `NoJS._compiled` | Eliminates the expression evaluator for compiled expressions |
| **4** | Template Factories | Self-contained factory functions in `<script id="__nojs_factories">`, registered in `NoJS._factories` | Instantiates templates with zero runtime parsing |

---

## CLI Usage

```bash
# Full compilation (levels 1-4, default)
nojs build

# AST cache only (level 1) — smaller output, still benefits parsing
nojs build --compile 1

# Dry run — see which files would be processed
nojs build --dry-run
```

> **Note:** Compilation is fully integrated into the `nojs build` command. The Rust CLI includes a 25-pass compiler with no external plugins or configuration files needed.

---

## How It Works

### 1. Expression Analysis

The compiler walks every element in each HTML file, collects directive attributes (`bind`, `if`, `on:click`, `class-*`, `style-*`, etc.), and classifies each expression:

- **pure** — read-only expression (e.g., `user.name`, `count + 1`)
- **statement** — mutating expression (e.g., `count++`, `items.push(item)`)
- **pipe** — filter chain (e.g., `price | currency`)
- **interpolation** — URL/string with `{placeholder}` patterns
- **uncompilable** — cannot be statically compiled; falls back to runtime

### 2. Code Generation

For compilable expressions, the code generator emits scope-prefixed JavaScript functions:

```javascript
// Source: bind="user.name"
// Compiled: (s) => s.user.name

// Source: on:click="count++"
// Compiled: (s) => { s.count++; }

// Source: bind="price | currency"
// Compiled: (s) => NoJS._filters.currency(s.price)
```

### 3. Deduplication

Identical expressions across elements share a single compiled function. Each element is annotated with `data-nojs-e` mapping directive names to function indices.

### 4. Injection

Compiled output is injected as `<script>` blocks before `</body>`. The `data-nojs-compiler` attribute marks all injected blocks.

---

## Output Attributes

| Attribute | Injected by | Purpose |
|-----------|-------------|---------|
| `data-nojs-e` | Compiler | Maps directive names to compiled function indices on each element |
| `data-nojs-desc` | Compiler | Marks a `<template>` as having a pre-compiled descriptor |

These are **compiler output** attributes. They should never be authored manually.

---

## Runtime API (Internal)

The compiler populates three internal properties on the `NoJS` object:

| Property | Type | Description |
|----------|------|-------------|
| `NoJS._compiled` | Array | Pre-compiled expression functions, indexed by `data-nojs-e` values |
| `NoJS._factories` | Object | Template factory functions keyed by template ID |
| `NoJS._filters` | Object | Reference to the filters registry, used by compiled pipe expressions |

These are **internal APIs** consumed by the framework's directive handlers. They are not part of the public API and should not be called directly.

---

## Example: Before and After

### Before compilation

```html
<div state="{ count: 0 }">
  <span bind="count"></span>
  <button on:click="count++">Increment</button>
</div>
```

### After `nojs build`

```html
<div state="{ count: 0 }">
  <span bind="count" data-nojs-e="0">Loading...</span>
  <button on:click="count++" data-nojs-e="1">Increment</button>
</div>

<script id="__nojs_ast_cache" type="application/json" data-nojs-compiler>
{"0":{"type":"Identifier","name":"count"},"1":{"type":"PostfixExpr","op":"++","argument":{"type":"Identifier","name":"count"}}}
</script>

<script id="__nojs_compiled" data-nojs-compiler>
(function(__nojs){
  "use strict";
  // [0] count
  __nojs._compiled[0] = (s) => s.count;
  // [1] count++
  __nojs._compiled[1] = (s) => { s.count++; };
})(window.__nojs||(window.__nojs={}));
</script>
```

---

## Dev vs Production Workflow

| Environment | Command | Compilation |
|-------------|---------|-------------|
| **Development** | `nojs serve` | None — expressions parsed at runtime for fast iteration |
| **Production** | `nojs build --output dist/` | Full AOT compilation for maximum performance |
| **CI/CD** | `nojs build` | Compile in-place as part of the build pipeline |

The compiled output is **backward-compatible**. If the `data-nojs-e` attribute is present, the runtime uses the pre-compiled function; otherwise it falls back to runtime parsing. This means compiled and non-compiled pages can coexist.
