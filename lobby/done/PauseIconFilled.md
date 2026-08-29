---
component: kol-icons/playback/pause
source: kol-r2b2/src/AudioTile.jsx (PlayDisc)
staged: 2026-08-27
status: draft
deps: []
---

# PauseIconFilled

## Purpose
`playback/pause.svg` is two 1.5px strokes with round caps; `playback/play.svg` is a filled shape with a 1.5px round-joined stroke. Side by side in a play/pause control the pause reads a weight lighter, and thickening the stroke rounds its ends to half the width — it can't take the play's ~0.75px corners. Ruled in kol-r2b2 2026-08-27 ("there you go, send this icon to ds").

## The glyph — verbatim
Filled bars at the play's weight and corner radius, spanning the play's stroked height (5.25 → 18.75):

```svg
<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
  <rect x="6.5" y="5.25" width="4" height="13.5" rx="0.75"/>
  <rect x="13.5" y="5.25" width="4" height="13.5" rx="0.75"/>
</svg>
```

## Recreation notes
Replace `playback/pause.svg` with this (the stroked one has no second home worth keeping), or ship it as `pause-filled` if the stroked one must stay — the DS's call. `fill="currentColor"`, no stroke. Consumer draws it inline in `PlayDisc` until the set carries it.

## ✅ RESOLUTION — 2026-08-27 · kol-icons 0.21.0

playback/pause.svg replaced with the filled glyph verbatim — two bars at the play's weight and 0.75 radius, 5.25 → 18.75, fill currentColor, no stroke. The stroked one had no second home; quarantined at _tmp/2026-08-27-pause-stroked/. Verified in source only (no server run, by your rule).

**Remainder here:** none — kol-r2b2 bump kol-icons 0.21.0; drop the inline pause in PlayDisc — name 'pause' carries it.

