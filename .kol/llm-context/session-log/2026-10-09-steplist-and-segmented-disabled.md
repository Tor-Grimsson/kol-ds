# Session: fxr's StepList and SegmentedToggle disabled — kol-component 0.245.0

**Date:** 2026-10-09
**Agent:** Claude (Grim)
**Summary:** kol-fxr's two parked DS gaps built, walked on the showcase, published as kol-component 0.245.0 + kol-theme 0.169.0 and closed at both ends; `RecordManager`'s pointer sort lifted into a shared hook so StepList is not a second copy.

## Changes Made

### Files Modified
- packages/component/src/hooks/usePointerSort.js — new: the vertical pointer sort, lifted verbatim from `RecordManager`
- packages/component/src/organisms/RecordManager.jsx — onto the hook (same lines, moved); measures its own `.kol-table-row`s
- packages/component/src/molecules/StepList.jsx — new molecule, the spec's props; `grab` = pointer sort (touch works), `arrows` = ↑ ↓ quiet buttons
- packages/component/src/atoms/SegmentedToggle.jsx — `options[].disabled`: aria-disabled, press refused, ←/→ skip it, may stay the current value
- packages/component/src/index.js — `StepList` export
- packages/theme/kol-components-molecules.css — `.kol-seg-cell[aria-disabled="true"]`: oq-24 ink, no hover, default cursor
- showcase — `previews/StepList.jsx` (new), `previews/SegmentedToggle.jsx` (a disabled Map cell), `nav/classification.js` (StepList: structure); descriptions + docs data re-extracted
- docs/operations/01-release/02-shipped-packages.md — component 0.245.0, theme 0.169.0
- lobby — both tickets resolved → `done/`, Closed rows, history (queue 20 → 18); kol-fxr receipts returned with remainders

### Features Added/Removed
- `StepList` — ordered slots with active row, remove, add, pointer or arrow reorder
- `SegmentedToggle` per-option disabled

## Current State

### Working
- Published kol-component 0.245.0 · kol-theme 0.169.0. Push is the user's.
- Gates green: syntax, taxonomy, roster, preview-files, props, variants, imports, groups, control-type, icon-ink. Walk (`_tmp/2026-10-09-steplist-seg/`): mouse and touch-pointer drag, remove, add, select, arrows with ends disabled; disabled cell refuses click, arrows skip it both ways, tooltip shows the reason; no errors.
- Answered: kol-website's B2 menu is already fixed in 0.241.0 — it needs only the bump (it declares ^0.240.0).

### Known Issues
- StepList's grab is a deliberate deviation from the brief (pointer sort, not LayerStack's HTML drag) — stated in the resolution
- The "brand Library question" for kol-website is not written down anywhere found; only its agent knows it

## Next Steps
1. fxr bumps (component ^0.245.0, theme ^0.169.0), swaps in StepList, drops `dim()` and the guard
2. kol-website bumps kol-component for the B2 menu and files its brand Library question
3. His A/B ruling on `/picker` vs `/picker/b`
