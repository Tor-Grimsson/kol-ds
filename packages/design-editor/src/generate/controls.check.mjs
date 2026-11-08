/* plan 53 § 1.3 — randomness, smoothing, round ends. `node src/generate/controls.check.mjs`.
 * Zero is identity (byte-identical path data), one seed is one picture, two seeds are two. */
import assert from 'node:assert/strict'
import { renderGenerate, paramsFor } from './index.js'
import { marksD } from './geom.js'

const d = (p, w = 800, h = 1000) => marksD(renderGenerate(p, w, h))
const dots = paramsFor('dotScreen', 'umbra'), lines = paramsFor('lineScreen', 'eclipse')
assert.equal(d({ ...dots, jPos: 0, jSize: 0, jDrop: 0 }), d(dots), 'jitter 0 is identity')
const j = { ...dots, jPos: 4, jSize: 0.3, jDrop: 0.2, jSeed: 5 }
assert.equal(d(j), d(j), 'one seed, one picture')
assert.notEqual(d(j), d({ ...j, jSeed: 6 }), 'two seeds, two pictures')
assert.equal(d({ ...lines, smooth: 0, round: false }), d(lines), 'smoothing 0 is identity')
assert.notEqual(d({ ...lines, smooth: 3 }), d(lines), 'smoothing moves the widths')
/* § 1.5 — the floor keeps a dot in every grid cell (interference: 60 × 78) */
const inter = paramsFor('dotScreen', 'interference')
assert.equal(renderGenerate(inter, 1056, 1456).circles.length, 60 * 78, 'floor: a dot in every cell')
console.log('controls.check: ok')
