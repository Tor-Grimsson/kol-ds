# Session: the picker's close on the header row

**Date:** 2026-10-10 (logged 2026-10-13)
**Agent:** Claude (Grim)
**Summary:** kol-fxr's MediaPickerCloseOnTheHeaderRow closed — kol-component 0.251.0; the picker variant's X rides `headerTrailing`.

## Changes Made

### Files Modified
- packages/component/src/organisms/MediaLibrary.jsx — `PickerBrowse`: overlay `closeButton={false}`, `CloseButton` in `headerTrailing` after any consumer trailing — **0.251.0, published**
- lobby — MediaPickerCloseOnTheHeaderRow → done/, ledger + history; receipt in kol-fxr's outbox
- docs/operations/01-release/02-shipped-packages.md — kol-component 0.251.0

### Features Added/Removed
- No new prop — the existing `headerTrailing` slot carries the close

## Current State

### Working
- Measured on apps/media `/picker` at 1280: X on the gear's row (top 125, h 26), right edge = header right = Use's right; no corner close. Shot `_tmp/2026-10-10-picker-close.png`. Temporary dev server (5491) stopped.

### Known Issues
- fxr builds its picker by hand; the receipt tells it to switch to `variant="picker"`

## Next Steps
1. Push
2. fxr bumps kol-component ^0.251.0 and adopts `variant="picker"`
