# `BackgroundVideo` — start HLS at the rendition the player can show, not the lowest

**Staged:** 2026-10-13 · from a kol-website session (home highlights review)
**Change:** `utilities/BackgroundVideo.jsx` (and `FeaturedCarousel`, which renders it), kol-component 0.252.0

---

## The problem

The user, on kolkrabbi.io's home bento: *"why is this video so low res? Im sure its high res on the
bucket, but Im getting pixles? … its super long lag till you get good res?"*

`BackgroundVideo.jsx:41` is `new Hls()` — no config. hls.js 1.7.1 then starts at the manifest's
**first** rendition and its 500 kbps default bandwidth estimate, and only climbs after measured
fragments. Every master on the B2 bucket lists 360p first (`hls-library/video-home/*/hls/master.m3u8`:
360p · 480p · 720p · 1080p, up to ~6.9 Mbps). So a 640px-tall card plays 640×360 upscaled until ABR
catches up — the pixels, then the lag. The consumer has no seam to change it.

## Ask

Construct with a config that starts where the player can show it:

```js
new Hls({
  startLevel: -1,                   // auto from the estimate, not index 0
  abrEwmaDefaultEstimate: 8_000_000,// assume broadband until measured
  capLevelToPlayerSize: true,       // never fetch above the element's size
})
```

…or expose `hlsConfig` (spread over those defaults). The defaults are the fix; the prop is optional.

## Nothing local

kol-website has its own `HlsVideo` copy for the home hero and applies the same config there; the
bento tiles render through `TiltBento` → `BackgroundVideo` and wait on this.

---

## Resolution — 2026-10-13 · 🟢 closed

**Shipped `@kolkrabbi/kol-component@0.254.0`.** `new Hls({ ...HLS_DEFAULTS, ...hlsConfig })`; `HLS_DEFAULTS`
is exported: your three keys **plus `testBandwidth: false`**. Measured without it, an auto start still
loaded its first fragment at the lowest rendition to test bandwidth: 360 → 720. `hlsConfig` is spread
over the defaults and read when `src` attaches.

Measured on the bucket's `video-home/hero-dark/hls/master.m3u8`, first five main fragments:
a 1280×720 player → 720 · 720 · 720 · 720 · 720 (bare `new Hls()`: 360 first); a 446×250 tile → 360 × 5
(capped to its size). The showcase's BackgroundVideo preview now plays that stream. 0 console errors.

For kol-website: bump; `TiltBento` / `FeaturedCarousel` tiles get it with no change. Your hero's own
`HlsVideo` copy could import `HLS_DEFAULTS` — or render `BackgroundVideo` — and drop its duplicate config.
