# @kolkrabbi/kol-tuner

The form tuner: a mark built from a few measures (System), and a form rebuilt from circles and lines with every radius
pulled onto one ladder (the Tuner). Plain ESM, no React, no dependencies. Engine tier (ARCHITECTURE §3). It is the
structure half of kol-branding's Line Swell canvas, carried verbatim and split by tool; the line effects are not here.

```js
import { system, systemDrag, systemSeeds, tuner, tunerPresets, grid, harmonies } from '@kolkrabbi/kol-tuner'

const v = system({ harmony: 'golden', y: 0.302, x: 0.058, steps: 4 })   // v.d the form, v.guides, v.dims, v.dimLabels, v.handlePts
const y = systemDrag({}, 'y', px, py)          // the value under a dragged handle, in board units from the centre
const rolls = systemSeeds({ join: 'union' })   // 24 rolls, each a whole board
const t = tuner({ preset: 'golden', read: 'auto' }, img)   // img: an Image, or null for the built-in crescent; t.d, t.orig, t.circles, t.comb0..2, t.labels, t.stats
```

| export | does |
|---|---|
| `system` · `systemDrag` · `systemSeeds` · `systemMeasures` | a mark from measures on the 1200 x 800 board, the handle math, the sheet of 24 |
| `construct` · `constructSeeds` · `recipeNum` | shapes on a harmonic grid, and the recipe language (`+ circle 0 0.3 0.2; - bar …`) |
| `tuner` · `tunerVectors` · `tunerPresets` · `tunerDefaults` | read (vectors or a trace), fit, tune, corners, Bezier with curve harmony, draw; whatever is asked, a form or a line saying why not |
| `grid` · `gridScore` · `keylines` · `GRIDS` | the guides; `keylines` is geometry only (draw kol-component's `KeylineGuide` over it) |
| `harmonies` · `HARMONY` · `divisions` · `systemGrow` | the ratios and scales |

Output is geometry only: SVG path strings, labels and numbers, never a colour. The Tuner draws on a canvas to trace an
image or a letter and reads an SVG's curves from the document, so those need a browser; System, Construct and the
built-in form run anywhere.

`pnpm --filter @kolkrabbi/kol-tuner test` runs the canvas's checks: the two node scripts, a 50-set parity against the
reference engine, and the four Tuner pages in the installed Chrome (Playwright from the workspace root). Proved in `apps/tuner`.
