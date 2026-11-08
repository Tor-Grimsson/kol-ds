/* plan 53 § 4.2 — stipple keeps its spacing (no two dots closer than 0.7 × Spacing), mosaic is vector. */
import assert from 'node:assert/strict'
import { renderGenerate, paramsFor } from './index.js'
import { marksD } from './geom.js'

const p = paramsFor('stipple', 'stipple-glow')
const m = renderGenerate(p, 800, 1000)
const c = m.circles, sp = p.spacing
let worst = Infinity
const cell = new Map()
for (const [x, y] of c) { const k = `${Math.floor(x / sp)},${Math.floor(y / sp)}`; (cell.get(k) ?? cell.set(k, []).get(k)).push([x, y]) }
for (const [x, y] of c) {
  const gx = Math.floor(x / sp), gy = Math.floor(y / sp)
  for (let j = gy - 1; j <= gy + 1; j++) for (let i = gx - 1; i <= gx + 1; i++) for (const [a, b] of cell.get(`${i},${j}`) ?? []) {
    if (a === x && b === y) continue
    worst = Math.min(worst, Math.hypot(a - x, b - y))
  }
}
assert.ok(c.length > 500, `stipple drew ${c.length}`)
assert.ok(worst >= 0.7 * sp, `two dots ${worst.toFixed(2)} px apart (spacing ${sp})`)
const mo = renderGenerate(paramsFor('mosaic', 'mosaic-hex'), 800, 1000)
assert.ok(mo.polys.length > 100 && !marksD(mo).includes('<image'), 'mosaic is vector')
console.log(`stipple.check: ok — ${c.length} dots, closest ${worst.toFixed(1)} px of ${sp}; mosaic ${mo.polys.length} tiles`)
