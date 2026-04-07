# Split / Pane

> **Plugin required:** Split is part of the `@erickxavier/nojs-elements` plugin. CDN auto-installs; for ESM, register with `NoJS.use(NoJSElements)`.

## `split` -- Resizable Split Container

```html
<!-- Horizontal split (default) -->
<div split style="height: 400px">
  <div pane="30%">Left panel</div>
  <div pane>Right panel (fills remaining space)</div>
</div>

<!-- Vertical split -->
<div split="vertical" style="height: 600px">
  <div pane="200px">Top panel</div>
  <div pane>Bottom panel</div>
</div>

<!-- Custom gutter size -->
<div split split-gutter="12" style="height: 400px">
  <div pane>Left</div>
  <div pane>Right</div>
</div>

<!-- Persisted layout -->
<div split split-persist="editor-layout" style="height: 100vh">
  <div pane="250px" pane-min="150">Sidebar</div>
  <div pane>Editor</div>
  <div pane="300px">Preview</div>
</div>
```

### Split Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `split` | `"horizontal"` \| `"vertical"` | `"horizontal"` | Split direction |
| `split-gutter` | number (px) | `6` | Gutter width/height in pixels |
| `split-persist` | string | -- | localStorage key for saving/restoring sizes. Stored under `nojs-split:<key>` |

---

## `pane` -- Define a Pane

```html
<div pane="250px">Fixed 250px</div>
<div pane="30%">30% of container</div>
<div pane>Flexible (fills remaining)</div>
<div pane="300px" pane-min="150" pane-max="600">Constrained</div>
<div pane="250px" pane-min="100" pane-collapsible="true">Collapsible</div>
```

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `pane` | string (CSS size) | -- | Initial size (`"250px"`, `"30%"`). Omit for flexible |
| `pane-min` | number (px) | `0` | Minimum pane size |
| `pane-max` | number (px) | `Infinity` | Maximum pane size |
| `pane-collapsible` | `"true"` | -- | Double-click gutter to collapse/expand |

---

## Nested Splits

```html
<div split style="height: 100vh">
  <div pane="250px" pane-min="150" pane-collapsible="true">Sidebar</div>
  <div pane>
    <div split="vertical" style="height: 100%">
      <div pane>Editor</div>
      <div pane="200px" pane-min="100">Terminal</div>
    </div>
  </div>
</div>
```

---

## Persisted Layout

Sizes saved to `localStorage` after every resize. Restored on page load. Discarded if pane count changes.

---

## Events

| Event | `$event.detail` | Description |
|-------|-----------------|-------------|
| `on:split-resize` | `{ prevPane, nextPane }` | After drag resize ends |
| `on:split-collapse` | `{ pane, collapsed }` | Pane collapsed/expanded via double-click |

---

## CSS Classes

| Class | When applied |
|-------|-------------|
| `.nojs-split` | On the split container |
| `.nojs-pane` | On each pane |
| `.nojs-gutter` | On each gutter |
| `.nojs-pane[data-collapsed="true"]` | On collapsed panes |

### CSS Custom Properties

| Property | Default | Description |
|----------|---------|-------------|
| `--nojs-gutter-size` | `6px` | Gutter width/height |

Gutter uses `color-mix()` for theme-adaptive coloring. Focus-visible gets `2px solid highlight` outline.

---

## Accessibility

No.JS automatically adds:

- `role="separator"` on each gutter
- `aria-orientation` (vertical for horizontal splits, horizontal for vertical)
- `aria-valuenow`, `aria-valuemin`, `aria-valuemax` reflecting pane sizes
- `aria-label="Resize"` on gutters
- `tabindex="0"` for keyboard focus

### Keyboard Navigation

| Key | Action |
|-----|--------|
| `ArrowRight` / `ArrowDown` | Expand preceding pane by 10px |
| `ArrowLeft` / `ArrowUp` | Shrink preceding pane by 10px |
| `Home` | Collapse to minimum |
| `End` | Expand to maximum |

All keyboard resizes respect `pane-min` / `pane-max` and trigger persistence.
