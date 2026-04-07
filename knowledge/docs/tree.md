# Tree

> **Plugin required:** Tree is part of the `@erickxavier/nojs-elements` plugin. CDN auto-installs; for ESM, register with `NoJS.use(NoJSElements)`.

## `tree` -- Tree Container

```html
<!-- Basic tree -->
<ul tree>
  <li branch>
    Documents
    <ul subtree>
      <li branch>
        Work
        <ul subtree>
          <li>Report.pdf</li>
          <li>Slides.pptx</li>
        </ul>
      </li>
      <li>README.md</li>
    </ul>
  </li>
  <li branch>
    Photos
    <ul subtree>
      <li>Vacation.jpg</li>
      <li>Profile.png</li>
    </ul>
  </li>
</ul>

<!-- Hide built-in icons -->
<ul tree tree-icon="false">
  <li branch>
    <span class="custom-icon">&#128193;</span> Folder
    <ul subtree>
      <li>File A</li>
    </ul>
  </li>
</ul>
```

### Tree Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `tree` | boolean attr | *required* | Marks the element as a tree root |
| `tree-icon` | `"true"` \| `"false"` | `"true"` | Show/hide built-in expand/collapse triangle icons |

---

## `branch` -- Expandable Tree Item

```html
<ul tree>
  <!-- Collapsed by default -->
  <li branch>Closed folder<ul subtree><li>file.txt</li></ul></li>

  <!-- Starts expanded -->
  <li branch="expanded">Open folder<ul subtree><li>file.txt</li></ul></li>
</ul>
```

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `branch` | `""` \| `"expanded"` | `""` (collapsed) | `"expanded"` starts the branch open |

---

## `subtree` -- Nested Group

Marks a child element as the collapsible content of a `[branch]`.

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `subtree` | boolean attr | *required* | Marks the element as a collapsible subtree group |

---

## Dynamic Trees

Trees work with No.JS `each` for dynamic content:

```html
<div state="{ folders: [
  { name: 'src', children: [{ name: 'index.js' }, { name: 'utils.js' }] },
  { name: 'docs', children: [{ name: 'README.md' }] }
]}">
  <ul tree>
    <template each="folder in folders">
      <li branch>
        <span bind="folder.name"></span>
        <ul subtree if="folder.children.length">
          <template each="file in folder.children">
            <li bind="file.name"></li>
          </template>
        </ul>
      </li>
    </template>
  </ul>
</div>
```

---

## Selected State

Clicking a branch selects it (adds `.nojs-branch-selected` and `aria-selected="true"`). Selection is mutually exclusive. **Enter** / **Space** also selects.

---

## Keyboard Navigation

| Key | Action |
|-----|--------|
| `ArrowRight` | Expand collapsed branch; if expanded, focus first child |
| `ArrowLeft` | Collapse expanded branch; if collapsed, focus parent |
| `ArrowDown` | Next visible tree item |
| `ArrowUp` | Previous visible tree item |
| `Enter` / `Space` | Toggle expand/collapse and select |
| `Home` | First visible tree item |
| `End` | Last visible tree item |
| *Printable character* | Typeahead -- focus next matching item (resets after 500ms) |

---

## CSS Classes

| Class | When applied |
|-------|-------------|
| `.nojs-tree` | On tree root and every subtree |
| `.nojs-branch` | On each branch |
| `.nojs-subtree` | On each subtree |
| `.nojs-branch-selected` | On the selected branch |

### Built-in Styles

| Selector | Style |
|----------|-------|
| `.nojs-tree` | `list-style: none; padding-left: 0` |
| `.nojs-tree .nojs-tree` | `padding-left: 1.25rem` (nested indentation) |
| `.nojs-branch::before` | Right-pointing triangle, rotates on expand |
| `.nojs-subtree[aria-hidden="true"]` | `display: none` |

---

## Accessibility

No.JS automatically adds:

- `role="tree"` on the root
- `role="treeitem"` on each branch
- `role="group"` on each subtree
- `aria-expanded="true/false"` on branches
- `aria-hidden="true/false"` on subtrees
- `aria-selected="true/false"` on branches
- Roving `tabindex`
- Full keyboard navigation with typeahead
