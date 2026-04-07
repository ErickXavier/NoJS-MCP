# Tooltip

> **Plugin required:** Tooltip is part of the `@erickxavier/nojs-elements` plugin. CDN auto-installs; for ESM, register with `NoJS.use(NoJSElements)`.

## `tooltip` -- Show a Tooltip on Hover/Focus

```html
<!-- Basic tooltip -->
<button tooltip="Save your changes">Save</button>

<!-- Positioned below -->
<button tooltip="More options" tooltip-position="bottom">Menu</button>

<!-- Custom delay (500ms) -->
<button tooltip="Delete this item" tooltip-delay="500">Delete</button>

<!-- Disabled tooltip -->
<button tooltip="Not available" tooltip-disabled="isLocked">Action</button>
```

### Tooltip Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `tooltip` | string | *required* | The text content displayed in the tooltip |
| `tooltip-position` | `"top"` \| `"bottom"` \| `"left"` \| `"right"` | `"top"` | Placement relative to the trigger |
| `tooltip-delay` | number (ms) | `300` | Delay before the tooltip appears |
| `tooltip-disabled` | expression | -- | Reactive boolean; when truthy, prevents tooltip from showing |

---

## Positioning

Tooltips are positioned using viewport-aware calculations:

1. Placed relative to the trigger based on `tooltip-position`
2. An 8px gap separates the tooltip from the trigger
3. Position is clamped to keep a 4px margin from viewport edges

---

## CSS Classes

| Class | When Applied |
|-------|-------------|
| `.nojs-tooltip` | On the generated tooltip element |

Styles injected via `<style data-nojs-tooltip>`. Override in your own stylesheet.

---

## Accessibility

No.JS automatically adds:

- `role="tooltip"` on the tooltip element
- `aria-hidden="true/false"` reflecting visibility
- `aria-describedby` on the trigger pointing to the tooltip `id`
- **Escape** dismisses a visible tooltip when trigger has focus
- Shows on `focusin`, hides on `focusout` for keyboard accessibility
