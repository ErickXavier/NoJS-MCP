# Dropdown

> **Plugin required:** Dropdown is part of the `@erickxavier/nojs-elements` plugin. CDN auto-installs; for ESM, register with `NoJS.use(NoJSElements)`.

## `dropdown` -- Container

Wraps a toggle, menu, and items into a single dropdown unit. Uses the native Popover API for light-dismiss.

```html
<!-- Basic dropdown -->
<div dropdown>
  <button dropdown-toggle>Options</button>
  <ul dropdown-menu>
    <li dropdown-item>Edit</li>
    <li dropdown-item>Duplicate</li>
    <li dropdown-item>Delete</li>
  </ul>
</div>

<!-- Positioned to the right, aligned to end -->
<div dropdown dropdown-position="right" dropdown-align="end">
  <button dropdown-toggle>More</button>
  <ul dropdown-menu>
    <li dropdown-item>Settings</li>
    <li dropdown-item>Logout</li>
  </ul>
</div>
```

### Container Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `dropdown` | boolean attr | *required* | Marks the wrapper element |
| `dropdown-position` | `"bottom"` \| `"top"` \| `"left"` \| `"right"` | `"bottom"` | Primary axis for menu placement |
| `dropdown-align` | `"start"` \| `"end"` | `"start"` | Cross-axis alignment relative to the toggle |

The menu uses `position: fixed` and auto-flips when it would overflow the viewport.

---

## `dropdown-toggle` -- Trigger Button

Opens/closes the dropdown menu on click. Must be inside a `[dropdown]` container.

```html
<div dropdown>
  <button dropdown-toggle>Click me</button>
  <ul dropdown-menu>
    <li dropdown-item>Option A</li>
  </ul>
</div>
```

---

## `dropdown-menu` -- Popover Menu

The menu panel that appears when the toggle is activated. Uses `popover="auto"` for native light-dismiss.

---

## `dropdown-item` -- Menu Item

An actionable item inside the dropdown menu. Supports disabled state.

```html
<div dropdown>
  <button dropdown-toggle>File</button>
  <ul dropdown-menu>
    <li dropdown-item>New</li>
    <li dropdown-item>Open</li>
    <li dropdown-item disabled>Save (read-only)</li>
    <li dropdown-item>Export</li>
  </ul>
</div>
```

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `dropdown-item` | boolean attr | *required* | Marks the element as a menu item |
| `disabled` | boolean attr | -- | Disables the item (skipped during keyboard navigation) |

---

## Keyboard Navigation

| Key | On toggle | On item |
|-----|-----------|---------|
| **Enter** / **Space** | Opens menu, focuses first item | Activates item |
| **Arrow Down** | Opens menu, focuses first item | Next item (wraps) |
| **Arrow Up** | Opens menu, focuses last item | Previous item (wraps) |
| **Home** | -- | First item |
| **End** | -- | Last item |
| **Escape** | -- | Closes menu, returns focus to toggle |
| **Tab** | -- | Closes menu, returns focus to toggle |

---

## CSS Classes

| Class | When applied |
|-------|-------------|
| `.nojs-dropdown-menu` | On the menu element |
| `.nojs-dropdown-item` | On each item element |
| `.nojs-dropdown-item[aria-disabled="true"]` | On disabled items |
| `.nojs-dropdown-item:focus-visible` | On currently focused item |

Menu uses `position: fixed`, `z-index: 9999`, `min-width: max-content`.

---

## Accessibility

No.JS automatically adds:

- `aria-haspopup="menu"` on the toggle
- `aria-expanded="true/false"` on the toggle
- `aria-controls` linking toggle to menu
- `role="menu"` on the menu
- `role="menuitem"` on each item
- `tabindex="-1"` on items (roving focus)
- `aria-disabled="true"` on disabled items
