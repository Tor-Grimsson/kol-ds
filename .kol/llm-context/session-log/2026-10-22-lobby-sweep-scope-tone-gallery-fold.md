# Session: Lobby sweep — scope accent, card tone, gallery modes, text fold

**Date:** 2026-10-22
**Agent:** Claude (Grim)
**Summary:** Seven lobby tickets built, published and closed with receipts (kol-mirror · kol-fxr ×3 · kol-branding ×3); kol-hardware 0.6.0, kol-component 0.288.0–0.290.0.

## Changes Made

### Files Modified
- `packages/hardware/src/indicators/SignalScope.jsx` — live scope: faint curve, played trace · playhead · dot on `--kol-slider-playhead`; `now` external clock.
- `packages/hardware/src/value/EnvelopeGenerator.jsx` — `useEnvelopeGenerator({ now })` forwards to the scope.
- `packages/component/src/molecules/MenuItem.jsx` — `ROW_BY_SIZE` sm · md · lg `px-2`.
- `packages/component/src/molecules/ContentCard.jsx` · `ContentRow.jsx` — `tone` (rest + hover from the bundle); card reserves measured actions width on the text; row text `min-w-0`.
- `packages/component/src/molecules/ColorRamp.jsx` — five a row below sm, captions truncate.
- `packages/component/src/molecules/TextFold.jsx` — new.
- `packages/component/src/organisms/MediaGalleryModes.jsx` — new; `MediaTileGallery layout="waterfall"`, `onOpen` on it and `GalleryCarousel`.
- Showcase previews: SignalScope untouched; ContentCard (tones, long title), ContentRow (`tone`, `long title` states), ColorRamp (ten steps), TextFold, MediaGalleryModes. Registry · classification · inventory rows for the two new components.
- `docs/operations/01-release/02-shipped-packages.md` — hardware 0.6.0, component 0.290.0.

### Features Added/Removed
- `TextFold`, `MediaGalleryModes` (kol-component); `SignalScope now`.

## Current State

### Working
- Live: kol-hardware 0.6.0 · kol-component 0.290.0. Lobby inbox empty; receipts in kol-mirror, kol-fxr, kol-branding outboxes.

### Known Issues
- `validate:variants` V2 flags `Modal.jsx:186` and `apps/catalog/src/App.jsx:91` (`Button tone="inverted"`) — not from this session.
- A `tone` on a card/row cascades to child controls with no tone of their own (the wrapper-tone rule).
- The standing go for lobby tickets was widened to every filer ("just do the tickets as they come in"); the memory file update was blocked and still says mirror/monitor only.

## Next Steps
1. Push is the user's.
2. Round 16's pick and plan 2.2 are still open.
