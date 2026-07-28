# Session: icon-only = square, every variant — theme 0.11.5

**Date:** 2026-07-28
**Agent:** Grim (Fable 5)
**Summary:** User ruling: icon-only is a GEOMETRY condition, not a variant — a lone glyph gets a square box in ALL Button variants, not just `.kol-btn-nav`. Until now `iconOnly` Buttons kept the rung's horizontal padding (`6px 16px` at md) and rendered as pills everywhere (ghost tool rails, grey playback rows, etc.).

## Changes Made

### Files Modified
- `packages/theme/kol-components-atoms.css` — `.kol-btn-icon.kol-btn-{sm,md,lg}` now pads `4/6/8` on all four sides (24/30/36 outer = the same rung's text-button height, mixed rows stay aligned). The nav-specific `.kol-btn-nav.kol-btn-*` padding rules removed as redundant — nav inherits the geometry override like every variant.
- `packages/theme/package.json` 0.11.4 → **0.11.5** · `docs/operations/SHIPPED-PACKAGES.md` row bumped.

### Audit
- 31 `iconOnly=` call-sites swept (chess playback/sidebar/hero, component ShapeDropdown/AlignmentGrid/Popover, workshop TagModeOverlay, showcase demos/blocks) — none stretch via `flex-1`/`w-full`, so the pill→square change is safe everywhere; visual only.

## Current State

### Working
- Published: `+ @kolkrabbi/kol-theme@0.11.5`. **git push = user's (pinged).** Consumer bump lands app-side same session (kol-chess).

### Known Issues
- None — pure CSS geometry; no API change.

## Next Steps
1. The chess floaters fold (Games + Engine/Review into one board toolbar) — steps 2–3 of the 2026-07-28 consumer brief, pending the ChessAnalysisLayout seam read.
