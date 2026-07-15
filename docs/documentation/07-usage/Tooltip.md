# Tooltip

- **Package:** `@kolkrabbi/kol-component`
- **Category:** atoms
- **Real-world usages found:** 64 across 30 files in 15 apps
- **Used in:** kol-client-ac, kol-client-acyr-website, kol-client-hrafn, kol-client-kolkrabbi, kol-docs-noter, kol-draw-3d, kol-labs-monorepo, kol-labs-single, kol-lightroom, kol-media-admin, kol-mirror, kol-modulator, kol-monitor, kol-video-editor, kol-website

## Import

```jsx
import { Tooltip } from '@kolkrabbi/kol-component'
```

## Real usage

From `kol-apps/kol-docs-noter/src/components/app-shell/ExplorerSidebar.tsx`:

```jsx
<Tooltip>
              <TooltipTrigger asChild>
                <Button size="icon" variant="ghost" className="w-10 h-10">
                  <Network className="w-4 h-4" />
```

From `kol-apps/kol-labs-monorepo/apps/chess/src/assets/chess/dashboard/dashboard -chess-elite.jsx`:

```jsx
<Tooltip 
                  contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px' }}
                  labelStyle={{ color: '#999', fontSize: '11px' }}
                />
```

From `kol-apps/kol-mirror/a_torg/design-system/components/00-dont-touch/app-shell/ExplorerSidebar.tsx`:

```jsx
<Tooltip>
              <TooltipTrigger asChild>
                <Button size="icon" variant="ghost" className="w-10 h-10">
                  <Folder className="w-4 h-4" />
```

From `kol-apps/kol-modulator/design-system/components/00-dont-touch/app-shell/ExplorerSidebar.tsx`:

```jsx
<Tooltip>
              <TooltipTrigger asChild>
                <Button size="icon" variant="ghost" className="w-10 h-10">
                  <FileText className="w-4 h-4" />
```

From `kol-apps/kol-monitor/a_torg/design-system/components/00-dont-touch/app-shell/ExplorerSidebar.tsx`:

```jsx
<Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        collapseAll();
                      }}
                      className="p-1.5 rounded hover:bg-sidebar-item transition-colors"
                      title="Collapse all"
                    >
                      <FoldVertical className="w-4 h-4 text-muted-foreground" />
```
