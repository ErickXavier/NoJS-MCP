# Toast Notifications

> **Plugin required:** Toast is part of the `@erickxavier/nojs-elements` plugin. CDN auto-installs; for ESM, register with `NoJS.use(NoJSElements)`.

## `toast-container` -- Position Container

Defines where toast notifications appear on screen. Multiple containers can coexist. If none is declared, a default `top-right` container is auto-created on `<body>`.

```html
<div toast-container="top-right"></div>
<div toast-container="bottom-center"></div>
```

### Container Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `toast-container` | `"top-right"` \| `"top-left"` \| `"bottom-right"` \| `"bottom-left"` \| `"top-center"` \| `"bottom-center"` | `"top-right"` | Screen position |

---

## `toast` -- Declarative Directive

Watches an expression and shows a toast whenever the value changes to truthy.

```html
<div state="{ message: '' }">
  <button on:click="message = 'Hello!'" toast="message"
          toast-type="success" toast-duration="5000">
    Show Toast
  </button>
</div>

<!-- Error toast that stays until dismissed -->
<div toast="errorMsg" toast-type="error" toast-duration="0" toast-dismiss="true"></div>
```

### Declarative Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `toast` | expression | *required* | Watched expression -- shown when value changes to truthy |
| `toast-type` | `"info"` \| `"success"` \| `"warning"` \| `"error"` | `"info"` | Visual type (set as `data-type`) |
| `toast-duration` | number (ms) | `3000` | Auto-dismiss delay. `0` for permanent |
| `toast-dismiss` | `"true"` \| `"false"` | `"true"` | Show dismiss button |

---

## `$toast()` -- Global Function

Creates a toast programmatically from any expression context.

```html
<button on:click="$toast('Item saved!')">Save</button>
<button on:click="$toast('Deleted', 'error')">Delete</button>
<button on:click="$toast('Processing...', 'warning', 10000)">Process</button>
<button on:click="$toast('Connection lost', 'error', 0)">Permanent</button>
```

### Signature

```
$toast(message, type?, duration?) -> HTMLElement
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `message` | string | *required* | Toast text content |
| `type` | `"info"` \| `"success"` \| `"warning"` \| `"error"` | `"info"` | Visual type |
| `duration` | number (ms) | `3000` | Auto-dismiss delay. `0` for permanent |

---

## CSS Classes

| Class / Selector | When applied |
|------------------|-------------|
| `.nojs-toast-container` | On each toast container |
| `.nojs-toast-container[data-position="..."]` | Position-specific styling |
| `.nojs-toast` | On each toast element |
| `.nojs-toast[data-type="info"]` | Info toast styling hook |
| `.nojs-toast[data-type="success"]` | Success toast styling hook |
| `.nojs-toast[data-type="warning"]` | Warning toast styling hook |
| `.nojs-toast[data-type="error"]` | Error toast styling hook |
| `.nojs-toast-dismiss` | On the dismiss button |

Container uses `position: fixed`, `z-index: 10001`. Toasts use `popover="manual"`.

---

## Accessibility

No.JS automatically adds:

- `role="log"` on toast containers
- `aria-live="polite"` on containers (new toasts announced)
- `aria-relevant="additions"` on containers
- `aria-live="assertive"` on error toasts (announced immediately)
- `aria-label="Dismiss"` on the dismiss button
