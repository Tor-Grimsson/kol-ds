# Session: Touch pass on the media surface, and three more kol-olina tickets

**Date:** 2026-09-23
**Agent:** kol-ds-ui (Claude Opus 5.5, Sonnet 5 for the touch pass)
**Summary:** Two olina tickets shipped as `kol-component@0.218.0`; the touch-and-breakpoints pass plus olina's third (`media-views-disagree-on-folders-menu-and-up`) shipped as `0.219.0`.

## Changes Made

### Files Modified
- `packages/component/src/organisms/MediaLibraryPages.jsx` — count line's grey tail totals the current folder recursively below the root (`· in <folder>: N files · size`, hidden at a leaf); opt-in `bucketLevel` (title → bucket → folders with one bucket, absent = 0.217.0); `useLongPress` spread on the Browse root; `RowMenuButton` on `FolderRow`/`FileRow`; below `md` the rows view takes the phone list (`useMediaQuery`); grid draws the level's subfolders as `MediaTile`s (`flat` draws none) with a folder count in the count line; the wall's container takes the level menu; one `goUp` (parent → … → bucket top → title root) for grid and rows.
- `packages/component/src/organisms/ColumnBrowser.jsx` — `RowMenuButton` in `Row`; stack rows got their own per-row `onContextMenu` (only the `<ul>` had one, so a phone menu targeted the level); stack grid tiles got a menu + `···` as a sibling in a wrapper; row handlers only exist when `onRowContextMenu` does.
- `packages/component/src/hooks/useLongPress.js` (new) — a held touch dispatches `contextmenu` at the finger on whatever was pressed, so every existing `onContextMenu` and payload works unchanged; acts only when a handler took the event; swallows the following click; cancels past 10px; drops a trusted `contextmenu` after ours.
- `packages/component/src/molecules/RowMenuButton.jsx` (new) — the `···` on `pointer: coarse`, calling the row's own `onContextMenu`; `ghost` on rows, `grey` plate over pictures. `MediaTile.jsx` wears it.
- `packages/component/src/utilities/ContextMenu.jsx` — inner wrapper is `flex flex-col`: the `inline-flex` items summed side by side, so the menu was 510px for seven short verbs and clipped off a 390 phone; now ~208px.
- `packages/component/src/molecules/KindPreview.jsx` — markdown/code previews at `tile`/`thumb` fit are `inert` (a README tile's links navigated the app away).
- `packages/component/src/index.js`, `showcase/src/nav/classification.js` — exports, roster function (`RowMenuButton: action`, `useLongPress: utility`), `NO_DEMO` reason for `RowMenuButton`.
- `packages/component/package.json` 0.217.0 → 0.218.0 → **0.219.0**; `docs/operations/01-release/02-shipped-packages.md` row.
- `docs/operations/07-apps-tier/02-media-app-plan.md` — page-scroll item dropped from D1 (it was an unrestarted dev server); touch and breakpoints split out as `## Touch next`, ahead of D1 (now tags and file editing).
- `lobby/INDEX.md` + `lobby/inbox/{count-line-totals-the-folder, media-root-shows-a-single-bucket, media-views-disagree-on-folders-menu-and-up}.md` — 🔵 → 🟠 `addressed`, an ADDRESSED section each, history lines; `~/dev/projects/kol-olina/lobby/outbox/<the same three>.md` — 🟠 + a RETURNED section each (bump notes; 0.219.0 carries the touch pass too).
- `_tmp/2026-09-23-touch-pass/` — Playwright screenshots and snapshots.

### Features Added/Removed
- Added: long-press menu, coarse-pointer `···`, `bucketLevel`, folder tiles in grid, container right-click menu, one ⌘↑ across views, folder-total count tail. Nothing removed.

## Current State

### Working
- 27 gates clean. Checked live in `apps/media` under Chrome touch emulation (CDP, `pointer: coarse` + `hover: none`) at 390 and 768, and at 1400: `···` opens the row's own menu without navigating; a held press opens it; a quick tap still navigates; a slow drag cancels; a held press on the Trash button still clicks through; no horizontal overflow in Columns/Rows/Grid at 768; Quick Look fits at both sizes; the menu is on-screen at 390; the Files tab shows the phone list; tapping a link inside a README tile selects the tile.
- Grid from `#img/` → ⌘↑ → bucket top → ⌘↑ → title root; rows reaches the title root and stays.

### Known Issues
- **Not tried on a real iPhone** — iOS never fires `contextmenu` from a press, which is why `useLongPress` dispatches its own; the callout suppression (`-webkit-touch-callout`) is untested.
- Unfixed pass findings: the stack disclosure chevron is a 14px-wide tap target; the count line wraps its grey tail at 390; Quick Look leaves 32px gutters at 390 (326px reading column); a markdown table cell breaks "Domain" to "Domai/n" in Quick Look.
- Long-press is on the **Browse** page root only: `MediaLibraryLibrary` (the standalone wall), the Trash panel's rows, and `ContentCard`/`ContentRow` carry no `···` and no long-press. Grid arrow keys still walk files only, skipping folder tiles.
- `npm view` read 0.218.0 straight after the 0.219.0 publish (registry lag, not rechecked). Olina must bump to 0.219.0 and verify; eight tickets sit 🟠 until they do.
- Inventory rows for `RowMenuButton` (and the earlier `QuickLookFrame`/`FileIcon`/`PdfPage`) are still missing; no showcase demo or workbench story for the new pieces.
- Playwright persists localStorage across browser closes — a stale `stackView: 'grid'` from one test made the next look broken.

## Next Steps
1. D1 session — tags and text editing (drafts in D1). Plan: `docs/operations/07-apps-tier/02-media-app-plan.md` § D1 next.
2. Close olina's eight 🟠 tickets with `lobby-close` as each is verified running.
3. Inventory rows, then showcase/workbench coverage for the media components.
4. Decide whether the unfixed touch findings (chevron tap target, Quick Look gutters) earn a ticket.
