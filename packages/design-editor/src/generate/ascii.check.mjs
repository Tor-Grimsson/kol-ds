/* plan 53 § 2.1 — the ASCII style's check. `node src/generate/ascii.check.mjs`.
 * Ramp order (brighter never picks an earlier glyph), vector only (no <text>), 120 × 160 in ≤ 100 ms. */
import assert from 'node:assert/strict'
import { renderGenerate, paramsFor } from './index.js'
import { marksD } from './geom.js'
import { pickChar, RAMPS } from './styles/ascii.js'
import { registerAll } from '../../scripts/generate-fonts.mjs'

const ramp = [...RAMPS.classic]
let last = -1
for (let i = 0; i <= 1000; i++) {
  const idx = ramp.indexOf(pickChar(ramp, i / 1000))
  assert.ok(idx >= last, `ramp order broke at f=${i / 1000}`)
  last = idx
}
registerAll()
const p = { ...paramsFor('ascii'), font: 'rg-Compact-700', fKind: 'radial', cols: 120, cell: 1.6 }
const W = 1200, H = 160 * (W / 120) * 1.6
renderGenerate(p, W, H)
const t0 = performance.now(); const m = renderGenerate(p, W, H); const ms = performance.now() - t0
assert.ok(!marksD(m).includes('<text'), 'vector only')
assert.ok(ms <= 100, `120 × 160 took ${ms.toFixed(0)} ms`)
console.log(`ascii.check: ok — 120 × 160 in ${ms.toFixed(0)} ms`)
