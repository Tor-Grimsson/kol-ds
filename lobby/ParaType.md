# Lobby spec — `ParaType` (DEFERRED — do NOT build unattended)

> Status: **deferred, spec-only.** This is a recreate-from brief for a DEDICATED
> session. It documents the crown-jewel parametric-type capability so it can be
> rebuilt properly into `@kolkrabbi/kol-foundry` — NOT tonight. It is too large and
> too dependency-heavy to rush-port unattended (an 864-line composition page + 6
> effect modules + 7 controls + 2 engines + ~8 external libs). Build it deliberately.

## 0. What it is

A **parametric font synthesizer**. Unlike every other foundry component — which
loads and inspects an *existing* font — ParaType **generates letterforms from
scratch**, procedurally, from ~30 numeric parameters. No font file. You move a
slider ("stem width", "contrast", "superness") and the glyphs redraw as SVG
paths in real time. It is the foundry's membership test taken to its limit: it
doesn't just manipulate a font, it *is* the font engine.

Lineage (each cited in the source comments): **METAFONT** (Knuth, parametric pen
strokes), **Amstelvar / Prototypo** (expressive axes: contrast, aperture, arch),
**Metaflop** (anatomy overlay), **LeonSans** (skeleton/centerline engine), **Font
Playground** (2D XY pad), **axis-praxis** (per-axis animate).

## 1. Provenance (read-only source)

Repo on disk: `kol-ds-type` (formerly `kol-typefaces`).
Path: `kol-type-tools/kol-para-type/src/`

```
lab/
  data.js                 anatomy ontology, PARAM_DEFS, presets, resolver, envelopes
  math.js                 superellipse, catmull-rom, seeded RNG, perlin, resampling
  engines/
    index.js              ENGINES registry + renderGlyph(engine, glyph, params)
    classic.js            outline-contour engine — 13 glyphs
    skeleton.js           centerline-offset engine (LeonSans/METAFONT) — 13 glyphs
  effects/
    procedural.js         perlin displace, catmull resample, simplify, voronoi, L-system, SDF, jitter
    transforms.js         15 Illustrator warps + 5 distorts (warpjs) + affine
    raster.js             halftone dots, ASCII cells, shatter cells
    morph.js              flubber letter-to-letter interpolation
    glyphsOps.js          hatch fill, offset curve, round corners (svg-path-commander)
    filters.jsx           SVG <filter> defs registry (weight/roughen/gooey/neon…)
  controls/
    ScrubInput.jsx        drag-to-nudge numeric input
    XYPad.jsx             2D puck — two axes at once
    AnimateAxis.jsx       play/pause sin-wave loop of one param
    ChipsRow.jsx          character-set filter chips
    EffectStack.jsx       FX preset toggles
    TransformPanel.jsx    affine rotate/scale/skew rows
    AnatomyOverlay.jsx    x-height/cap/asc/base/desc guide lines over the specimen
pages/ParametricTypeLab.jsx   the 864-line composition that wires it all
```

The five `lab/` core modules are **pure and framework-free** (no React) — they
port almost verbatim. The controls are React and reference the source app's own
`components/atoms/{Button,Slider,Input}` + `components/molecules/{Dropdown,
LabeledControl,SegmentedToggle}` — those must be **rewired to
`@kolkrabbi/kol-component`** on port.

## 2. The anatomy ontology (`data.js` → `ANATOMY`)

The conceptual vocabulary. Every entry is `{ type, desc }` where `type ∈
{metric, part, prop}`:

- **metric** — baseline, xHeight, capHeight, ascender, descender, overshoot.
- **part** — stem, bowl, counter, shoulder, arch, crossbar, terminal, tittle.
- **prop** — contrast, stress, aperture, superness.

`RELATIONSHIPS` maps each param to the glyphs it governs (e.g. `oWidth →
[o,c,e]`, `stemWidth → every stem stroke`) — drives the "which letters does this
affect" highlighting in the UI.

## 3. Parameters (`PARAM_DEFS`)

~30 params in 5 groups (`PARAM_GROUPS = ['metrics','weights','expressive',
'effects','resolution']`). Each: `{ def, min, max, group, label, step? }`.

