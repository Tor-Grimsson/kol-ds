# Session: kol-atlas tickets — ActionButton tooltip anchor, Quick Look fit

**Date:** 2026-10-19
**Agent:** Claude (Grim)
**Summary:** Two kol-atlas tickets built, verified in Playwright, published and closed; receipts returned to kol-atlas.

## Changes Made

### Files Modified
- packages/component/src/molecules/ActionButton.jsx — `<Tooltip asChild>`: the tip anchors to the control, not a wrapper span
- packages/component/src/organisms/MediaInspector (MediaLibraryPages.jsx) — 640 box only for SVGs under 640 wide; click toggles fit ↔ fill width, keyed per file
- packages/theme/kol-components-molecules.css — `img.kol-quicklook-media` zoom-in cursor, `.kol-quicklook-media--fill`, body scroll via `:has()`
- CHANGELOGs, docs/operations/01-release/02-shipped-packages.md, lobby ledger + done/, kol-atlas outbox receipts

### Features Added/Removed
- Published: kol-component 0.280.0 · kol-theme 0.178.0
- Tickets closed: ActionButtonTooltipAnchor · QuickLookFit (kol-atlas)

## Current State

### Working
- CodeBlock copy tooltip 6px under its button (apps/markdown); 1200×800 SVG fits at 987×658, fill 1214 wide with body scroll (apps/media, 1280×800)

### Known Issues
- The boot hook counted one inbox ticket when two were queued (QuickLookFit missed)
- apps/overlays' static Quick Look image shows the zoom-in cursor with no click action

## Next Steps
1. User pushes kol-ds-ui
