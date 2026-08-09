# ShellLayout

- **Package:** `@kolkrabbi/kol-workshop`
- **Category:** shell
- **Real-world usages found:** 3 across 3 files in 2 apps
- **Weighted inbound:** 9★ across 3 edges — 3×3★
- **Used in:** kol-labs-monorepo, kol-website

## Who depends on this

Weighted, not counted: a 5★ dependent is a near-copy and breaks if this is removed; a 3★ dependent loses one element.

| ★ | uses | file |
|---|---|---|
| 3 | 1 | `kol-apps/kol-labs-monorepo/apps/chess/src/App.jsx` |
| 3 | 1 | `kol-apps/kol-labs-monorepo/apps/metrics/src/App.jsx` |
| 3 | 1 | `kol-website/apps/web/src/components/workshop/WorkshopChrome.jsx` |

## Import

```jsx
import { ShellLayout } from '@kolkrabbi/kol-workshop'
```

## Real usage

From `kol-website/apps/web/src/components/workshop/WorkshopChrome.jsx`:

```jsx
<ShellLayout
      routes={WORKSHOP_ROUTES}
      basePath="/workshop"
      brand={<WorkshopBrand />
```

From `kol-apps/kol-labs-monorepo/apps/chess/src/App.jsx`:

```jsx
<ShellLayout />
```