| group | params |
|---|---|
| metrics | xHeight, capHeight, ascender, descender, overshoot |
| weights | stemWidth, oWidth, bowlWidth, hairWidth |
| expressive | contrast, aperture, archHeight, shoulder, superness, spacing, serif, jut |
| effects | roughen, noiseFreq, noiseSeed, weightFx, warpBend, warpDh, warpDv |
| resolution | flatness, simplify, segments, perlinAmt, perlinFreq |

## 4. The parameter resolver (the clever part)

`resolveParams(paramConfigs, t)` and `resolveParamsForGlyph(paramConfigs, t, i,
count)`. Each param has a **mode**: `'number'` (literal value) or `'expr'` (a
**mathjs expression string**). Expressions can cross-reference other params and
time, so a user writes `stemWidth: 18 + sin(t * pi) * 6` or (per-glyph)
`scale: 1 + sin(i / count * pi) * 0.3`.

- Evaluated with **mathjs** `math.evaluate(expr, scope)`.
- Scope: `{ t, i, count, pi, e, ...resolvedParams, ...envelopes }`.
- **4-pass** resolution so expressions referring to other expressions converge.
- `envelopes` = `{ adsr, smooth, tri, saw, pulse, bounce, srqf }` — LFO/envelope
  shaping functions injected into every expression scope.
- Final clamp to `[def.min*0.5, def.max*1.5]` (soft over-range headroom).

This expression engine is the single most important thing to preserve — it is
what makes the tool a *lab* rather than a slider box.

## 5. Math core (`math.js`, pure)

- **`superellipse(cx, cy, a, b, n, count)`** — `|x/a|^n + |y/b|^n = 1`. `n=2`
  ellipse, `n→∞` rectangle, `n<1` astroid/pinched. The `superness` param maps
  `[0.1..1.5] → n [0.6..6]` (`n = 2 * max(0.1, superness) * 2`). This is the
  geometric heart of every bowl.
- **`catmullRomPath` / `catmullRomClosedPath(points, tension)`** — smooth SVG
  paths through point lists (tension 0 = uniform Catmull-Rom).
- **`seededRandom(seed, salt)` / `rng(seed)`** — deterministic mulberry32-style
  uniform `[0,1)`.
- **`perlin2(x, y, seed)`** — Ken Perlin reference 2D noise, seedable permutation
  (cached), returns ~`[-1,1]`.
- **`resampleEven`, `normalAt`, `polylineToPath`, `clamp/lerp/smoothstep/TAU`.**

## 6. Engines

Registry `ENGINES = { classic, skeleton }` + `renderGlyph(engineName,
glyphName, params)`. Adding a key here auto-adds it to the engine dropdown. Every
glyph renderer returns `{ width, paths: [{ d, part, fillRule? }] }` where `part`
is an anatomy tag (bowl/stem/arch/crossbar/serif/tittle) used for per-part color
and the anatomy overlay. `GLYPH_ORDER = [o,l,i,d,b,p,q,c,e,n,h,m,t]` (13 glyphs).

- **`classic`** — outline-contour. Bowls = outer superellipse minus inner
  superellipse (`fillRule: 'evenodd'`); stems/crossbars = rectangles; arches
  (n,m,h) = hand-built quadratic-Bézier path strings; serifs via `serifFoot`.
  `c/e` use SVG arc commands with an aperture gap. Horizontal thins via explicit
  `hairWidth` (falls back to `stemWidth * (1 - contrast)`).
- **`skeleton`** — LeonSans/METAFONT centerline model. Each glyph is a centerline
  polyline + a thickness profile; `strokeOutline` offsets the centerline by
  ±half-thickness along per-point normals and closes with Catmull-Rom. Bowls =
  `bowlRing` (offset superellipse). Surfaces per-stroke variable thickness and
  smoother outlines than classic.

`PRESETS` (Neutral, Didone, Geometric, Humanist, Heavy, Spindly, Tall, Square,
Rounded) are partial param overrides applied over defaults.

## 7. Effects pipeline (applied to the rendered path `d` strings)

