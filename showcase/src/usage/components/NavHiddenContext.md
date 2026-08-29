# NavHiddenContext

- **Package:** `@kolkrabbi/kol-shell`
- **Category:** flat
- **Real-world usages found:** 1 across 1 files in 1 apps
- **Weighted inbound:** 3★ across 1 edges — 1×3★
- **Used in:** kol-labs-monorepo

## Who depends on this

Weighted, not counted: a 5★ dependent is a near-copy and breaks if this is removed; a 3★ dependent loses one element.

| ★ | uses | file |
|---|---|---|
| 3 | 1 | `kol-apps/kol-labs-monorepo/apps/monitor/src/components/AppLayout.jsx` |

## Import

```jsx
import { NavHiddenContext } from '@kolkrabbi/kol-shell'
```

## Real usage

From `kol-apps/kol-labs-monorepo/apps/monitor/src/components/AppLayout.jsx`:

```jsx
<NavHiddenContext.Provider value={{ navHidden, setNavHidden }}>
      <NavSidebar hidden={navHidden} />
```
