# Session: fxr toolbar + canvas asks, HLS start rendition

**Date:** 2026-10-13
**Agent:** Claude (Grim)
**Summary:** Four more tickets closed: fxr ×3 and kol-website ×1. Published kol-component 0.253.0, 0.254.0 and 0.255.0.

## Changes Made

### Files Modified
- packages/component/src/molecules/SplitToolButton.jsx — `disabled` disarms the action and dims the trigger, but the fold still opens. New `variants[].disabled` greys a row. Rows are `flex` — **0.253.0**
- packages/component/src/utilities/SelectionOverlay.jsx — the `W × H` label sits outside the rotated chrome, upright and centred under the rotated bounds, at 12px (**0.253.0**). It hangs under the rotate handle when the handle falls in its column (**0.255.0**)
- packages/component/src/utilities/BackgroundVideo.jsx — exported `HLS_DEFAULTS` (`startLevel -1`, `testBandwidth false`, 8 Mbps estimate, `capLevelToPlayerSize`) and an `hlsConfig` prop — **0.254.0**
- showcase/src/previews — SplitToolButton gets a disabled Rotate fold, SelectionOverlay gets five angle variants, and BackgroundVideo now plays the B2 hero master
- CHANGELOG, shipped-packages (0.255.0), lobby: 4 tickets → done/, ledger + history, receipts in kol-fxr and kol-website outboxes

### Features Added/Removed
- `testBandwidth: false` was not in the ticket. Without it, an auto start still fetched its first fragment at 360p (measured).

## Current State

### Working
- Measured on the showcase, 0 console errors:
  - The disabled fold opens with greyed rows, and the panel is 199px, the width of its longest row.
  - The size label is upright and never overlaps the handle at 0°, 45°, −90°, 180° and 225°.
  - A 1280×720 player plays 720p from the first fragment; a 446×250 tile is capped at 360p.
- Gates run: syntax, props, variants (scoped to the change).
- No `🔵 filed` rows left. The 18 inbox entries are `🟠 addressed` and wait on their filers.

### Known Issues
- 0.253.0 shipped the label/handle collision at 180°; 0.255.0 fixed it the same day.
- `validate:previews` fails on `tag-mode-gate`, which was already failing before this session.

## Next Steps
1. Push
2. fxr bumps ^0.255.0; kol-website bumps ^0.254.0 (its hero `HlsVideo` copy can take `HLS_DEFAULTS`)
