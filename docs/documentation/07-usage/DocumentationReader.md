# DocumentationReader

- **Package:** `@kolkrabbi/kol-workshop`
- **Category:** docs
- **Real-world usages found:** 2 across 2 files in 1 apps
- **Used in:** kol-website

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
