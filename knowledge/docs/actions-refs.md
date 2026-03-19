# Actions & Refs

## `call` — Trigger API Requests from Any Element

Attach `call` to any clickable element to fire an HTTP request on click. It supports the same attributes as the HTTP directives (`get`, `post`, etc.), including loading templates, redirect, custom headers, and more.

```html
<!-- Logout button -->
<a call="/api/logout"
   method="post"
   success="#loggedOut"
   error="#logoutError"
   confirm="Are you sure you want to logout?">
  Logout
</a>

<!-- Like button -->
<button call="/api/posts/{post.id}/like"
        method="post"
        then="post.likes++">
  ❤️ <span bind="post.likes"></span>
</button>

<!-- Delete with confirmation -->
<button call="/api/items/{item.id}"
        method="delete"
        confirm="Delete this item?"
        then="items.splice($index, 1)">
  🗑 Delete
</button>

<!-- Write result to a global store -->
<button call="/api/me"
        method="get"
        into="currentUser">
  Load Profile
</button>
```

### Attributes

| Attribute | Type | Description |
|-----------|------|-------------|
| `call` | `string` | URL for the request (supports `{variable}` interpolation) |
| `method` | `string` | HTTP method. Default: `"get"` |
| `as` | `string` | Name to assign the response in the context. Default: `"data"` |
| `into` | `string` | Write response to a named global store |
| `body` | `string` | Request body (JSON string with `{variable}` interpolation) |
| `loading` | `string` | Template ID to show during the request (e.g. `"#spinner"`) |
| `success` | `string` | Template ID to render on success. Receives response via `var` |
| `error` | `string` | Template ID to render on error. Receives error via `var` |
| `then` | `string` | Expression to execute on success (e.g. `"items.push(result)"`) |
| `confirm` | `string` | Show browser `confirm()` dialog before sending |
| `redirect` | `string` | SPA route to navigate to on success |
| `headers` | `string` | JSON string of additional request headers |

### Loading Template

Show a loading indicator while the request is in flight. The element is **disabled** during loading and its content is restored afterwards.

```html
<button call="/api/deploy"
        method="post"
        loading="#deploySpinner"
        success="#deployDone">
  🚀 Deploy
</button>

<template id="deploySpinner">
  <span class="spinner"></span> Deploying…
</template>
```

### Custom Headers

Pass per-request headers as a JSON string:

```html
<button call="/api/admin/clear-cache"
        method="post"
        headers='{"X-Admin-Token": "abc123"}'>
  Clear Cache
</button>
```

### Redirect After Success

Navigate to an SPA route after a successful request:

```html
<button call="/api/onboarding/complete"
        method="post"
        redirect="/dashboard">
  Finish Setup →
</button>
```

### Abort / SwitchMap

Rapid clicks automatically **abort** the previous in-flight request before starting a new one, preventing race conditions. Only the result of the last click is applied.

### Events

`call` emits lifecycle events on the document:

- **`fetch:success`** — `{ url, data }` on successful response
- **`fetch:error`** — `{ url, error }` on failure

### Request Lifecycle

```
click → [confirm?] → [loading] → [success | error]
                                      ↓         ↓
                                 render tpl   render tpl
                                 exec `then`  log warning
                                 `redirect`
```

---

## `trigger` — Emit Custom Events

```html
<!-- Child emits an event -->
<button on:click trigger="item-selected" trigger-data="item">
  Select
</button>

<!-- Parent listens -->
<div on:item-selected="handleSelection($event.detail)">
  <div each="item in items" template="itemTpl"></div>
</div>
```

---

## `ref` — Named References

Access DOM elements without `querySelector`:

```html
<div state="{ }">
  <input ref="searchInput" type="text" />
  <canvas ref="chart"></canvas>
  <button on:click="$refs.searchInput.focus()">Focus Search</button>
</div>
```

---

## `$refs` — Ref Map

All elements with `ref` are accessible via `$refs` in the current scope:

```html
<video ref="player" src="video.mp4"></video>
<button on:click="$refs.player.play()">▶ Play</button>
<button on:click="$refs.player.pause()">⏸ Pause</button>
```

---

**Next:** [Custom Directives →](custom-directives.md)
