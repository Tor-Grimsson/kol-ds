# Session: picker A/B — the browse surface in the modal card, one fixed height

**Date:** 2026-10-08
**Agent:** Claude (Grim)
**Summary:** The picker card now holds one height whatever the folder holds; `apps/media` previews two pickers side by side — A (the browse surface in the modal card) at `/picker`, B (the modal as it ships) at `/picker/b` — before the package swap; `/browse` cut as a twin of `/`.

## Changes Made

### Files Modified
- packages/theme/kol-components-organisms.css — `.kol-media-picker` fixed at `--kol-media-picker-h` (85vh desk, 100dvh phone) instead of hugging its listing under a cap — **0.168.0**
- packages/component/src/organisms/MediaLibraryPages.jsx — `MediaLibraryBrowse` `onPickFile(o | null)`, the selected file reported as it changes (additive) — **0.242.0**
- apps/media/src/App.jsx — `/picker` + `/picker/a` = A (FullscreenOverlay scrim + card + `variant="browse"`, read-only, settings held locally, Cancel · Use footer, images and videos only); `/picker/b` = B; `/browse` route cut
- scripts/validate-render.mjs — media routes: `browse` out, `picker/b` in
- showcase/src/pages/Apps.jsx — media rows: `/browse` out, `/picker` A and `/picker/b` B
- docs/operations/01-release/02-shipped-packages.md — theme 0.168.0, component 0.242.0

### Features Added/Removed
- Picker A/B to compare before the modal's body is swapped in the package
- `/browse` removed (the explorer IS browse since the 2026-09-22 merge)

## Current State

### Working
- Published kol-theme 0.168.0 · kol-component 0.242.0. Push is the user's.
- Render gate clean over media's five routes at 1440 and 390. A's pick verified end to end (URL, contentType, kind back); Space opens Quick Look over the picker, Escape closes it and leaves the picker, arrows move the selection — columns, rows and grid. Kit: `_tmp/2026-10-08-picker-ab/`.

### Known Issues
- A's views height is `calc(var(--kol-media-picker-h) - 280px)`, hand-measured chrome in the app — retune if the browse header changes; belongs in the package once A wins
- A lacks the explorer's view letters (B F R C G) — they live on the explorer wrapper; N (new folder) must not come with them into a picker
- A: double-click opens Quick Look, not a pick

## Next Steps
1. His A/B ruling on `/picker` vs `/picker/b`
2. If A: `MediaLibrary variant="modal"` mounts the browse surface in the card (the height calc moves into the package), B's listing retires to `_tmp/`, editor doors pick it up on the next design-editor bump
3. fxr's file browser consumes the browse surface and files missing seams here — no copy (ruled in this session's answer)
