---
component: FullscreenOverlay close + MediaLibrary (variant="browse") header
source: kol-component/src/utilities/FullscreenOverlay.jsx (`.kol-overlay-close`) · kol-theme `.kol-media-picker`
staged: 2026-10-10
status: draft
deps: [FullscreenOverlay, MediaLibrary, CloseButton]
---

# MediaPickerCloseOnTheHeaderRow — the picker's X floats above its header

## Purpose
kol-fxr's media picker is picker A's shape: `FullscreenOverlay scrim` around `MediaLibrary variant="browse"`, Cancel · Use in a footer. User, 2026-10-10, on the open picker: *"x close is in a weird place, align better."*

## What happens
The overlay's `CloseButton` (`.kol-overlay-close`) sits in the panel's top-right corner, ~100px above the library header row (title `Media` · bucket dropdown · lock · gear). It lines up with nothing: not the title, not the header controls, not the panel edge the controls end on.

## Ask
The close sits ON the library header row — vertically centred on it, its right edge on the same line as the header controls' right edge (after the gear). Either the browse variant takes a `headerEnd` slot (a consumer passes its close and sets `closeButton={false}`), or the picker shape positions `.kol-overlay-close` against the header itself. Your call which; kol-fxr passes whatever prop it needs.

## Not asked
No change to Esc / scrim dismissal.

---

## Resolution — 2026-10-10 · 🟢 closed

**Shipped `@kolkrabbi/kol-component@0.251.0`.** No new prop: `MediaLibraryBrowse` already had the
slot — `headerTrailing`, after the gear on the header row. The DS's own `MediaLibrary
variant="picker"` (0.249.0, picker A's shape) had the same floating X, so it is fixed there:
`FullscreenOverlay closeButton={false}`, and a `CloseButton` rides `headerTrailing` (a consumer's own
`headerTrailing` still renders, before it).

Measured on apps/media `/picker` at 1280: X top 125 · h 26, the gear's exact row; X right 1131 =
header right = the Use button's right. No `.kol-overlay-close` in the DOM.
Shot: `_tmp/2026-10-10-picker-close.png`.

For fxr: your picker IS this shape — switch to `<MediaLibrary variant="picker" open client accept
onClose onSelect />` and drop the hand-built overlay + footer. Keeping your own? Pass
`closeButton={false}` to the overlay and your close in `headerTrailing`.
