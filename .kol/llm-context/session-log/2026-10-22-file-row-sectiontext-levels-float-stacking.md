# Session: File row as the file card, SectionText levels, nested float stacking

**Date:** 2026-10-22
**Agent:** Claude (Grim)
**Summary:** Three lobby tickets closed, PageHeader folded into SectionText, nested-float z fixed, and the file card/row reworked in the catalog app with the user; published theme 0.180–0.183, component 0.285–0.287, shell 0.74.0.

## Changes Made

### Files Modified
- `packages/theme/kol-base-tokens.css` — `html { overscroll-behavior: none }` (OverscrollNone, kol-monitor).
- `packages/theme/kol-components-molecules.css` — floats add `--kol-float-depth × 100` on every tier; selected-card ring removed.
- `packages/theme/kol-components-atoms.css` — `.kol-media-control` hover keeps its ink (no yellow).
- `packages/component/src/utilities/Popover.jsx` — `PopoverPanel` sets `--kol-float-depth` for nested floats.
- `packages/component/src/molecules/SectionText.jsx` — `level` page · app · section · content, `media`, `SECTION_TEXT_LEVELS`; `PageHeader.jsx` is now its deprecated alias (retirement ledger row).
- `packages/component/src/molecules/ContentRow.jsx` — file row: contained tile, 72 flush thumb, one padded text section (`plate`) with copy + actions spanning it.
- `packages/component/src/molecules/ContentCard.jsx` · `ContentText.jsx` — file card: no hover fill, title heading-05.
- `packages/shell/src/CatalogPage.jsx` — `listColumns` (3 for file/slide, else 4).
- `apps/catalog/src/App.jsx` — panel is SegmentedToggles (preset · card · row · list · columns · width · media · zoom); media image · pattern · none · missing; file card slots (download, select, copy, delete).
- `showcase/src/previews/SectionText.jsx` — the four levels as variants.
- `_tmp/2026-10-22-dev-section-header/` — the abandoned DevSectionHeader + PageHeader/SectionText originals.

## Current State

### Working
- Live: kol-theme 0.183.0 · kol-component 0.287.0 · kol-shell 0.74.0 · kol-framework 0.53.0.
- Lobby: OverscrollNone, DevSectionHeader, LoaderAppMinimumTime closed with receipts.

### Known Issues
- The 0.180.0 float fix was checked only in a chromeless panel and shipped broken; 0.181.0 fixed it. Test a fix where the user saw the bug.
- File row is 73 tall (49 text + 24 pad), so the thumb is 72×73.

## Next Steps
1. Push is the user's.
2. Round 16's pick and plan 2.2 (other reference apps) are still open.
