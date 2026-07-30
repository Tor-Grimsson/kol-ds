# DocumentationReader

- **Package:** `@kolkrabbi/kol-workshop`
- **Category:** docs
- **Real-world usages found:** 2 across 2 files in 1 apps
- **Weighted inbound:** 6★ across 2 edges — 2×3★
- **Used in:** kol-website

## Who depends on this

Weighted, not counted: a 5★ dependent is a near-copy and breaks if this is removed; a 3★ dependent loses one element.

| ★ | uses | file |
|---|---|---|
| 3 | 1 | `kol-website/apps/web/src/App.jsx` |
| 3 | 1 | `kol-website/apps/web/src/routes/workshop/DocumentationReader.jsx` |

## Import

```jsx
import { DocumentationReader } from '@kolkrabbi/kol-workshop'
```

## Real usage

From `kol-website/apps/web/src/routes/workshop/DocumentationReader.jsx`:

```jsx
<DocumentationReader
    inventory={documentationInventory}
    modules={documentationModules}
    docHref={(id) => `/workshop/docs/${id}`}
    routes={{
      docsIndex: '/workshop/docs',
      components: '/workshop/components',
      tagHref: (tag) => `/workshop/docs?tag=${encodeURIComponent(tag)}`,
      docFilePath: (id) => `docs/documentation/${id}.md`,
    }}
  />
```

From `kol-website/apps/web/src/App.jsx`:

```jsx
<DocumentationReader />
```
