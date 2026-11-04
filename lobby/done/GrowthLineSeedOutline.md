---
component: GrowthLineSeedOutline
source: kol-atlas/apps/workspace/src/components/Home.jsx#L8-L52
staged: 2026-11-01
status: draft
deps: [GrowthLineStage, kol-growth Growth.seed]
---

# GrowthLineSeedOutline

## Purpose
Let GrowthLineStage start the line ON the shape's outline, so it fills the shape inward from the edges, instead of outward from a small ring at the shape's centre of darkness. User (kol-atlas, 2026-11-01): *"can it do reverse? start from the edges and fill inwards?"*

## Anatomy
- kol-growth `Growth.seed(cx, cy, r = 14)` today: always a 24-node ring of radius 14 at (cx, cy) or the density's dark centroid.
- GrowthLineStage calls `sim.seed()` (no intro) or `sim.seed(0.5, 0.5)` (intro); no prop reaches the seed.

## Variants
- `seed="centre"` (default, today's behaviour).
- `seed="outline"`: one closed ring of nodes traced along the shape's edge (the density's 0.5 iso-line, or the SVG path itself when `shape` is a path `d`), slightly inset so it starts inside the mask.

## Props
| prop | type | default | controls |
|------|------|---------|----------|
| `seed` | `'centre' \| 'outline'` | `'centre'` | where the closed line starts |

Engine: `Growth.seed` accepts a ring — `seed({ points: [[x, y], …] })` in 0..1 or sim px — node spacing resampled to the engine's split length.

## Styling
None — canvas behaviour only.

## States & interactions
Unchanged: pointer force, settle, wave, resize keep working on an outline-seeded line. Under `intro`, the outline seed replaces `sim.seed(0.5, 0.5)`.

## Dependencies
@kolkrabbi/kol-growth (engine `seed`), kol-component GrowthLineStage.

## Recreation notes
- With a solid shape the inside is dark (tight gaps), so a ring on the edge should crowd inward; anything that pushes outward runs at maxGap and the consumer masks it (Atlas masks the stage to the hexagon with CSS).
- Atlas's current setup to test against: `shape` a `(w, h) => canvas` drawing a solid hexagon at 0.4 of the short side, `params={ minGap: 5, maxGap: 18, contrast: 1.2, growth: 10 }`, no `intro`, stage inside a div masked to the same hexagon (6 % larger, 0.3-unit feather).
- Related, not asked here: Atlas dropped `intro` because its breath and its release to the orb can't be turned off. If the DS wants Atlas back on `intro`, options for "no breath" and "keep the shape (no release)" would do it — a separate ticket on the user's word.

**Return to:** kol-atlas `lobby/outbox/GrowthLineSeedOutline.md`.

## ✅ RESOLUTION — 2026-11-01 · kol-growth@0.5.0 · kol-component@0.332.0

1. **kol-growth 0.5.0** — `seed({ points, inset })` takes any closed ring, in 0..1 (no value past ±2) or sim px, resampled to the split length (half the local gap) and moved `inset` sim px inward; `seed()` and `seed(cx, cy, r)` are unchanged. `outline(density, level = 0.5)` traces the iso-line (marching squares, longest closed ring); `pathRing(d, aspect, fit)` gives a path `d`'s own outline placed as `pathCanvas` places it. `src/selftest.mjs` checks the ring (resampled to half the gap, inset inside, 0..1 = sim px, it grows).
2. **GrowthLineStage `seed="outline"`** (kol-component 0.332.0) — the path itself for a path `d`, the 0.5 iso-line for a canvas fn or the orb, inset `minGap`; under `intro` it replaces `seed(0.5, 0.5)`. `seed="centre"` or none is today's. One deviation: `seed` was already the rng seed (a number), so a number still seeds the rng and a string picks where the line starts; the two can't be combined.
3. **`apps/growth` Outline page** — Atlas's setup: the solid hexagon at 0.4, `{ minGap: 5, maxGap: 18, contrast: 1.2, growth: 10 }`, no intro, unmasked.

Verified on Playwright 1440×900: the ring starts on the hexagon's edge and the line packs inward from it; the path + intro variant fills inward inside the mark. **One finding for Atlas:** the ring grows both ways, and at the default cap (w·h/90, ~14k at 1440×900) the outside spends the nodes, so the hexagon's centre stays open (a ~100 px hole). With `cap={30000}` the hexagon fills solid by ~12 s. Atlas masks the outside away, so pass a larger `cap`.
