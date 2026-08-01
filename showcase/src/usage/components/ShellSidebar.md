# ShellSidebar

- **Package:** `@kolkrabbi/kol-workshop`
- **Category:** shell
- **Real-world usages found:** 6 across 4 files in 2 apps
- **Weighted inbound:** 12★ across 4 edges — 4×3★
- **Used in:** kol-client-kolkrabbi, kol-website

## Who depends on this

Weighted, not counted: a 5★ dependent is a near-copy and breaks if this is removed; a 3★ dependent loses one element.

| ★ | uses | file |
|---|---|---|
| 3 | 2 | `kol-apps/kol-client-kolkrabbi/_tmp/_import-dump/monorepo-packageui-src/layout/ShellLayout.jsx` |
| 3 | 2 | `kol-website/apps/web/src/workshop-system/shell/ShellLayout.jsx` |
| 3 | 1 | `kol-apps/kol-client-kolkrabbi/_tmp/_import-dump/monorepo-web-src/workshop/WorkshopSidebar.jsx` |
| 3 | 1 | `kol-website/apps/web/src/workshop-system/compositions/WorkshopSidebar.jsx` |

## Import

```jsx
import { ShellSidebar } from '@kolkrabbi/kol-workshop'
```

## Real usage

From `kol-apps/kol-client-kolkrabbi/_tmp/_import-dump/monorepo-web-src/workshop/WorkshopSidebar.jsx`:

```jsx
<ShellSidebar
        routes={workshopRoutes}
        basePath="/workshop"
        onNavigate={onNavigate}
        label="Workshop"
        labelTo="/workshop"
        collapsed={workshopCollapsed}
        onToggle={() => setWorkshopCollapsed(p => !p)}
      />
```

From `kol-website/apps/web/src/workshop-system/compositions/WorkshopSidebar.jsx`:

```jsx
<ShellSidebar
        routes={workshopRoutes}
        basePath={basePath}
        onNavigate={onNavigate}
        label="Workshop"
        labelTo={basePath}
        collapsed={workshopCollapsed}
        onToggle={() => setWorkshopCollapsed(p => !p)}
      />
```

From `kol-apps/kol-client-kolkrabbi/_tmp/_import-dump/monorepo-packageui-src/layout/ShellLayout.jsx`:

```jsx
<ShellSidebar routes={routes} basePath={basePath} />
```

From `kol-apps/kol-client-kolkrabbi/_tmp/_import-dump/monorepo-packageui-src/layout/ShellLayout.jsx`:

```jsx
<ShellSidebar routes={routes} basePath={basePath} onNavigate={() => setIsNavDrawerOpen(false)} />
```
