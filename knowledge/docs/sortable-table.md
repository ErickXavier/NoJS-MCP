# Sortable Table

> **Plugin required:** Sortable Table is part of the `@erickxavier/nojs-elements` plugin. CDN auto-installs; for ESM, register with `NoJS.use(NoJSElements)`.

## `sortable` -- Enable Table Sorting

Add to a `<table>` to enable column sorting. Works with `each` in `<tbody>` -- sorting mutates the data array and `each` re-renders rows.

```html
<div state="{ users: [
  { name: 'Alice', age: 30, email: 'alice@example.com' },
  { name: 'Bob', age: 25, email: 'bob@example.com' },
  { name: 'Carol', age: 35, email: 'carol@example.com' }
] }">
  <table sortable>
    <thead>
      <tr>
        <th sort="name">Name</th>
        <th sort="age" sort-type="number">Age</th>
        <th sort="email">Email</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      <tr each="user in users">
        <td bind="user.name"></td>
        <td bind="user.age"></td>
        <td bind="user.email"></td>
        <td><button on:click="alert(user.name)">View</button></td>
      </tr>
    </tbody>
  </table>
</div>
```

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `sortable` | boolean attr | -- | Enables sort coordination on the table |

---

## `sort` -- Sortable Column

Place on `<th>` inside a `sortable` table. Value is the property key for sorting.

```html
<th sort="name">Name</th>
<th sort="age" sort-type="number">Age</th>
<th sort="createdAt" sort-type="date">Created</th>
<th sort="name" sort-default="asc">Name (sorted on load)</th>
```

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `sort` | string | *required* | Property key to sort by |
| `sort-type` | `"string"` \| `"number"` \| `"date"` | `"string"` | Comparator type |
| `sort-default` | `"asc"` \| `"desc"` | -- | Initial sort direction on load |

### Sort Cycling

Clicking cycles three states:

1. **Ascending** -- `data-sort-dir="asc"`, shows up arrow
2. **Descending** -- `data-sort-dir="desc"`, shows down arrow
3. **None** -- removes `data-sort-dir`, restores original order

Clicking a different column resets the previous one.

### Typed Sorting

| `sort-type` | Behavior |
|-------------|----------|
| `"string"` | `localeCompare` -- locale-aware alphabetical |
| `"number"` | Numeric comparison |
| `"date"` | `new Date().getTime()` -- chronological |

`null`/`undefined` values sort before all others.

---

## `fixed-header` -- Sticky Table Header

```html
<div style="height: 400px; overflow: auto">
  <table sortable>
    <thead fixed-header>
      <tr>
        <th sort="name">Name</th>
        <th sort="age" sort-type="number">Age</th>
      </tr>
    </thead>
    <tbody>
      <tr each="user in users">
        <td bind="user.name"></td>
        <td bind="user.age"></td>
      </tr>
    </tbody>
  </table>
</div>
```

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `fixed-header` | boolean attr | -- | `position: sticky; top: 0` on `<thead>` |

---

## `fixed-col` -- Sticky Column

Pin a column to the left edge during horizontal scrolling.

```html
<div style="width: 600px; overflow: auto">
  <table sortable>
    <thead fixed-header>
      <tr>
        <th sort="name" fixed-col>Name</th>
        <th sort="age" sort-type="number">Age</th>
        <th sort="email">Email</th>
      </tr>
    </thead>
    <tbody>
      <tr each="user in users">
        <td fixed-col bind="user.name"></td>
        <td bind="user.age"></td>
        <td bind="user.email"></td>
      </tr>
    </tbody>
  </table>
</div>
```

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `fixed-col` | boolean attr | -- | `position: sticky; left: 0` |

---

## CSS Classes

| Class | When applied |
|-------|-------------|
| `.nojs-sortable` | On the table |
| `.nojs-fixed-header` | On the `<thead>` |
| `.nojs-fixed-col` | On `<th>`/`<td>` with `fixed-col` |

### Data Attributes

| Attribute | Values | Description |
|-----------|--------|-------------|
| `data-sortable` | (presence) | Marks `<th>` as sortable |
| `data-sort-dir` | `"asc"` \| `"desc"` | Current sort direction |

### Sort Indicators (CSS `::after`)

| State | Content | Opacity |
|-------|---------|---------|
| Unsorted | Up-down arrows | 0.3 |
| Ascending | Up triangle | 1 |
| Descending | Down triangle | 1 |

### Z-Index Stacking

| Element | `z-index` |
|---------|-----------|
| `.nojs-fixed-col` | 1 |
| `.nojs-fixed-header` | 2 |
| `.nojs-fixed-header .nojs-fixed-col` | 3 |

---

## Accessibility

No.JS automatically adds:

- `aria-sort="none"` on sortable `<th>` (initial)
- `aria-sort="ascending"` when sorted ascending
- `aria-sort="descending"` when sorted descending
- `cursor: pointer` and `user-select: none` on sortable headers

### How Sorting Works

The `sort` directive mutates the data array in context (does not reorder DOM). The `each` directive detects the change and re-renders. When reset to "none", original order is restored.
