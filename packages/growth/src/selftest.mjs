// node src/selftest.mjs — the engine with no density field (no DOM): it grows to the cap, a seed repeats, poke moves nodes.
import assert from 'node:assert/strict'
import { Growth, mulberry32 } from './index.js'

const grow = (seed) => {
  const g = new Growth({ w: 400, h: 300, rand: mulberry32(seed), cap: 600 })
  g.setParams({ minGap: 6, maxGap: 24, contrast: 1.4, growth: 8 })
  g.seed()
  for (let i = 0; i < 400 && g.x.length < g.cap; i++) g.step()
  return g
}
const a = grow(7), b = grow(7)
assert.ok(a.x.length >= a.cap - 8, `grows to the cap (${a.x.length}/${a.cap})`)
assert.deepEqual(a.x, b.x, 'same seed, same line')
assert.ok(a.x.every((v, i) => v >= 2 && v <= 398 && a.y[i] >= 2 && a.y[i] <= 298), 'held inside the frame')
const before = a.x.slice()
a.poke(a.x[0], a.y[0] + 1, true)
assert.notDeepEqual(a.x, before, 'poke moves the line')
assert.match(a.pathD(400, 300), /^M.*Z$/, 'one closed path')
/* settling (`settle`): every node's heat fades — a grown line goes cold and a step then moves nothing; a poke re-heats it */
const r = new Growth({ w: 400, h: 300, rand: mulberry32(5), cap: 1500 })
r.setParams({ minGap: 6, maxGap: 24, contrast: 1.4, growth: 2.5, bleed: 30, settle: 40 })
r.seed()
for (let i = 0; i < 20000 && (!r.full || r.hot > 0); i++) r.step()
assert.ok(r.full && r.hot === 0, `a grown line goes cold (full ${r.full}, hot ${r.hot})`)
const rx = r.x.slice(), ids = r.id.slice()
r.step()
assert.deepEqual(r.x, rx, 'a cold line does not move')
r.poke(r.x[0], r.y[0] + 1)
assert.ok(r.hot > 0, 'a poke re-heats it')
for (let i = 0; i < 20000 && r.hot > 0; i++) r.step()
assert.ok(r.hot === 0 && r.id.filter((v) => ids.includes(v)).length > ids.length * 0.9, 'it cools again and keeps its nodes')
/* with a bleed the line may leave the frame, and stays inside the bled frame */
const c = new Growth({ w: 200, h: 150, rand: mulberry32(3), cap: 900 })
c.setParams({ minGap: 6, maxGap: 24, contrast: 1.4, growth: 8, bleed: 30 })
c.seed()
for (let i = 0; i < 600 && c.x.length < c.cap; i++) c.step()
assert.ok(c.x.every((v, i) => v >= -30 && v <= 230 && c.y[i] >= -30 && c.y[i] <= 180), 'held inside the bled frame')
console.log('kol-growth selftest ok')
