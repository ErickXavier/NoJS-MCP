# Popover

> **Plugin required:** Popover is part of the `@erickxavier/nojs-elements` plugin. CDN auto-installs; for ESM, register with `NoJS.use(NoJSElements)`.

## `popover` -- Declare Popover Content

```html
<!-- Popover with trigger and dismiss -->
<button popover-trigger="user-menu">Account</button>

<div popover="user-menu">
  <nav>
    <a href="/profile">Profile</a>
    <a href="/settings">Settings</a>
    <button popover-dismiss>Close</button>
  </nav>
</div>

<!-- Popover positioned to the right -->
<button popover-trigger="help-tip">?</button>

<div popover="help-tip" popover-position="right">
  <p>Click here for more information about this feature.</p>
  <button popover-dismiss>Got it</button>
</div>
```

### Popover Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `popover` | string (ID) | auto | Unique ID linking to trigger(s). Auto-generated if omitted |
| `popover-position` | `"top"` \| `"bottom"` \| `"left"` \| `"right"` | `"bottom"` | Placement relative to the trigger |

---

## `popover-trigger` -- Open a Popover

Toggles the target popover on click. Without ID, finds nearest popover in scope.

```html
<button popover-trigger="my-popover">Toggle</button>
<button popover-trigger>Toggle (nearest)</button>
```

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `popover-trigger` | string (ID) | auto | The `popover` ID to toggle. Finds nearest if omitted |

---

## `popover-dismiss` -- Close from Inside

Place inside a `[popover]` element. Closes the closest ancestor popover on click.

```html
<div popover="info-panel">
  <p>Some content here.</p>
  <button popover-dismiss>Dismiss</button>
</div>
```

---

## Positioning

Popovers are positioned using viewport-aware calculations:

1. Placed relative to the trigger based on `popover-position`
2. An 8px gap separates the popover from the trigger
3. Flip logic: if the popover overflows, it flips to the opposite side
4. Clamped to keep a 4px margin from viewport edges

---

## CSS Classes

| Class | When Applied |
|-------|-------------|
| `.nojs-popover` | On popover elements |

Styles injected via `<style data-nojs-popover>`. Override in your own stylesheet.

---

## Accessibility

No.JS automatically adds:

- `aria-haspopup="true"` on triggers
- `aria-expanded="true/false"` on triggers
- `aria-controls` on triggers pointing to the popover ID
- Uses native Popover API (`popover="auto"`) for light-dismiss (click outside closes)
