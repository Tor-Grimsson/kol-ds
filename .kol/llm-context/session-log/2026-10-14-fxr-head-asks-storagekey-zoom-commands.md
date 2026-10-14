# Session: fxr editor-head asks, media URLs on storageKey, canvas view commands

**Date:** 2026-10-14
**Agent:** Claude (Grim)
**Summary:** Five tickets closed (fxr ×4, kol-website ×1). Published kol-component 0.256.0, 0.257.0 and 0.258.0, and kol-media-client 0.6.0.

## Changes Made

### Files Modified
- packages/component/src/molecules/MenuItem.jsx — `offset` prop, default 4, negatives allowed (**0.256.0**)
- packages/component/src/organisms/ToolPalette.jsx — `orientation="vertical"`: a column with horizontal dividers, folds open `right-start` (**0.256.0**)
- packages/component/src/molecules/SplitToolButton.jsx — `placement` prop (**0.256.0**)
- packages/component/src/organisms/Canvas.jsx — `CanvasRuler` is graduated: transparent bar, three tick ranks, sans 10 labels, `px` corner, pointer lines (**0.256.0**). `PanZoomViewport` gets `kol:zoom-fit` and `kol:zoom-to`, with clamps in real terms of 2%–3200% (**0.258.0**)
- packages/component/src/organisms/MediaLibrary.jsx + MediaLibraryPages.jsx — both `mediaUrl` wrappers resolve a path to its row's `storageKey`; the picker's Use builds on the row (**0.257.0**)
- packages/media-client/src/index.js — `mediaUrl` accepts a row and prefers `storageKey` (**0.6.0**)
- showcase previews: MenuItem offset variants (4 · 0 · -2), ToolPalette orientation variants; MenuItem.mdx gains the `offset` row
- CHANGELOGs, shipped-packages, lobby: 5 tickets → done/, rows moved to Closed, receipts in kol-fxr and kol-website

### Features Added/Removed
- Memory `lobby-watch-never-rearm` was rewritten: re-arm the lobby watch on every 30-minute expiry, and leave it off only after the user kills it.

## Current State

### Working
- Each change was measured on the showcase:
  - MenuItem: the gap measured 4 / 0 / -2.
  - ToolPalette: the vertical strip is 32 wide and its fold opens beside it.
  - CanvasRuler: three ranks are drawn and the pointer line tracks.
  - `kol:zoom-fit` fills the width and centres a rect inside the 24px margin.
  - `kol:zoom-to` 8 lands at 8.000 real, and the cap holds at 32.
- Media URLs: all 434 rows from the live API carry `storageKey`, and their URLs return 200.
- Gates run, scoped to the change: syntax, props, variants.
- Answered kol-mirror-19 twice: the bump and PageHeader steps, then the AppStudio target. Nothing has ever been written up for mirror; the spec is `16-app-anatomy.md`.

### Known Issues
- Full `pnpm validate` fails 4 of 32 gates, all from before this session:
  - drift + metadata: MenuDropdownNest's description.
  - headings + metadata: `05-app-icons.md`.
  - retirements: AppShell and BrandHero show drop-ready on the MBP's partial estate. FeaturedCarousel gained behaviour in 0.254.0, which its alias can't take.
- `validate:previews` hangs (over 5 minutes).
- The Queue table still holds 🟢 rows from earlier sessions.

## Next Steps
1. Push.
2. kol-fxr: bump to ^0.258.0. kol-website: bump to kol-component ^0.257.0 and kol-media-client ^0.6.0.
