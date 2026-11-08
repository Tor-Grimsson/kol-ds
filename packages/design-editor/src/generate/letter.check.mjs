/* plan 52 § 4.1 — the letter mask's check. `node src/generate/letter.check.mjs`; throws on a miss.
 * Loads the real Right Grotesk Black, fits its "A" into the art box the way the editor does (rings.js
 * fitRings), renders Line screen and Dot screen inside it, and asserts: no mark's centre lies outside the
 * letter, and a letter change re-renders in ≤ 16 ms. */
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import opentype from 'opentype.js'
import { renderGenerate, paramsFor, artBox } from './index.js'
import { flattenD, ringsBounds } from './path.js'
import { inRings } from './field.js'

const font = opentype.parse(readFileSync(new URL('../../scripts/fixtures/PPRightGrotesk-Black.ttf', import.meta.url)).buffer)
const W = 1080, H = 1350

/* the editor's fit (rings.js fitRings), here so the check runs without React */
function fit(rings, gen, f = 0.9) {
  const b = artBox(gen, W, H), g = ringsBounds(rings)
  const s = Math.min((b.w * f) / g.w, (b.h * f) / g.h)
  return rings.map((r) => r.map(([x, y]) => [(b.w / 2 + (x - g.x - g.w / 2) * s) / b.w, (b.h / 2 + (y - g.y - g.h / 2) * s) / b.h]))
}

for (const [style, preset, ch] of [['lineScreen', 'eclipse', 'A'], ['dotScreen', 'umbra', 'S'], ['lineScreen', 'confluence', 'O']]) {
  const p = { ...paramsFor(style, preset), mKind: 'letter', mChar: ch, inset: 0 }
  const rings = fit(flattenD(font.getPath(ch, 0, 0, 1000).toPathData(2), 8), p)
  const m = renderGenerate(p, W, H, { rings })
  const b = artBox(p, W, H)
  let outside = 0, total = 0
  const test = (x, y) => { total++; if (!inRings(rings, (x - b.x) / b.w, (y - b.y) / b.h)) outside++ }
  for (const pl of m.polys) test(pl.reduce((a, q) => a + q[0], 0) / pl.length, pl.reduce((a, q) => a + q[1], 0) / pl.length)
  for (const [cx, cy] of m.circles) test(cx, cy)
  assert.ok(total > 0, `${preset}/${ch}: drew nothing`)
  /* tested against the exact outline; the renderer uses the 512² lookup, so this also proves the grid */
  assert.equal(outside, 0, `${preset}/${ch}: ${outside} of ${total} marks outside the letter`)
  /* the letter change: outline → fit → render, the median of 7 (the first run pays the JIT) */
  const times = []
  for (const c of 'BCDEFGH') {
    const t0 = performance.now()
    renderGenerate({ ...p, mChar: c }, W, H, { rings: fit(flattenD(font.getPath(c, 0, 0, 1000).toPathData(2), 8), p) })
    times.push(performance.now() - t0)
  }
  const ms = times.sort((a, c) => a - c)[3]
  assert.ok(ms <= 16, `${preset}: letter change took ${ms.toFixed(1)} ms`)
  console.log(`${preset} on ${ch}: ${total} marks, 0 outside, letter change ${ms.toFixed(1)} ms`)
}
console.log('letter.check: ok')
