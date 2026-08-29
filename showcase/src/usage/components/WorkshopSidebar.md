# WorkshopSidebar

- **Package:** `@kolkrabbi/kol-workshop`
- **Category:** compositions
- **Real-world usages found:** 3 across 3 files in 3 apps
- **Weighted inbound:** 9★ across 3 edges — 3×3★
- **Used in:** kol-editor-radar, kol-labs-monorepo, kol-modulator

## Who depends on this

Weighted, not counted: a 5★ dependent is a near-copy and breaks if this is removed; a 3★ dependent loses one element.

| ★ | uses | file |
|---|---|---|
| 3 | 1 | `kol-apps/kol-editor-radar/src-grab/components/structure/layout/WorkshopLayout.jsx` |
| 3 | 1 | `kol-apps/kol-labs-monorepo/apps/mirror/src/components/structure/layout/WorkshopLayout.jsx` |
| 3 | 1 | `kol-apps/kol-modulator/src/components/structure/layout/WorkshopLayout.jsx` |

## Import

```jsx
import { WorkshopSidebar } from '@kolkrabbi/kol-workshop'
```

## Real usage

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