Ordered, composable, each `(d, params) → d` unless noted:

- **procedural.js** — `perlinDisplace`, `catmullResample` (flatness),
  `simplifyPath` (simplify-js), `voronoiShatter` (d3-delaunay), `lSystemBranches`,
  `sdfThreshold`, `jitter`.
- **transforms.js** — `WARPS` (15 Illustrator-style warps) + `DISTORTS` (5) via
  **warpjs** (flattens curves then per-point displaces), plus `affineTransform`
  (rotate/scale/skew/translate). Exposes `WARP_OPTIONS` for the dropdown and
  `chainTransforms(d, ops)`.
- **raster.js** — rasterizes the glyph to an offscreen canvas, samples a grid,
  emits SVG: `halftoneDots` (→ `<circle>` grid), `asciiCells` (→ `<text>` grid,
  ramp `" .,:;i1tfLCG08@"`), `shatterCells`.
- **morph.js** — `morphInterpolator` / `morphAt(dA, dB, t)` via **flubber** —
  morph the focus glyph toward a chosen target glyph.
- **glyphsOps.js** — `hatchLines`, `scaleOffset`, `roundCorners`, `hatchPattern`
  via **svg-path-commander**.
- **filters.jsx** — SVG `<filter>` `<defs>` registry (`FX_PRESETS`: none, weight,
  roughen, gooey, neon…); apply with `filter="url(#fx-…)"` on a `<g>`. `FilterDefs`
  renders the defs block.

## 8. Controls (React → rewire to kol-component on port)

`ScrubInput` (drag-label nudge), `XYPad` (2-axis puck, `size` px, inverts Y so
top = high), `AnimateAxis` (sin-loop a param), `ChipsRow` (charset filter chips),
`EffectStack` (FX radio toggles), `TransformPanel` (affine rows), `AnatomyOverlay`
(SVG guide lines: asc/cap/x/base/desc over the big specimen).

Good news for the DS port: the controls already use **DS-native classes** —
`kol-helper-10`, `text-meta`, `border-fg-16`, `bg-fg-04`, `bg-fg-96`, `rounded`.
They will drop in with minimal restyling.

## 9. Composition (`ParametricTypeLab.jsx`, 864 lines)

Wires everything: left param panel (tabbed Metrics / Relations / Transform via
`ParamRow` + `LabeledControl`), a glyph grid rendering `renderGlyph` per letter,
a big focus-specimen with `AnatomyOverlay` + `FilterDefs`, the XY pad, engine +
preset + effect pickers, and the per-glyph FX expression pipeline (morph → raster
→ transforms → filters). This is the piece to rebuild last and most carefully.

## 10. External dependencies (the reason to defer)

`mathjs` (expression engine — **required**), and per-effect optional libs:
`warpjs`, `svg-path-commander`, `flubber`, `simplify-js`, `d3-delaunay`,
`bezier-js`, plus `opentype.js` v2. On the eventual build these become foundry
dependencies — recommend **`mathjs` as a hard dep** and the effect libs as
**optional peers** so a consumer only pulling the engines/controls doesn't drag
in the whole geometry stack. **No dep changes were made this session.**

## 11. KOL-conform checklist for the eventual build

- [ ] **Fix the one casing violation:** `AnatomyOverlay.jsx` sets inline
  `textTransform: 'uppercase'` on its labels — violates the KOL no-auto-casing
  rule. Author the labels lowercase-as-shown at source and drop the transform.
- [ ] Rewire control imports from the app's `components/{atoms,molecules}` to
  `@kolkrabbi/kol-component` (Button, Slider, Input, Dropdown, LabeledControl,
  SegmentedToggle) — never re-import primitives into foundry.
- [ ] Any CSS → `packages/theme/kol-components-foundry.css` (foundry ships JS only).
- [ ] Radius ≤ 4px; color/type inline via tokens; `kol-*` prefix on any new class.
- [ ] Membership: this is the crown-jewel foundry component — it synthesizes a
  font. It belongs here. Add to `COMPONENTS.md` when built.
- [ ] Scope estimate: a dedicated multi-hour session, not a bucket item.
