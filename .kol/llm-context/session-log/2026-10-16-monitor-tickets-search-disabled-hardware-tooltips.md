# Session: monitor tickets — search disabled rows, hardware tooltips, picker header

**Date:** 2026-10-16
**Agent:** Claude (Grim)
**Summary:** Five kol-monitor lobby tickets built, verified and published as kol-component 0.262.0 · 0.263.0 and kol-hardware 0.5.0; all closed with receipts returned.

## Changes Made

### Files Modified
- packages/component/src/organisms/ShellSearchOverlay.jsx — rows take `disabled` + `disabledHint`: skipped by ↑↓, hover inert, never reach `onSelect`; highlight opens on the first enabled row
- packages/component/src/molecules/OptionRow.jsx — `disabled` state (disabled opacity, no hover, not-allowed)
- packages/component/src/molecules/MenuItem.jsx — `TRIGGER_BY_SIZE`: xs trigger `kol-mono-8 px-2`
- packages/component/src/utilities/Popover.jsx — `Tooltip disabled` (mounted, never opens)
- packages/component/src/organisms/MediaLibraryPages.jsx — `LibraryHeader` row `items-center`; × no self-alignment (0.262.0's `self-end` superseded in 0.263.0)
- packages/hardware/src/{switches/IconButton,indicators/JackSocket,panel/ModuleHeader}.jsx — native `title` → DS `Tooltip asChild`; jack silent while `pending`/`dimPending`; peer kol-component ≥0.262.0
- CHANGELOGs (component, hardware), docs/operations/01-release/02-shipped-packages.md
- lobby: ShellSearchDisabledRow · MenuItemXsTriggerType · HardwareNativeTitle · MediaPickerCloseOnControlRow · MediaPickerHeaderCentred → done/ via lobby-close, receipts to kol-monitor

### Features Added/Removed
- Published: kol-component 0.262.0, 0.263.0 · kol-hardware 0.5.0
- Harnesses and screenshots: `_tmp/2026-10-16-monitor-tickets/`

## Current State

### Working
- Verified in Playwright harnesses (apps/controls, apps/media /picker + /): disabled rows, xs trigger type, no `[title]` in hardware DOM, jack tooltip suppressed while pending, header controls centred; 0 console errors
- Gates: native-title, props, taxonomy, roster, preview-files, icon-ink, syntax — clean

### Known Issues
- Picker dropdown centre sits 1.9px off the wordmark cap middle by my probe (ticket bar 1.5px; monitor's own measure passed)
- `modal` variant's × is the overlay sheet's corner close, untouched

## Next Steps
1. User pushes kol-ds-ui
2. Monitor bumps and drops its carries (no-room group, RefDropdown classes, picker header override)
