---
component: PlayDisc · VideoSheet · kol-icons playback/tools variants
source: kol-r2b2/src/AudioTile.jsx (PlayDisc, AudioTile, VideoTile, VideoSheet) · kol-r2b2/src/index.css (.r2b2-play)
staged: 2026-08-27
status: draft
deps: [IconFrame, Slider, Popover, AudioPreview, KindPreview, ColumnBrowser]
---

# PlayDiscAndVideoBar

## Purpose
Three things ruled in kol-r2b2 on 2026-08-27, compiled into one ticket at the user's request ("compile this and send it to kol-ds").

## 1. PlayDisc — the Finder play/pause disc on the column tiles
The DS `AudioTile` / `VideoTile` (0.106.0) carry a square secondary `IconFrame`. The ruled control is Finder's: a round disc, **hidden at rest, shown on hover** of the tile, over full-bleed artwork (audio: the file's embedded ID3 cover — `src/lib/id3.js`; video: the sibling poster, media element hidden — *the tile never shows a decoded video frame*).

```jsx
<IconFrame name={playing ? 'pause' : 'play'} variant="secondary" size="lg" radius="full"
  onClick={toggle} aria-label={playing ? 'Pause' : 'Play'}
  className="relative r2b2-play bg-fg-inverse-64 border-fg-96" />
```
```css
.r2b2-play {
  background-color: color-mix(in srgb, var(--kol-surface-on-inverse) 64%, transparent); /* = bg-fg-inverse-64 */
  color: var(--kol-color-absolute-white);
  border: 2px solid color-mix(in srgb, var(--kol-surface-on-primary) 96%, transparent);  /* = border-fg-96 */
  box-shadow: 0 0 4px 3.5px rgba(0, 0, 0, 0.4);
  opacity: 0; transition: opacity var(--kol-transition-base);
}
.group:hover .r2b2-play, .r2b2-play:focus-visible { opacity: 1; }
```
Every IconFrame variant paints its own background/border later in the same layer, so the paired utilities (`bg-fg-inverse-64`, `border-fg-96`) are on the element **and** restated — the organism should own this so the restating goes. **No backdrop-filter** on the disc: it flips the tile onto a composited layer on hover and the artwork's saturation jumps (Chrome).

## 2. VideoSheet — the QuickTime bar in the overlay
Video in the overlay: no native controls; a frosted strip over the bottom edge of the video, inset 16px, **radius 4px (never more)**, `bg-fg-absolute-64` (absolute black — it sits on video, not on the theme) + `backdrop-blur-md`, `h-14 px-4 gap-3`. Left → right: `IconFrame ghost sm` skip-back 15 · play/pause · skip-forward 15 · elapsed `kol-mono-14 text-fg-64` · **DS `Slider`** as the scrubber with its readout showing the **remaining** time (`formatValue`, `displayWidth 5`) · volume behind `slider-01`, the vertical `slider-black` range in a `PopoverPanel` (as `AudioPreview`). Click on the video toggles play; `autoPlay`. Source verbatim: `kol-r2b2/src/AudioTile.jsx` `VideoSheet`. No `title` tooltips on the buttons — aria-labels only.

## 3. kol-icons — variants at the 0.21.0 pause weight
`pause` is now filled bars (0.21.0). The glyphs beside it are still 1.5px strokes and read a weight lighter:
- `playback/skip-back` / `skip-forward` — thin chevrons. Wanted: filled/thick variants matching the pause, and QuickTime's **15-second badge** form (arrow-circle with "15") for the video bar.
- `tools/slider-01` — the knobs are **stroked circles** in both the published set and `packages/icons/src/kol-icon-set-v1/tools/slider-01.svg` (verified 2026-08-27; no filled version exists). Wanted: filled knobs.

## Consumer state
All three live locally in kol-r2b2 (`src/AudioTile.jsx`, `.r2b2-play` in `src/index.css`) via `ColumnBrowser`'s `renderPreview` and the lightbox. On publish: bump; the local tiles, disc CSS and `VideoSheet` go.

## ✅ RESOLUTION — 2026-08-27 · kol-component 0.107.0 · kol-theme 0.72.0 · kol-icons 0.22.0

(1) PlayDisc: AudioTile / VideoTile carry the Finder disc over full-bleed artwork — .kol-play-disc in kol-theme, declared after the IconFrame variants so nothing is restated; audio artwork = the ID3 cover (readCover promoted verbatim), video = the poster with the media element hidden. (2) VideoSheet promoted verbatim (skip-back-15 · play/pause · skip-forward-15 · elapsed · Slider scrubber with remaining · volume popover). (3) kol-icons: skip-back-15 / skip-forward-15 (the QuickTime badge), skip-back-bold / skip-forward-bold (3px chevrons), slider-01 knobs filled — the 1.5px skip chevrons stay for kol-chess. AudioSheet (cover above the player) not promoted — not in the ask. Verified in source only (no server run, by your rule).

**Remainder here:** none — kol-r2b2 bump component 0.107.0 · theme 0.72.0 · icons 0.22.0; drop src/AudioTile.jsx (keep AudioSheet if you want it — or file it), .r2b2-play in index.css, and the renderPreview video/audio branches; import VideoSheet, AudioTile, VideoTile, readCover from @kolkrabbi/kol-component.

