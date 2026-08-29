# PageHeader

- **Package:** `@kolkrabbi/kol-shell`
- **Category:** flat
- **Real-world usages found:** 2 across 2 files in 1 apps
- **Weighted inbound:** 6★ across 2 edges — 2×3★
- **Used in:** kol-labs-monorepo

## Who depends on this

Weighted, not counted: a 5★ dependent is a near-copy and breaks if this is removed; a 3★ dependent loses one element.

| ★ | uses | file |
|---|---|---|
| 3 | 1 | `kol-apps/kol-labs-monorepo/apps/monitor/src/pages/HomePage.jsx` |
| 3 | 1 | `kol-apps/kol-labs-monorepo/apps/monitor/src/pages/LibraryPage.jsx` |

## Import

```jsx
import { PageHeader } from '@kolkrabbi/kol-shell'
```

## Real usage

From `kol-apps/kol-labs-monorepo/apps/monitor/src/pages/HomePage.jsx`:

```jsx
<PageHeader
        title="Monitor"
        subtitle="Video synthesis workstation"
      />
```

From `kol-apps/kol-labs-monorepo/apps/monitor/src/pages/LibraryPage.jsx`:

```jsx
<PageHeader
        title="Library"
        subtitle="Modules and patches"
      />
```
