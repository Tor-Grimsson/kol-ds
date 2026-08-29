# Tooltip

- **Package:** `@kolkrabbi/kol-component`
- **Category:** utilities
- **Real-world usages found:** 76 across 37 files in 11 apps
- **Weighted inbound:** 126★ across 37 edges — 4×5★ · 7×4★ · 26×3★
- **Used in:** kol-client-ac, kol-client-acyr-website, kol-client-kolkrabbi, kol-docs-noter, kol-draw-3d, kol-labs-monorepo, kol-labs-single, kol-lightroom, kol-modulator, kol-video-editor, kol-website

## Who depends on this

Weighted, not counted: a 5★ dependent is a near-copy and breaks if this is removed; a 3★ dependent loses one element.

| ★ | uses | file |
|---|---|---|
| 5 | 5 | `kol-apps/kol-labs-monorepo/apps/chess/src/assets/chess/dashboard/dashboard -chess-elite.jsx` |
| 5 | 5 | `kol-website/_tmp/packages-elder-flush/ui/assets/chess/dashboard/dashboard -chess-elite.jsx` |
| 5 | 4 | `kol-apps/kol-labs-monorepo/apps/chess/src/assets/chess/dashboard/dashboard -chess-experimental.jsx` |
| 5 | 4 | `kol-website/_tmp/packages-elder-flush/ui/assets/chess/dashboard/dashboard -chess-experimental.jsx` |
| 4 | 4 | `kol-apps/kol-docs-noter/src/components/app-shell/ExplorerSidebar.tsx` |
| 4 | 4 | `kol-apps/kol-labs-monorepo/apps/chess/src/assets/chess/dashboard/dashboard -chess.jsx` |
| 4 | 4 | `kol-apps/kol-modulator/design-system/components/00-dont-touch/app-shell/ExplorerSidebar.tsx` |
| 4 | 4 | `kol-website/_tmp/2026-08-08-workshop-system-elder/workshop-system/shell/WorkshopHeader.jsx` |
| 4 | 4 | `kol-website/_tmp/packages-elder-flush/ui/assets/chess/dashboard/dashboard -chess.jsx` |
| 4 | 3 | `kol-website/_tmp/2026-08-08-workshop-system-elder/workshop-system/tags/TagModeOverlay.jsx` |
| 4 | 3 | `kol-website/apps/web/src/components/ui/ImageLightbox.jsx` |
| 3 | 2 | `kol-apps/kol-labs-monorepo/apps/chess/src/assets/chess/dashboard/dashboard -chess-sankey.jsx` |
| … | | _25 more_ |

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

From `kol-apps/kol-modulator/design-system/components/00-dont-touch/app-shell/ExplorerSidebar.tsx`:

```jsx
<Tooltip>
              <TooltipTrigger asChild>
                <Button size="icon" variant="ghost" className="w-10 h-10">
                  <Folder className="w-4 h-4" />
```

From `kol-apps/kol-video-editor/Clypra/src/components/editor/media-tabs/AudioTab.tsx`:

```jsx
<Tooltip>
          <TooltipTrigger asChild>
            <button onClick={handleAddToTimeline} disabled={isDownloading} className="w-9 h-9 flex items-center justify-center hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              {isDownloading ? <Download className="w-4 h-4 text-accent animate-pulse" />
```

From `kol-website/_tmp/2026-08-08-workshop-system-elder/workshop-system/shell/ShellLayout.jsx`:

```jsx
<Tooltip label="Search">
      <Button variant="ghost" quiet iconOnly="search" iconSize={18} onClick={() => setIsSearchOpen(true)} aria-label="Search" />
```
