# Session: The media surface merged into one, and one preview ladder under it

**Date:** 2026-09-23
**Agent:** kol-ds-ui (Claude Opus 5)
**Summary:** Browse and Files became ONE surface with three views (columns · rows · grid), one listing, one header, one count line; and the five ways a file was previewed collapsed into one `KindPreview` with a `fit`.

## Changes Made

### Files Modified
- `packages/component/src/organisms/MediaLibraryPages.jsx` — the merge lives here: `view` state (columns · rows · grid) replacing `folderView` + `layout`; the crumb row's four-icon switch (three after `list` was cut); `ContentFilters` mounted above whichever body is up; `ShellSearchOverlay` on `/` and ⌘K; the row list re-based at the bucket ROOT with `prefix` seeding the expansion; `RowHeader` (Name · Date · Size, sortable, draggable dividers, off by default behind the `Fields` setting); `WallBody` extracted and shared with the standalone wall; `FolderPreview`; `DocThumb` (measures its own box); space = Quick Look in every view, folders included; marquee wiring; drag carries the whole selection.
- `packages/component/src/organisms/MediaLibraryExplorer.jsx` — rewritten to a thin view holder. It no longer mounts two pages behind a BROWSE · FILES switch.
- `packages/component/src/organisms/ColumnBrowser.jsx` — marquee band + `selectedKeys`/`onSelectKeys`; background click deselects; drop highlight can no longer stick; `Preview` exported for the row view; height grabber hidden on a fill height.
- `packages/component/src/molecules/KindPreview.jsx` — `fit="pane|tile|thumb"`; PDF renders its first page in an `embed` (size-gated, and only for a fetchable URL).
- `packages/component/src/molecules/ContentCard.jsx` · `ContentRow.jsx` — accept `onContextMenu` / `onDoubleClick` (they silently ignored both), and expose `data-selected`.
- `packages/component/src/organisms/ContentFilters.jsx` — `filtersOpen` / `onFiltersOpenChange`, so a consumer that already spends a control on "show filters" doesn't make the user press two funnels.
- `packages/component/src/hooks/useMarquee.js` — new: drag a band, select what it touches; swallows the click that ends the drag.
- `packages/theme/kol-components-molecules.css` — marquee band; zebra rows; selected ring for cards/rows; rows are `user-select: none` with 1px transparent bands so a selected run reads as rows; tile doc zoom reads `--kol-thumb-zoom`.
- `packages/theme/kol-components-atoms.css` — `.kol-overlay` documents the `scrim` opt-in.
- `packages/component/src/utilities/FullscreenOverlay.jsx` — `scrim` prop (dim backdrop instead of the surface); Quick Look uses it.
- `apps/media/src/App.jsx` · `lib/settings.js` · `lib/shortcuts.js` · `KindOverview.jsx` · `index.css` — four views wired, `COLUMN_HEIGHT` → `calc(100dvh - 210px)`, overview moved into the settings drawer (kol-olina's arrangement), upload icon + drop zone retired, `fit="tile"` on the overview's previews.
- `_tmp/2026-09-22-media-drop-zone/UploadZone.jsx` — retired there; upload is a right-click verb now.

### Features Added/Removed
- **One surface.** `MediaLibraryBrowse` IS the surface; `MediaLibraryLibrary` stays as the standalone wall a site embeds. `list` was cut as a duplicate of `rows`; a stored `list` lands on `rows`.
- **One gesture set in all three views:** click selects, double-click opens, right-click is the menu, space is Quick Look (folders too, at overlay size, over a 48 % scrim).
- **One preview ladder:** `KindPreview` + `fit`. PDFs show page one, audio shows the DS tile, documents zoom to a measured ratio of their tile (code on a narrower page than prose). Icons are for folders only.
- Upload moved from a drop zone to `Upload into <folder>…` in the menu; Copy URL + Download on files (and Copy URL on folders).

## Current State

### Working
- All 26 gates clean; everything above verified in `pnpm media` (task-scoped server on 5391, killed after).
- Fill height exact in every view: `calc(100dvh - 210px)`, zero page overflow at 900 and 1200 tall.

### Known Issues
- ⚠️ **Nothing is published.** component 0.217.0 + theme are staged locally; kol-olina only gets any of this by bumping.
- ⚠️ Pre-existing, still unfiled: in Column view, dropping a file onto another FILE's row renames the dragged file to the target's name.
- ⚠️ `ContentCard`'s Enter/Space keydown fires its `onClick`, so a focused card handles space as well as the page's Quick Look binding. Harmless (it re-selects the same card) but it is two handlers on one key.
- ⚠️ Editor-chrome components still carry native `title` (`LayerStack`, `TimelineDock`, `SelectionOverlay`, `ColorInputRow`, `ShapeDropdown`, `ColorRamp`, `SpectrumGrid`) — out of scope for the media sweep, and no ticket asks for them.

## Next Steps
1. Publish component 0.217.0 + the theme bump, then tell kol-olina.
2. File the column-view file-onto-file drop bug.
3. Editing files and D1 (kol-olina's `apps:brand` model) were parked for "next round".
