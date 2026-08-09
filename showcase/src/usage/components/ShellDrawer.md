# ShellDrawer

- **Package:** `@kolkrabbi/kol-component`
- **Category:** molecules
- **Real-world usages found:** 2 across 2 files in 2 apps
- **Weighted inbound:** 6★ across 2 edges — 2×3★
- **Used in:** kol-client-kolkrabbi, kol-website

## Who depends on this

Weighted, not counted: a 5★ dependent is a near-copy and breaks if this is removed; a 3★ dependent loses one element.

| ★ | uses | file |
|---|---|---|
| 3 | 1 | `kol-apps/kol-client-kolkrabbi/_tmp/_import-dump/monorepo-packageui-src/layout/ShellLayout.jsx` |
| 3 | 1 | `kol-website/_tmp/2026-08-08-workshop-system-elder/workshop-system/shell/ShellLayout.jsx` |

## Import

```jsx
import { ShellDrawer } from '@kolkrabbi/kol-component'
```

## Real usage

From `kol-apps/kol-client-kolkrabbi/_tmp/_import-dump/monorepo-packageui-src/layout/ShellLayout.jsx`:

```jsx
<ShellDrawer
            isOpen={isNavDrawerOpen}
            onClose={() => setIsNavDrawerOpen(false)}
          >
            {renderSidebar
              ? renderSidebar({ onNavigate: () => setIsNavDrawerOpen(false) })
              : <ShellSidebar routes={routes} basePath={basePath} onNavigate={() => setIsNavDrawerOpen(false)} />
```
