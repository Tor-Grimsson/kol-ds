---
component: GrowthLineStage
source: kol-fxr/src/loops/growth/engine.js#L1-L200 · kol-fxr/src/components/HomeStage.jsx#L1-L90 · kol-fxr/src/loops/flow/growthLine.js#L1-L153 (sourceCanvas · vectorCanvas)
staged: 2026-10-30
status: draft
deps: []
---

# GrowthLineStage

## Purpose
fxr's growing line (differential growth: one closed line that grows, folds and never crosses itself, packing tighter where a density field is darker) as a KOL package piece, so any app can grow it into a shape. kol-atlas wants it on its new home at `atlas.kolkrabbi.io/`: the sign-in split's right half, the line growing into the Atlas hexagon. Today it exists only inside the kol-fxr app, so the only way in is copying it, and then there are two engines.

## Anatomy
- **Engine** (`Growth`, `densityFrom`, `SIM_W`): plain JS, no React. `engine.js` as it is, 200 lines; its one helper is a seeded rng (`mulberry32`, kol-fxr `src/loops/gl/rng.js`).
- **Stage** (React): one `<canvas>` filling its box. HomeStage.jsx's sim loop: size to the box at dpr ≤ 2, density from a shape, grow to the cap, stop drawing; restart on resize; ink = the canvas's computed `color`, repainted on a `data-theme` flip; pointer pushes (move) and blasts (press), the line regrows and sleeps again.

## Variants
The shape is the variant. fxr has two: the built-in orb (`sourceCanvas('orb')`) and its mark (`vectorCanvas`, `/?stage=logo`). Atlas needs a third: any SVG path / mark, drawn centred into the canvas as black-on-white and read with `densityFrom`.

## Props (Stage)
| prop | type | default | controls |
|------|------|---------|----------|
| `shape` | `'orb'` · SVG path `d` string · `(w, h) => canvas` | `'orb'` | the density: dark inside the shape packs tight |
| `fit` | number 0–1 | 0.6 | the shape's size in the box (fxr's mark passes 0.6) |
| `params` | `{ minGap, maxGap, contrast, growth }` | orb `{6, 24, 1.4, 8}` | spacing; fxr's mark uses `{4, 48, 2, 8}` |
| `cap` | number | `min(14000, w·h/112)` | node cap, where growth stops |
| `pointer` | boolean | true | the poke / blast; off for a still stage |
| `seed` | number | random | `mulberry32` seed, so a page can grow the same line every visit |
| `className` | string | | sizing; ink comes from `color` (a `text-*` class) |

## Styling
- Canvas `size-full`, ink from `getComputedStyle(canvas).color` — HomeStage passes the theme's meta fg; line width 1 CSS px.
- No paper fill on the stage (fxr's effect paints `#f4f1ea` paper; the stage clears to transparent).
- **Drop on recreation:** fxr's `transport` / epoch keying (effect only), the editor params schema, `LOGO` query switch.

## States & interactions
Growing (rAF) → finished (no rAF, costs nothing) → pointer wakes it, settles a second after the pointer leaves. Theme flip repaints a finished line. **Add:** `prefers-reduced-motion` draws the finished line once with no animation and no pointer force (fxr has no handling today).

## Dependencies
None in KOL. Consumer-only helpers the package must own: `mulberry32`; a shape → canvas helper for path strings (fxr's `sourceCanvas` / `vectorCanvas` are app code).

## Recreation notes
- Engine as a plain export (e.g. `@kolkrabbi/kol-…/growth`) so fxr's effect and generator keep using it in their own loops; the Stage as a component on top. Which package is KOL's call.
- After it ships, kol-fxr's HomeStage and fxGrowth import it and its local engine retires — one engine.
- kol-atlas consumes: `<GrowthLineStage shape={ATLAS_HEX_D} className="text-meta" />` on the home's right half.

## Resolution — 2026-10-30

🟢 `closed` — shipped in **`@kolkrabbi/kol-growth` 0.1.0** (new, engine tier) and **`@kolkrabbi/kol-component` 0.319.0** (component live on the registry 2026-10-30; kol-growth accepted by the publish but not yet visible at the one check — first publish of a new name).

**Placement — decided, for his review.** The engine is its own package, `@kolkrabbi/kol-growth`: plain JS with two consumers today (kol-fxr's generator and effect, and the stage), and ARCHITECTURE §3's engine tier puts such an engine in its own package, never inside a UI package and never merged into another engine. The Stage is a kol-component organism over it: a React component cannot live in an engine package, and it is general-purpose (fxr's Hub, Atlas's home). Proved in the engine's app, `apps/growth`.

## Built — 2026-10-30

- `packages/growth/` — `@kolkrabbi/kol-growth` 0.1.0.
  - `src/engine.js` — kol-fxr `src/loops/growth/engine.js`, byte-for-byte (`diff` clean): `Growth`, `densityFrom`, `SIM_W`.
  - `src/rng.js` — `mulberry32`, verbatim from fxr `src/loops/gl/rng.js` (the schema randomiser stays in fxr).
  - `src/shapes.js` — `orbCanvas(aspect)` (fxr's `sourceCanvas('orb')` branch verbatim) and `pathCanvas(d, aspect, fit)` (new: a path `d`, measured with SVG `getBBox`, filled black on white, centred at `fit`).
  - `src/selftest.mjs` (`pnpm --filter @kolkrabbi/kol-growth test`) — grows to the cap, a seed repeats, `poke` moves the line.
- `packages/component/src/organisms/GrowthLineStage.jsx` — HomeStage's loop, its props as the table: `shape` (`'orb'` · path `d` · `(w, h) => canvas`), `fit` 0.6, `params` (orb `{6, 24, 1.4, 8}`), `cap` (`min(14000, w·h/112)`), `pointer`, `seed`, `className`. Clears to transparent; ink from computed `color`, repainted on `data-theme`. **Reduced motion** grows the line off screen in ~12ms slices (4× `growth` a step) and draws it once; no pointer listeners. Dropped: transport / epoch keying, the editor schema, the `LOGO` switch.
- `apps/growth` (`pnpm growth`, 5215, `/apps/growth`) — the stage on AppHub, Orb · Path pages.
- `showcase/src/previews/GrowthLineStage.jsx` — `orb` · `path` variants (a hexagon `d`).
- Docs: inventory row, package topology, shipped packages, apps-tier index, `docs/stack/02-technical.md`, Apps page, ARCHITECTURE §3 (fourth engine).

Verified in `apps/growth` (Playwright, `_tmp/2026-10-30-growth/`): the orb grew and stopped drawing at ~19.5s (stroke count flat), a move + press woke it (52–58 frames) and it slept again ~6s later; same on the hexagon at gaps 8 · 32. Reduced motion: no paint while growing, one stroke at ~4.6s, the pointer added none. No console errors. A solid path shape wants a wider `minGap` than fxr's mark (4/48 hits the cap as a small round blob in a large hexagon).

Gates: `validate:roster`, `validate:syntax`, `validate:taxonomy`, `validate:placements`, `validate:homes`, `validate:imports`, `validate:vault-links`, `validate:tags` clean; `validate:preview-files` / `validate:metadata` / `validate:variants` no new finding.
