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

## Amended — 2026-10-17

- Catalog docs caught up: `showcase/src/docs/components/{Tooltip,ShellSearchOverlay,MenuItem}.mdx` document `disabled`, `results[].disabled` / `disabledHint`, `size`. Props + frontmatter gates clean.
- **Published kol-icons 0.39.0** — `identity/monitor.svg` (kol-monitor's identity-monitor; clip ids `kol-monitor-t/-b`); cuts regenerated, inventory 245 · identity 7, CHANGELOG, shipped table. Same optical size as `fxr`. Closed, receipt returned. Harness: `_tmp/2026-10-17-identity-monitor/`.

## Amended — 2026-10-17 (later)

- **Published kol-component 0.264.0** — `ColorPickerPopover` (organisms/; swatch xs 16 · sm 24 → SB square, hue, new `AlphaStrip`, hex; ⌥-click resets; on `SpectrumControls`, no react-colorful) + `hexToHsva` / `hsvaToHex`. Preview, MDX, nav, inventory. monitor's ColorPickerPopover closed, receipt returned. Harness: `_tmp/2026-10-17-color-picker/`.
- `showcase/src/pages/IconsGallery.jsx` — a numeric size sizes the tile too: floor `48 + size × 2`, columns follow (2000px: 16 → 13 across, 128 → 4); Fit unchanged. Names wrap / overflow slightly at 16–24.
- Rules: receipts only after the version is live on the registry (memory); watch re-arms silently — `/ag-init` 6b + global CLAUDE.md; `/log-work` gained the amend check (1b).
