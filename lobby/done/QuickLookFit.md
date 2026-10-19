---
component: QuickLookFit
source: kol-component@0.279.0/src/organisms/MediaLibraryPages.jsx#L697-L702 (MediaInspector image body) · kol-theme@0.177.0 kol-components-molecules.css .kol-quicklook-media
staged: 2026-10-19
status: draft
deps: [MediaInspector, QuickLookFrame]
---

# QuickLookFit

## Purpose
Quick Look (`MediaInspector` → `QuickLookFrame`) should show an image as large as the window allows, SVGs included, with click-to-zoom. Found in kol-atlas, whose media is almost all 1200×800 SVG cards: each opens in a fixed 640px box with wide empty margins.

## Anatomy
Unchanged: `FullscreenOverlay` → `QuickLookFrame` (header · body · footer) → `img.kol-quicklook-media`.

## Variants
- **Fit (default):** the image fills the body at its own aspect: `max-width: var(--kol-ql-max-w)`, `max-height: var(--kol-ql-media-h)`, `object-fit: contain`, for SVG too.
- **Fill width (after a click):** width = the body's width, height follows; the body scrolls vertically when the image is taller. Click again → Fit.

## Props
None new. The behaviour is internal to the image body.

## Styling
- Today an SVG gets an inline `style={{ width: 'min(var(--kol-ql-max-w), 640px)', height: 'min(var(--kol-ql-media-h), 640px)' }}` (L700-701) — the cause.
- Keep the 640 cap only when the SVG's intrinsic size is small (naturalWidth < 640 — the 32px logo case it was written for); otherwise size SVGs like rasters.
- Cursor: `zoom-in` in Fit, `zoom-out` in Fill.

## States & interactions
Click the image toggles Fit ↔ Fill width. Paging (‹ › / arrows) resets to Fit. The corner resize keeps working; Fit follows the window's size.

## Dependencies
`MediaInspector`, `QuickLookFrame`, `.kol-quicklook-media` (kol-theme molecules).

## Recreation notes
A change to an existing organism, no new component. Consumer: kol-atlas `apps/workspace/src/components/ImageInspector.jsx` (filmstrip + contents images); no local override — the inline style would need `!important`.

## Resolution — 2026-10-19 · 🟢 closed · kol-component@0.280.0 · kol-theme@0.178.0

`MediaInspector` keeps the 640 box only for an SVG under 640 wide (or with no size); a larger one fits like a raster. A click on the image toggles fit ↔ fill width (`.kol-quicklook-media--fill`, body scrolls from the top, `zoom-in`/`zoom-out` cursors); fill is keyed to the file, so paging opens in fit. Verified in `apps/media` at 1280×800: a 1200×800 SVG fits at 987×658 (was the 640 box), fill 1214 wide with the body scrolling, second click back to 987×658; the 32px logo.svg still opens in 640×640.
