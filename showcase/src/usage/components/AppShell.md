# AppShell

- **Package:** `@kolkrabbi/kol-framework`
- **Category:** framework
- **Real-world usages found:** 3 across 3 files in 2 apps
- **Weighted inbound:** 9★ across 3 edges — 3×3★
- **Used in:** kol-labs-monorepo, kol-labs-single

## Who depends on this

Weighted, not counted: a 5★ dependent is a near-copy and breaks if this is removed; a 3★ dependent loses one element.

| ★ | uses | file |
|---|---|---|
| 3 | 1 | `kol-apps/kol-labs-monorepo/apps/divs/src/App.jsx` |
| 3 | 1 | `kol-apps/kol-labs-monorepo/apps/home/src/App.jsx` |
| 3 | 1 | `kol-apps/kol-labs-single/src/App.jsx` |

## Import

```jsx
import { AppShell } from '@kolkrabbi/kol-framework'
```

## Real usage

From `kol-apps/kol-labs-monorepo/apps/divs/src/App.jsx`:

```jsx
<AppShell navTree={NAV_TREE} getActivePage={getActivePage} />
```
