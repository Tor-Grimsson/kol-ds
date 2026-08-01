# DocsToc

- **Package:** `@kolkrabbi/kol-component`
- **Category:** atoms
- **Real-world usages found:** 7 across 7 files in 5 apps
- **Weighted inbound:** 21★ across 7 edges — 7×3★
- **Used in:** kol-client-kolkrabbi, kol-docs, kol-docs-md, kol-labs-monorepo, kol-website

## Who depends on this

Weighted, not counted: a 5★ dependent is a near-copy and breaks if this is removed; a 3★ dependent loses one element.

| ★ | uses | file |
|---|---|---|
| 3 | 1 | `kol-apps/kol-client-kolkrabbi/_tmp/_import-dump/monorepo-web-src/workshop/molecules/WorkshopSidebarContent.jsx` |
| 3 | 1 | `kol-apps/kol-docs/src/components/WikiLayout.jsx` |
| 3 | 1 | `kol-apps/kol-docs-md/src/components/WikiLayout.jsx` |
| 3 | 1 | `kol-apps/kol-labs-monorepo/apps/chess/src/workshop/WorkshopSidebarContent.jsx` |
| 3 | 1 | `kol-apps/kol-labs-monorepo/apps/metrics/src/workshop/WorkshopSidebarContent.jsx` |
| 3 | 1 | `kol-website/apps/web/src/components/workshop/molecules/WorkshopSidebarContent.jsx` |
| 3 | 1 | `kol-website/apps/web/src/workshop-system/docs/DocumentationReader.jsx` |

## Import

```jsx
import { DocsToc } from '@kolkrabbi/kol-component'
```

## Real usage

From `kol-apps/kol-client-kolkrabbi/_tmp/_import-dump/monorepo-web-src/workshop/molecules/WorkshopSidebarContent.jsx`:

```jsx
<DocsToc toc={sections} />
```

From `kol-apps/kol-docs/src/components/WikiLayout.jsx`:

```jsx
<DocsToc toc={toc} />
```
