# Modal

> **Plugin required:** Modal is part of the `@erickxavier/nojs-elements` plugin. CDN auto-installs; for ESM, register with `NoJS.use(NoJSElements)`.

## `modal` -- Declare a Modal Dialog

Uses the native Popover API (`popover="manual"`) for overlay behavior, combined with focus trapping, stacking z-index, and ARIA attributes.

```html
<!-- Basic modal -->
<button modal-open="confirm-delete">Delete account</button>

<div modal="confirm-delete">
  <h2>Are you sure?</h2>
  <p>This action cannot be undone.</p>
  <button modal-close>Cancel</button>
  <button modal-close on:click="deleteAccount()">Confirm</button>
</div>

<!-- Modal with dynamic NoJS content -->
<button modal-open="edit-user">Edit Profile</button>

<div modal="edit-user" modal-class="dialog-wide">
  <h2>Edit <span bind="user.name"></span></h2>
  <form>
    <input model="user.name" />
    <input model="user.email" />
    <button modal-close on:click="save()">Save</button>
    <button modal-close>Cancel</button>
  </form>
</div>

<!-- Modal with Escape disabled -->
<div modal="critical-action" modal-escape="false">
  <h2>Processing...</h2>
  <p>Please wait while we complete the operation.</p>
  <button modal-close>Done</button>
</div>

<!-- Modal without backdrop -->
<div modal="no-backdrop" modal-backdrop="false">
  <h2>Transparent Overlay</h2>
  <button modal-close>Close</button>
</div>
```

### Modal Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `modal` | string (ID) | -- | Unique ID linking this modal to its triggers. Auto-generated if empty |
| `modal-class` | string | -- | Additional CSS class(es) applied while the modal is open |
| `modal-escape` | `"true"` \| `"false"` | `"true"` | Set to `"false"` to disable closing with Escape key and backdrop click |
| `modal-backdrop` | `"true"` \| `"false"` | `"true"` | Set to `"false"` to remove the dark backdrop overlay |

---

## `modal-open` -- Open a Modal

Binds a click handler that opens the target modal by ID. Pushes the modal onto the stack for nested modal support.

```html
<button modal-open="my-dialog">Open Dialog</button>
<a href="#" modal-open="help-modal">Need help?</a>
```

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `modal-open` | string (ID) | -- | The `modal` ID to open. Without value, finds nearest modal in scope |

---

## `modal-close` -- Close a Modal

Without a value, closes the closest ancestor modal. With a value, closes the specific modal by ID.

```html
<button modal-close>Cancel</button>
<button modal-close="settings-modal">Close Settings</button>
```

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `modal-close` | string (ID) \| empty | -- | Without value: closes closest ancestor. With value: closes by ID |

---

## Stacking (Nested Modals)

Modals are managed with an internal stack. Each new modal opens above the previous one:

- Base z-index starts at `10000`
- Each stacked modal increments by `1` (10001, 10002, ...)
- When a modal closes, focus returns to its trigger

---

## Template Usage

```html
<template id="confirm-tpl">
  <div modal>
    <h2 bind="title"></h2>
    <p bind="message"></p>
    <button modal-close>Cancel</button>
    <button modal-close on:click="onConfirm()">Confirm</button>
  </div>
</template>

<div use="confirm-tpl"
     var-title="'Delete account?'"
     var-message="'This action cannot be undone.'"
     var-onConfirm="deleteAccount">
</div>
```

---

## CSS Classes

| Class | When Applied |
|-------|-------------|
| `.nojs-modal` | On all modal elements |
| `.nojs-modal::backdrop` | Native backdrop overlay (dark semi-transparent) |
| `.nojs-modal[data-nojs-no-backdrop]::backdrop` | Transparent backdrop when `modal-backdrop="false"` |

---

## Accessibility

No.JS automatically adds:

- `role="dialog"` on the modal element
- `aria-modal="true"` on the modal element
- `aria-labelledby` pointing to the first heading inside
- `aria-haspopup="dialog"` on trigger buttons
- `aria-expanded="true/false"` on triggers
- `aria-controls` on triggers pointing to the modal ID
- Auto-generated `id` on the modal and heading for linking

### Keyboard Navigation

- **Tab** / **Shift+Tab** cycle through focusable elements (focus trap)
- **Escape** closes the topmost modal (unless `modal-escape="false"`)
- On open, focus moves to the first focusable element
- On close, focus returns to the trigger element
