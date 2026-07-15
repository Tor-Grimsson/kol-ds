# ShellSidebar

- **Package:** `@kolkrabbi/kol-workshop`
- **Category:** shell
- **Real-world usages found:** 6 across 4 files in 2 apps
- **Used in:** kol-client-kolkrabbi, kol-website

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
