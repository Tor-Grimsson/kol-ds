---
component: GrowthLineStage + kol-growth (the line settles, the intro)
source: kol-fxr/src/loops/growth/engine.js#L1-L319 · kol-fxr/src/components/HomeStage.jsx#L1-L190
staged: 2026-10-31
status: draft
deps: [GrowthLineStage, kol-growth]
---

# GrowthLineIntro

## Purpose
The user, 2026-10-31: *"right now I want to ship it to DS so DS can ship it to Atlas."* fxr's growing line moved on after GrowthLineStage (kol-growth 0.3.0) was cut from it: the line cools instead of freezing, the mouse is soft, a slow wave keeps it alive, a resize keeps the line, and it carries the load intro. kol-atlas wants all of it, growing into the Atlas hexagon. fxr keeps its own copy (his ruling: fxr does not adopt kol-growth); this is for Atlas and anyone else.

## Anatomy
- **Engine** (`kol-growth`) — fxr `src/loops/growth/engine.js`, read it whole; it is the spec.
- **Stage** (`GrowthLineStage`) — fxr `src/components/HomeStage.jsx`, read it whole; it is the spec.

## Variants
- **No intro** — today's stage (orb or any shape), with the engine changes below.
- **Intro** — `intro` on: the line grows only inside the `shape`, breathes there, then lets go and grows out to fill the frame. Shape is any shape (fxr: the FXR letters; Atlas: the hexagon).

## What changed in the engine (kol-growth 0.3.0 → fxr)
1. **Heat, not a freeze.** Each node carries heat 1 → 0 that fades every step; a split beside it, its own motion or the pointer raises it; force and growth scale with heat and the last quarter tapers, so nothing stops mid-move. Replaces 0.3.0's `settle`-steps freeze (the rim never cooled: rubber-string edges, a mouse move woke the whole rim, then a hard stop). Push heat crosses a strand only above a fifth of the gap, less 0.15 a hop.
2. **Front growth** — splits go to the open front, budgeted by its length, so the rim advances at a steady pace; growth slows near the cap.
3. **Soft mouse** — hover reach 0.24 of the short side (was 0.08 / 0.12), bell falloff `(1 − d²/r²)²`, no hard rim.
4. **`draw({ wave })`** — a draw-time displacement `x + a·sin(k·y + p)`, `y + a·sin(k·x + 1.3p + 1)`; the sim is untouched, costs nothing.

## What changed in the stage
1. **A resize keeps the line** — re-centre the nodes by half the size change, set the frame, re-sample the density; never reseed (today `ResizeObserver(restart)` restarts it — `\` and every window resize replayed the growth in fxr).
2. **Slow wave** — 24 s period, 9 px, 640 px crests, every frame (so it never sleeps; it still costs ~nothing). Reduced motion: no wave.
3. **The intro** (one line from load to page, no second sim, no solid layer, no cut):
   - grow on the shape's density (shape at `fit` 0.5, centre seed, `{ minGap: 5, maxGap: 18, contrast: 1.2, growth: 5 }`, 4 steps a frame) for 3.8 s, drawn only through the shape (`destination-in` mask) in the emphasis ink;
   - rest 4 s: breath `ink = 0.7 + 0.3·cos` on a 2 s period, growth off after the first breath; the page's controls fade in (0.7 s) at 0.8 s into the rest;
   - release 4 s: the density blends shape → orb, params go to the page's, all heat to 1; the stage's own ink fades up as the mask's fades out; the pointer is ignored until it ends.
   - an `onIntroEnd` callback, so the app can hand off its loader.

## Props (new)
| prop | type | default | controls |
|------|------|---------|----------|
| `wave` | `false \| { ms, a, l }` | `{ 24000, 9, 640 }` | the slow wave |
| `intro` | boolean | false | grow in the shape, breathe, release to the orb |
| `onIntroEnd` | fn | — | called when the release ends |

## Styling
Ink stays the canvas's `text-*` colour; the intro's bright ink is the emphasis ink (fxr reads `text-emphasis`).

## Dependencies
kol-growth, GrowthLineStage. HubHome only if it should run the controls' fade itself (fxr fades `[data-hub-signed-out]`'s children by hand).

## Recreation notes
- Acceptance, measured in fxr (plan 45, recordings `kol-fxr/_tmp/2026-10-31-loader/w4e/`): no frame changes > 15% of the centre box (fxr: 8.4%); breath ink 0.4–1.0; node count never reseeds through the release (13% gradual dip); a resize 1440 → 1100 → 1440 keeps node ids; frame p95 ≤ 16.7 ms at DPR 2 with the wave.
- Ship a showcase page with the hexagon so Atlas sees its own case.

## ✅ RESOLUTION — 2026-10-31 · kol-growth@0.4.0 kol-component@0.322.0

kol-growth 0.4.0: fxr's engine verbatim (heat cooling, front growth, soft pointer, draw({ wave })). kol-component 0.322.0 GrowthLineStage: settles with no hard stop, soft speed-scaled pointer, resize keeps the line, wave prop (24s/9px/640px), intro (grows in any shape at fit 0.5 in emphasis ink, breathes, releases to the orb) + onIntroEnd; showcase preview has an intro variant with the hexagon.

**Remainder here:** none — kol-fxr bump kol-growth@0.4.0 kol-component@0.322.0.

