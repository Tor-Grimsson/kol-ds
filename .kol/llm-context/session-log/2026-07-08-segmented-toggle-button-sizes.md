# Session: SegmentedToggle sizes aligned to Button

**Date:** 2026-07-08
**Agent:** Grim (Opus 4.8 1M)
**Summary:** SegmentedToggle had only sm/md; made sm/md/lg mirror `.kol-btn-{sm,md,lg}` exactly (padding + mono type → identical heights 26/32/40).

## Changes Made

### Files Modified
- `packages/theme/kol-components-molecules.css` — dropped fixed-height model; `.kol-seg` hugs content; cell padding md-base `6px 16px`, `.kol-seg--sm/--lg .kol-seg-cell` = `4/12` & `8/20` (mirrors button padding).
- `packages/component/src/atoms/SegmentedToggle.jsx` — `cellType` map → `{sm:mono-12, md:mono-14, lg:mono-16}` (was sm:'' / md:mono-12); docstring rewritten.
- `.changeset/segmented-toggle-button-sizes.md` — new (component + theme minor).
- `showcase/src/usage/docs-meta.json` — re-mined (`pnpm extract:docs`); Type styles badge now mono-12/14/16.

### Features Added/Removed
- `lg` size added; **sm/md re-scaled** to match Button (sm 16→26px & now typed mono-12; md mono-12→mono-14).

## Current State

### Working
- Height match verified: every btn variant + the seg shell both carry `border:1px`, so heights are pixel-identical (line-height + vpad×2 + 2). Showcase demo already renders sm/md/lg — no demo change needed.

### Known Issues
- Behavioral: existing `sm` consumers (was 16px icon-only) get the taller typed size — intended, flagged in changeset. Only in-repo `sm` users are the showcase demo + workbench ThreeWay story (both fine).
- Joined-strip caveat (by design, not a bug): shared shell border + dividers, so a 3-cell seg ≠ 3× button width. Per-cell box metrics match Button.

## Next Steps
1. Uncommitted — user commits when ready. Changeset is held (not published).
