# @kolkrabbi/kol-growth

The growing line: differential growth — one closed line that grows, folds and never crosses itself, packing tighter
where a density field is darker. Plain ESM, no React, no dependencies. Engine tier (ARCHITECTURE §3): the stage that
draws it on a page is kol-component's `GrowthLineStage`; kol-fxr's generator and effect run it in their own loops.

```js
import { Growth, densityFrom, mulberry32, orbCanvas, outline, pathCanvas, pathRing } from '@kolkrabbi/kol-growth'

const sim = new Growth({ w, h, density: densityFrom(pathCanvas(d, w / h, 0.6)), rand: mulberry32(7), cap: 14000 })
sim.setParams({ minGap: 6, maxGap: 24, contrast: 1.4, growth: 8 })
sim.seed()                       // a small ring at the field's centre of darkness
sim.seed({ points: outline(sim.density), inset: 5 })   // or a ring on the shape's edge — fills inward
sim.step()                       // one step: smooth, repel, resample, grow — call per frame until x.length hits cap
sim.setParams({ settle: 120 })    // the packed interior rests; only the growing front and the pointer move
sim.poke(px, py, down)           // the pointer as a force: a push, or a blast when down
sim.draw(ctx, w, h, { ink, width: 1 })   // the one path onto a canvas
sim.pathD(w, h)                  // the same path as an SVG `d`
```

| export | does |
|---|---|
| `Growth` | the sim — `step`, `seed` (`()` · `(cx, cy, r)` · `({ points, inset })`, a ring in 0..1 or sim px resampled to half the gap), `poke`, `draw`, `pathD`, `setParams({ minGap, maxGap, contrast, growth, cap, bleed, settle })` — `bleed` (default 0, the framed clamp) lets the line run that far past every edge, where it freezes; `settle` (default 0, off) cools a packed node after that many steps so it stops, grows only the front, and `poke` re-heats what it touches |
| `outline(density, level?)` | the density's iso-line (0.5) as the longest closed ring in 0..1, for `seed({ points })` |
| `densityFrom(canvas, cols?, invert?)` | 1 − luma on a grid, lightly blurred — the field the spacing reads |
| `SIM_W` | 1000, the sim width kol-fxr's loops use |
| `mulberry32(seed)` | the seeded 0..1 PRNG; pass as `rand` and the same seed grows the same line |
| `orbCanvas(aspect)` | the built-in orb, dark at the centre |
| `pathCanvas(d, aspect, fit?)` | any SVG path `d`, solid black on white, centred at `fit` of the frame |
| `pathRing(d, aspect, fit?, n?)` | the same path's outline as a ring in 0..1, placed as `pathCanvas` places it |

`densityFrom`, `orbCanvas`, `pathCanvas` and `pathRing` draw on a canvas, so they need a browser; the sim itself runs anywhere
(`pnpm --filter @kolkrabbi/kol-growth test`). Proved in `apps/growth`.
