# Stepper

> **Plugin required:** Stepper is part of the `@erickxavier/nojs-elements` plugin. CDN auto-installs; for ESM, register with `NoJS.use(NoJSElements)`.

## `stepper` -- Multi-Step Container

```html
<!-- Basic stepper (linear mode, validates before advancing) -->
<div stepper>
  <div step>
    <h3>Personal Info</h3>
    <input model="name" required />
    <input model="email" type="email" required />
  </div>
  <div step>
    <h3>Address</h3>
    <input model="street" required />
    <input model="city" required />
  </div>
  <div step>
    <h3>Confirmation</h3>
    <p>Name: <span bind="name"></span></p>
  </div>
</div>

<!-- Free mode (any step clickable) -->
<div stepper stepper-mode="free">
  <div step step-label="Account">...</div>
  <div step step-label="Profile">...</div>
  <div step step-label="Review">...</div>
</div>

<!-- Hide indicator and nav buttons -->
<div stepper stepper-indicator="false" stepper-nav="false">
  <div step>Manual control only</div>
  <div step>Use $stepper API</div>
</div>
```

### Stepper Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `stepper` | number | `0` | Initial step index (0-based) |
| `stepper-mode` | `"linear"` \| `"free"` | `"linear"` | Linear validates before advancing; free allows clicking any step |
| `stepper-indicator` | `"true"` \| `"false"` | `"true"` | Show/hide progress indicator |
| `stepper-nav` | `"true"` \| `"false"` | `"true"` | Show/hide Previous/Next buttons |

---

## `step` -- Step Content Panel

```html
<div stepper>
  <div step>Basic step (label: "Step 1")</div>
  <div step step-label="Payment">Custom label</div>
  <div step step-label="Review" step-validate="age >= 18">Custom validation</div>
</div>
```

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `step` | -- | -- | Marks element as a step panel |
| `step-label` | string | `"Step N"` | Custom label in the indicator |
| `step-validate` | expression | -- | Must be truthy for step to pass validation (linear mode) |

---

## `$stepper` Context API

Available inside any stepper container:

```html
<div stepper>
  <div step>
    <h3>Step <span bind="$stepper.current + 1"></span> of <span bind="$stepper.total"></span></h3>
  </div>
  <div step><p>Done!</p></div>

  <button on:click="$stepper.prev()" disabled="$stepper.isFirst">Back</button>
  <button on:click="$stepper.next()" hidden="$stepper.isLast">Continue</button>
  <button on:click="submit()" show="$stepper.isLast">Submit</button>
</div>
```

### Properties

| Property | Type | Description |
|----------|------|-------------|
| `$stepper.current` | number | Current step index (0-based) |
| `$stepper.total` | number | Total steps |
| `$stepper.isFirst` | boolean | On first step |
| `$stepper.isLast` | boolean | On last step |

### Methods

| Method | Returns | Description |
|--------|---------|-------------|
| `$stepper.next()` | boolean | Advance (validates in linear mode) |
| `$stepper.prev()` | boolean | Go back |
| `$stepper.goTo(index)` | boolean | Jump to step (validates intermediates in linear mode) |

---

## Events

| Event | `$event.detail` | Description |
|-------|-----------------|-------------|
| `step-change` | `{ current, total }` | Dispatched when active step changes |

---

## Linear Mode Validation

In linear mode, validates before advancing:

1. All `[required]` inputs via `checkValidity()` / `reportValidity()`
2. The `step-validate` expression (if present) must be truthy

Going backward never requires validation.

---

## CSS Classes

| Class | When applied |
|-------|-------------|
| `.nojs-stepper` | On the container |
| `.nojs-stepper-indicator` | On the progress indicator |
| `.nojs-stepper-indicator-item` | On each step button in indicator |
| `.nojs-stepper-indicator-item[aria-selected="true"]` | Active step (bold) |
| `.nojs-stepper-indicator-item[data-completed]` | Completed steps (checkmark) |
| `.nojs-stepper-indicator-item[data-clickable]` | Clickable steps (free mode) |
| `.nojs-stepper-separator` | Line between indicator items |
| `.nojs-step` | On each step panel |
| `.nojs-step[aria-hidden="true"]` | Inactive panels (`display: none`) |
| `.nojs-stepper-nav` | Navigation button container |
| `.nojs-stepper-prev` | Previous button |
| `.nojs-stepper-next` | Next button (text: "Finish" on last step) |

---

## Accessibility

No.JS automatically adds:

- `role="group"` and `aria-label` on stepper
- `role="tablist"` on the indicator
- `role="tab"` with `aria-selected` on indicator items
- `role="tabpanel"` on step panels
- `aria-controls` / `aria-labelledby` linking tabs to panels
- `aria-hidden="true"` and `inert` on inactive panels
- Roving tabindex across indicator items

### Keyboard

- **Arrow Right/Left** -- move between indicator items
- **Home** / **End** -- first/last indicator item
