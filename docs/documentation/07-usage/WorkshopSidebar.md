# WorkshopSidebar

- **Package:** `@kolkrabbi/kol-workshop`
- **Category:** compositions
- **Real-world usages found:** 6 across 6 files in 6 apps
- **Weighted inbound:** 18★ across 6 edges — 6×3★
- **Used in:** kol-editor-radar, kol-labs-monorepo, kol-mirror, kol-modulator, kol-monitor, kol-website

## Who depends on this

Weighted, not counted: a 5★ dependent is a near-copy and breaks if this is removed; a 3★ dependent loses one element.

| ★ | uses | file |
|---|---|---|
| 3 | 1 | `kol-apps/kol-editor-radar/src-grab/components/structure/layout/WorkshopLayout.jsx` |
| 3 | 1 | `kol-apps/kol-labs-monorepo/apps/mirror/src/components/structure/layout/WorkshopLayout.jsx` |
| 3 | 1 | `kol-apps/kol-mirror/src/components/structure/layout/WorkshopLayout.jsx` |
| 3 | 1 | `kol-apps/kol-modulator/src/components/structure/layout/WorkshopLayout.jsx` |
| 3 | 1 | `kol-apps/kol-monitor/a_torg/archive/2026-04-17-src-cleanup/src/components-mirrors/structure/layout/WorkshopLayout.jsx` |
| 3 | 1 | `kol-website/apps/web/src/App.jsx` |

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
