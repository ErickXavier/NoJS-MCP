# Tabs

> **Plugin required:** Tabs is part of the `@erickxavier/nojs-elements` plugin. CDN auto-installs; for ESM, register with `NoJS.use(NoJSElements)`.

## `tabs` -- Tab Container

```html
<!-- Basic tabs (first tab active by default) -->
<div tabs>
  <button tab>Profile</button>
  <button tab>Settings</button>
  <button tab>Billing</button>

  <div panel>Profile content...</div>
  <div panel>Settings content...</div>
  <div panel>Billing content...</div>
</div>

<!-- Activate a specific tab (0-based index) -->
<div tabs="2">
  <button tab>Tab A</button>
  <button tab>Tab B</button>
  <button tab>Tab C (active)</button>

  <div panel>Panel A</div>
  <div panel>Panel B</div>
  <div panel>Panel C</div>
</div>

<!-- Vertical tabs on the left -->
<div tabs tab-position="left">
  <button tab>One</button>
  <button tab>Two</button>
  <div panel>Panel One</div>
  <div panel>Panel Two</div>
</div>
```

### Tabs Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `tabs` | number (0-based) | `0` | Initial active tab index |
| `tab-position` | `"top"` \| `"bottom"` \| `"left"` \| `"right"` | `"top"` | Placement of the tab list relative to panels |

---

## `tab` -- Tab Button

Marks a direct child of `[tabs]` as a tab trigger. Paired with `[panel]` by order.

```html
<div tabs>
  <button tab>Enabled</button>
  <button tab tab-disabled="true">Disabled</button>
  <button tab>Also enabled</button>

  <div panel>First panel</div>
  <div panel>Second panel</div>
  <div panel>Third panel</div>
</div>
```

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `tab` | boolean attr | *required* | Marks the element as a tab trigger |
| `tab-disabled` | expression | `false` | When truthy, tab cannot be activated |

---

## `panel` -- Tab Panel

Marks a direct child of `[tabs]` as a panel. Paired with tabs by order.

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `panel` | boolean attr | *required* | Marks the element as a tab panel |

---

## Keyboard Navigation

| Key | Action |
|-----|--------|
| `ArrowRight` / `ArrowDown` | Next enabled tab (wraps) |
| `ArrowLeft` / `ArrowUp` | Previous enabled tab (wraps) |
| `Home` | First enabled tab |
| `End` | Last enabled tab |
| `Tab` | Move focus into the active panel |

Disabled tabs are skipped during navigation.

---

## CSS Classes

| Class | When applied |
|-------|-------------|
| `.nojs-tabs` | On the container |
| `.nojs-tablist` | On the generated `role="tablist"` wrapper |
| `.nojs-tab` | On each tab element |
| `.nojs-panel` | On each panel element |

The container receives `data-position` for custom styling:

```css
.nojs-tabs[data-position="left"] .nojs-tablist {
  border-right: 2px solid #ccc;
}
```

### Built-in Behavior

| Selector | Style |
|----------|-------|
| `.nojs-tab[aria-disabled="true"]` | `pointer-events: none; opacity: 0.5` |
| `.nojs-panel[aria-hidden="true"]` | `display: none` |
| `.nojs-tabs[data-position="left/right"]` | Horizontal flex layout |
| `.nojs-tabs[data-position="bottom"]` | Reversed column layout |

---

## Accessibility

No.JS automatically adds:

- `role="tablist"` on the tab list wrapper
- `role="tab"` on each tab with `aria-selected` and `aria-controls`
- `role="tabpanel"` on each panel with `aria-labelledby`
- Roving `tabindex` (active tab gets `0`, others get `-1`)
- `aria-hidden="true"` and `inert` on inactive panels
- `aria-disabled="true"` on disabled tabs
