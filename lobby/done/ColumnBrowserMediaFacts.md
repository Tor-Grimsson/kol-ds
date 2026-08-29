---
component: ColumnBrowser
source: kol-r2b2/src/FileList.jsx (renderPreview) · kol-component/src/organisms/ColumnBrowser.jsx Preview (facts) · kol-r2b2/src/AudioPreview.jsx
staged: 2026-08-27
status: draft
deps: [KindPreview, IconFrame, Slider, Popover]
---

# ColumnBrowserMediaFacts

## Purpose
The preview column's facts (Kind · Type · Size · Dimensions · Date) read Dimensions for images only. Audio and video get no pixel size and no length. User, 2026-08-27: "missing pixel dimensions and length in info" · "missing length". The facts list has no consumer slot, so this can't be done from kol-r2b2.

## What changes
- **Facts.** `Dimensions` for video too (`videoWidth × videoHeight px`); new `Length` row for audio + video (`m:ss`). Both come off the media element's `loadedmetadata`, captured on the media frame exactly as `<img>` load is today (`onLoadCapture`) — add `onLoadedMetadataCapture`, read `videoWidth` / `videoHeight` / `duration` when the target is VIDEO or AUDIO. Must work for consumer `renderPreview` nodes as well (kol-r2b2 draws its own `<video>` / `<audio>`).
- **Order.** Kind · Type · Size · Dimensions · Length · Date. Dimensions on image + video, Length on audio + video, `…` until metadata lands (as Dimensions does today).
- **KindPreview video in the column.** There is no video branch (falls to `AssetPlaceholder`). Add one as a tile: bare `<video playsInline preload="metadata">` covering the same square as images (`w-full h-full object-cover`), **no native controls**, one play/pause `IconFrame` (`lg`, `secondary`) centred over it. **No Figure, no border** — `VideoBlock`'s Figure border is why the consumer bypassed it. Native controls only in the overlay.
- **KindPreview audio in the column.** A square tile with one play/pause `IconFrame` (`lg`, `secondary`) — nothing else. Timeline + volume belong to the overlay / Quick Look, not a 288px column (Finder model, user ruling 2026-08-27). Overlay player: `IconFrame` play/pause · `Slider` seek with `m:ss` readout · volume hidden behind `slider-01`, opening as a vertical `slider-black` range in a `PopoverPanel` (placement top). No title line — the name sits in the facts.

## Consumer reference
kol-r2b2 `src/AudioPreview.jsx` (`AudioTile`, `AudioPreview`) and the `renderPreview` in `src/FileList.jsx` are the ruled local versions; images `object-cover` the square.

## ✅ RESOLUTION — 2026-08-27 · kol-component 0.106.0

ColumnBrowser facts: Kind · Type · Size · Dimensions (image + video) · Length (audio + video, m:ss) · Date — both off loadedmetadata captured on the media frame, so consumer renderPreview nodes count. AudioPreview · AudioTile · VideoTile promoted verbatim from kol-r2b2 (the current ruled versions — VideoTile with its play/pause control, not the ticket's native controls); KindPreview's video branch is VideoTile, its audio branch AudioTile; formatLength exported. Verified in source only (no server run, by your rule).

**Remainder here:** none — kol-r2b2 bump kol-component 0.106.0; swap src/AudioPreview.jsx for the DS exports (AudioPreview, AudioTile, VideoTile, formatLength from @kolkrabbi/kol-component) and drop the local file; the renderPreview video/audio branches can go — KindPreview renders the tiles now.

