# Tooltip

- **Package:** `@kolkrabbi/kol-component`
- **Category:** atoms
- **Real-world usages found:** 28 across 16 files in 12 apps
- **Used in:** kol-client-ac, kol-client-acyr-website, kol-client-hrafn, kol-client-kolkrabbi, kol-draw-3d, kol-labs-single, kol-lightroom, kol-media-admin, kol-mirror, kol-modulator, kol-monitor, kol-noter

## Import

```jsx
import { Tooltip } from '@kolkrabbi/kol-component'
```

## Real usage

From `kol-apparat/kol-docs/kol-noter/src/components/app-shell/ExplorerSidebar.tsx`:

```jsx
<Tooltip>
              <TooltipTrigger asChild>
                <Button size="icon" variant="ghost" className="w-10 h-10">
                  <Network className="w-4 h-4" />
```

From `kol-apparat/kol-video/kol-mirror/a_torg/design-system/components/00-dont-touch/app-shell/ExplorerSidebar.tsx`:

```jsx
<Tooltip>
              <TooltipTrigger asChild>
                <Button size="icon" variant="ghost" className="w-10 h-10">
                  <Folder className="w-4 h-4" />
```

From `kol-apparat/kol-video/kol-modulator/design-system/components/00-dont-touch/app-shell/ExplorerSidebar.tsx`:

```jsx
<Tooltip>
              <TooltipTrigger asChild>
                <Button size="icon" variant="ghost" className="w-10 h-10">
                  <FileText className="w-4 h-4" />
```

From `kol-apparat/kol-video/kol-monitor/a_torg/design-system/components/00-dont-touch/app-shell/ExplorerSidebar.tsx`:

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

From `kol-apparat/kol-editors/kol-draw-3d/src/components/molecules/Popover.jsx`:

```jsx
<Tooltip label="Pattern" shortcut="P" placement="bottom">
 *     <Button iconOnly="ptrn-checker" ... />
```
