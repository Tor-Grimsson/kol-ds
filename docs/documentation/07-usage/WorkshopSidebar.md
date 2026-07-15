# WorkshopSidebar

- **Package:** `@kolkrabbi/kol-workshop`
- **Category:** compositions
- **Real-world usages found:** 6 across 6 files in 6 apps
- **Used in:** kol-editor-radar, kol-labs-monorepo, kol-mirror, kol-modulator, kol-monitor, kol-website

## Import

```jsx
import { WorkshopSidebar } from '@kolkrabbi/kol-workshop'
```

## Real usage

From `kol-website/apps/web/src/App.jsx`:

```jsx
<WorkshopSidebar routes={WORKSHOP_ROUTES} inventory={documentationInventory} basePath="/workshop" onNavigate={onNavigate} />
```

From `kol-apps/kol-editor-radar/src-grab/components/structure/layout/WorkshopLayout.jsx`:

```jsx
<WorkshopSidebar
          isCollapsed={forceCollapsed ? true : isCollapsed}
          setIsCollapsed={forceCollapsed ? () => {} : setIsCollapsed}
          expandedItems={expandedItems}
          setExpandedItems={setExpandedItems}
          isSidebarLocked={isSidebarLocked}
          setIsSidebarLocked={setIsSidebarLocked}
          forceCollapsed={forceCollapsed}
          collapsedWidth={collapsedWidth}
          enableShelf={forceCollapsed || isCollapsed}
          normalizedPath={normalizedPath}
        />
```
