# Skeleton

> **Plugin required:** Skeleton is part of the `@erickxavier/nojs-elements` plugin. CDN auto-installs; for ESM, register with `NoJS.use(NoJSElements)`.

## `skeleton` -- Loading Placeholder

Displays a shimmer animation over any element while a reactive expression is truthy. When the expression becomes falsy, the skeleton fades out and reveals real content.

```html
<!-- Basic text skeleton -->
<h2 skeleton="loading">Article Title</h2>
<p skeleton="loading">This paragraph appears after loading completes.</p>

<!-- Circle avatar placeholder -->
<div skeleton="loading" skeleton-type="circle" skeleton-size="64"></div>

<!-- Multi-line text placeholder -->
<div skeleton="loading" skeleton-lines="3"></div>

<!-- Rectangular card placeholder -->
<div skeleton="loading" skeleton-type="rect" skeleton-size="200"></div>
```

### Skeleton Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `skeleton` | expression | *required* | Shows placeholder while truthy |
| `skeleton-type` | `"text"` \| `"circle"` \| `"rect"` | `"text"` | Shape of the placeholder |
| `skeleton-lines` | number | -- | Number of text lines to generate (last line is 60% width) |
| `skeleton-size` | number \| string | -- | Width and height for `circle`/`rect` types. Appends `px` if bare number |

---

## Reactive Loading

```html
<div state="{ loading: true, user: null }">
  <div skeleton="loading" skeleton-lines="2" style="width: 300px; min-height: 48px;">
    <h3 bind="user.name"></h3>
    <p bind="user.email"></p>
  </div>
</div>
```

When active:
- Children become invisible (`opacity: 0`, `pointer-events: none`)
- Shimmer animation plays via `::after`
- Element dimensions maintained

When deactivated:
- `.nojs-skeleton-fade` transition fades out
- Content revealed

---

## Card Skeleton

```html
<div state="{ loading: true, post: null }">
  <div class="card" style="padding: 16px; max-width: 400px;">
    <div skeleton="loading" skeleton-type="circle" skeleton-size="48"
         style="border-radius: 50%; margin-bottom: 12px;">
      <img bind:src="post.authorAvatar" alt="" />
    </div>
    <h3 skeleton="loading" style="min-height: 1.5em;">
      <span bind="post.title"></span>
    </h3>
    <div skeleton="loading" skeleton-lines="3" style="min-height: 72px;">
      <p bind="post.body"></p>
    </div>
  </div>
</div>
```

---

## CSS Classes

| Class | When applied |
|-------|-------------|
| `.nojs-skeleton` | On element while skeleton is active |
| `.nojs-skeleton > *` | Children invisible |
| `.nojs-skeleton::after` | Shimmer animation overlay |
| `.nojs-skeleton-circle` | Circle type (`border-radius: 50%`) |
| `.nojs-skeleton-fade` | Transition during deactivation |
| `.nojs-skeleton-line` | Generated text line placeholders |
| `.nojs-skeleton-line:last-child` | Last line is 60% width |

Shimmer uses `@keyframes nojs-shimmer` with `color-mix()` for automatic dark mode compatibility.

---

## Accessibility

No.JS automatically adds:

- `aria-busy="true"` while skeleton is active
- `aria-busy` removed when deactivated
- Children hidden from interaction via `pointer-events: none`
