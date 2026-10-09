# Session: fxr's four — walkthrough keys, Settings at 390, primary hover, transform glyphs

**Date:** 2026-10-09
**Agent:** Claude (Grim)
**Summary:** kol-fxr's four editor/hub tickets built, published (kol-theme 0.170.0 · kol-component 0.246.0 · kol-shell 0.63.0 · kol-icons 0.34.0) and closed with receipts; the visual calls are on open-questions Round 9 as decided, review.

## Changes Made

### Files Modified
- packages/shell/src/WalkthroughPanel.jsx — Escape → `onClose`, ← → page, on the DS layer stack; peer kol-component ≥0.246.0 — **0.63.0**
- packages/component/src/index.js — exports `pushLayer` · `popLayer` · `isTopLayer` (the overlay layer stack, for other packages)
- packages/component/src/molecules/SectionText.jsx — inline actions drop under the body below `md` (PageHeader's actions)
- packages/component/src/organisms/ContentFilters.jsx — below `md` the view strip and trailing controls share one wrapping line, desk order — **0.246.0**
- packages/theme/kol-components-molecules.css — primary tone hover/press step down from the rest fill (−8, −16) in both themes; the `oq-ab` rungs had gone lighter in one step per theme — **0.170.0**
- packages/icons/src/kol-icon-set-interface/tools — the six align, two flip and rotate-left glyphs redrawn (A: solid boxes, solid flip axis, 270° arc); old nine in `_tmp/2026-10-09-transform-glyphs-before/` — **0.34.0**
- showcase/src/open-questions/2026-10-09.jsx — Round 9: glyphs now · A · B at 16/24, the hover steps in light and dark
- docs/operations/01-release/02-shipped-packages.md — the four versions
- lobby — four tickets resolved → `done/`, Closed rows, history (queue 22 → 18); kol-fxr receipts returned (bump only)

### Features Added/Removed
- The Hub walkthrough takes Escape and arrow keys
- PageHeader and ContentFilters fold properly on a phone
- Primary hover goes deeper in both themes
- Nine redrawn transform glyphs

## Current State

### Working
- Published kol-theme 0.170.0 · kol-component 0.246.0 · kol-shell 0.63.0 · kol-icons 0.34.0. Push is the user's.
- Gates clean: syntax, taxonomy, roster, props, variants, imports, icon-ink, control-type, native-title; render gate clean on editor-hub · media · hub. Shots in `_tmp/2026-10-09-fxr-four/`.

### Known Issues
- The walkthrough stays non-modal (no scrim, page live) — stated in the resolution
- Dark primary hover (17) sits at the page colour (18); recorded on Round 9
- The glyph ticket was first stopped at a proposal; the user wanted it built — it shipped as A the same session

## Next Steps
1. His review of Round 9 (glyphs A vs B, the hover depth)
2. fxr bumps the four packages
3. His A/B ruling on `/picker` vs `/picker/b`
