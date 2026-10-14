# `PanZoomViewport` — view commands: zoom to a scale, fit to a rect, a max in real terms

**Staged:** 2026-10-13 · from a kol-fxr session (plan 33, the user with Affinity's View › Zoom open: *"wait command 1 2 3 4 are not bound?"*)
**Change:** `organisms/Canvas.jsx` — `PanZoomViewport` (`view = { zoom, x, y }`, `zoomAt`, `ZOOM_MAX = 8`, the ⌘0 / ⌘= / ⌘- keys, `kol:zoom-at`); kol-component 0.257.0

---

## The problem

kol-fxr is building Affinity's View › Zoom: In · Out · To Fit · To Width · To Selection · 100% · 200% · 400% · 800% (⌘1–⌘4). Three things the viewport can't be asked today:

1. **Fit, from outside.** ⌘0 resets `view` to `{ zoom: 1, x: 0, y: 0 }` inside the key handler; a menu row has no way to ask for it — `kol:zoom-at` is relative and cannot reset the pan.
2. **Fit to a rect.** To Width (the frame's width fills the viewport) and To Selection (a rect in frame px fills it) need a zoom AND a pan set together.
3. **`ZOOM_MAX = 8` is relative to the fitted frame**, not to real pixels. A 1080-wide frame fitted on a 1600 screen sits at ~0.58 px per frame px, so the 8× cap is ~464% real — Affinity's 800% (⌘4) cannot be reached.

kol-fxr does the absolute steps (100–800%) itself: it measures the frame's layout width (`[data-canvas-frame].offsetWidth / virtualWidth` = the fit scale), and dispatches `kol:zoom-at` with `factor = target / (zoom × fit)` at the viewport centre. That part needs nothing — only the cap stops 800%.

## Ask

- **`kol:zoom-fit`** window event, `detail: { to?: 'frame' | 'width' | { x, y, w, h } }` — `'frame'` (default) is exactly what ⌘0 does today; `'width'` fits the frame's width (centred vertically); a rect is in frame (virtual) px, fitted with a margin (e.g. 24 screen px) and centred.
- **`ZOOM_MAX` in real terms** — the cap applies to `zoom × fitScale` (e.g. 32 real, Affinity's ceiling is far higher), or simply a much larger relative cap; `ZOOM_MIN` likewise generous (e.g. 0.02 real).
- Optional, if it costs nothing: **`kol:zoom-to`** `detail: { scale }` — set `zoom × fitScale = scale` about the viewport centre, so consumers stop measuring. kol-fxr will use it if present and keep its measure otherwise.

Defaults: none of this changes ⌘0 / ⌘= / ⌘- or the wheel.

## Verify

Showcase canvas: dispatch `kol:zoom-fit` → the opening view; `{ to: 'width' }` → the frame's width fills; `{ to: { x: 100, y: 100, w: 200, h: 200 } }` → that rect fills, centred; zoom to 8× real (via repeated `kol:zoom-at` or `kol:zoom-to`) is reachable.

For fxr on the return: bump; View › Zoom › To Fit / To Width / To Selection go live (wired to `kol:zoom-fit` already, inert until then); 800% reaches 800.

## ✅ RESOLUTION — 2026-10-13 · kol-component@0.258.0

PanZoomViewport takes two new window events beside kol:zoom-at: `kol:zoom-fit` { to: 'frame' (default, ⌘0's view) | 'width' | { x, y, w, h } in frame px, 24px margin, centred } and `kol:zoom-to` { scale } (real, 1 = 100%, about the centre). Zoom clamps are now real: 2%–3200% of screen px per frame px (fit = [data-canvas-frame].offsetWidth / 1080), on every path — keys, wheel, zoom-at. ⌘0 / ⌘= / ⌘- and the wheel otherwise unchanged. Verified on the showcase canvas (540×418 viewport, rest 0.343 real): 'width' → frame 540 wide at x 0; rect 100,100 200×200 → 370² at (85, 24), centred with the 24 margin; zoom-to 8 → exactly 8.000 real; 40× zoom-at 1.5 caps at 32.000 real; zoom-fit {} → back to the rest view.

**Remainder here:** none — kol-fxr bump kol-component ^0.258.0; View › Zoom To Fit / To Width / To Selection go live; 800% via kol:zoom-to { scale: 8 } or your measure.

