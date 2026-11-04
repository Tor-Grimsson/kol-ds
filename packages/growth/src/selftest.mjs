// node src/selftest.mjs — the engine with no density field (no DOM): it grows to the cap, a seed repeats, poke moves nodes.
import assert from 'node:assert/strict'
import { Growth, mulberry32, outline } from './index.js'

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
/* a ring seed (GrowthLineSeedOutline): a solid square's 0.5 iso-line, resampled to half the local gap and inset inward */
const sq = { cols: 40, rows: 30, data: new Float32Array(1200) }
for (let j = 8; j < 22; j++) for (let i = 10; i < 30; i++) sq.data[j * 40 + i] = 1
const edge = outline(sq)
assert.ok(edge && edge.length > 40, 'the square has an outline')
const o = new Growth({ w: 400, h: 300, density: sq, rand: mulberry32(1) })
o.setParams({ minGap: 6, maxGap: 24 })
o.seed({ points: edge, inset: 4 })
const on = o.x.length, steps = o.x.map((v, i) => Math.hypot(o.x[(i + 1) % on] - v, o.y[(i + 1) % on] - o.y[i]))
assert.ok(on > 50 && Math.max(...steps) <= 12.5, `resampled to half the gap (${on} nodes, longest ${Math.max(...steps).toFixed(1)})`)
assert.ok(o.x.every((v, i) => v > 100 && v < 300 && o.y[i] > 80 && o.y[i] < 220), 'inset inside the square')
const px = new Growth({ w: 400, h: 300, density: sq })
px.setParams({ minGap: 6, maxGap: 24 })
px.seed({ points: edge.map(([a, b]) => [a * 400, b * 300]), inset: 4 })
assert.equal(px.x.length, on, 'sim px and 0..1 seed the same ring')
for (let i = 0; i < 300; i++) o.step()
assert.ok(o.x.length > on, 'an outline-seeded line grows')
console.log('kol-growth selftest ok')
