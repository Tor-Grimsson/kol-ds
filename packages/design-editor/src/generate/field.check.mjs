/* plan 52 § 1.2 — the field kit's check. `node src/generate/field.check.mjs`; throws on the first miss.
 * Each source is sampled at 5 points against its formula (1e-6), and Steps = 4 must yield exactly 4
 * distinct values over a 100 × 100 sample. */
import assert from 'node:assert/strict'
import { makeField, makeMask } from './field.js'

const close = (a, b, msg) => assert.ok(Math.abs(a - b) < 1e-6, `${msg}: ${a} ≠ ${b}`)
const clamp01 = (x) => Math.max(0, Math.min(1, x))
const PTS = [[0.5, 0.5], [0, 0], [1, 1], [0.25, 0.75], [0.9, 0.1]]

const cases = {
  linear: [{ fKind: 'linear', fAngle: 0 }, (u) => clamp01(u)],
  radial: [{ fKind: 'radial', fX: 0.5, fY: 0.5, fRx: 0.5 }, (u, v) => clamp01(1 - Math.hypot(u - 0.5, v - 0.5) / 0.5)],
  ellipse: [{ fKind: 'ellipse', fX: 0.5, fY: 0.5, fRx: 0.4, fRy: 0.2 }, (u, v) => clamp01(1 - Math.hypot((u - 0.5) / 0.4, (v - 0.5) / 0.2))],
  diamond: [{ fKind: 'diamond', fX: 0.5, fY: 0.5, fRx: 0.5, fRy: 0.5 }, (u, v) => clamp01(1 - Math.abs(u - 0.5) / 0.5 - Math.abs(v - 0.5) / 0.5)],
  blob: [{ fKind: 'blob', fX: 0.5, fY: 0.5, fRx: 0.3, fRy: 0.3 }, (u, v) => Math.exp(-(((u - 0.5) / 0.3) ** 2 + ((v - 0.5) / 0.3) ** 2) * 2)],
  sine: [{ fKind: 'sine', fAngle: 0, fFreq: 2 }, (u) => 0.5 + 0.5 * Math.sin((u - 0.5) * 2 * 2 * Math.PI)],
  ridge: [{ fKind: 'ridge', fAngle: 90, fFreq: 3 }, (u, v) => Math.abs(Math.sin((v - 0.5) * 3 * Math.PI))],
  waves: [{ fKind: 'waves', fFreq: 2 }, (u, v) => 0.5 + 0.5 * Math.sin(u * 2 * 2 * Math.PI) * Math.sin(v * 2 * 2 * Math.PI)],
  flat: [{ fKind: 'flat', fValue: 0.3 }, () => 0.3],
  conic: [{ fKind: 'conic', fX: 0.5, fY: 0.5, fAngle: 0 }, (u, v) => ((((Math.atan2(v - 0.5, u - 0.5)) / (2 * Math.PI)) % 1) + 1) % 1],
  lights: [{ fKind: 'lights', fLightN: 1, fL1x: 0.4, fL1y: 0.6, fL1r: 0.3, fL1i: 0.8 }, (u, v) => clamp01(0.8 * Math.exp(-((Math.hypot(u - 0.4, v - 0.6) / 0.3) ** 2) * 2))],
}
for (const [name, [p, f]] of Object.entries(cases)) {
  const field = makeField(p, 1)
  for (const [u, v] of PTS) close(field(u, v), f(u, v), `${name} at ${u},${v}`)
}
/* noise: deterministic per seed, in [0, 1], and seeds differ */
const n1 = makeField({ fKind: 'noise', fFreq: 3, fSeed: 4 }), n2 = makeField({ fKind: 'noise', fFreq: 3, fSeed: 5 })
for (const [u, v] of PTS) { close(n1(u, v), n1(u, v), 'noise repeat'); assert.ok(n1(u, v) >= 0 && n1(u, v) <= 1) }
assert.ok(PTS.some(([u, v]) => Math.abs(n1(u, v) - n2(u, v)) > 1e-3), 'noise seeds differ')

/* steps = 4 → exactly 4 values */
const st = makeField({ fKind: 'linear', fAngle: 0, fSteps: 4 })
const seen = new Set()
for (let i = 0; i < 100; i++) for (let j = 0; j < 100; j++) seen.add(st(i / 99, j / 99))
assert.equal(seen.size, 4, `steps 4 gave ${seen.size} values`)

/* masks: circle inside / outside, aspect-true */
const circ = makeMask({ mKind: 'circle' }, 2)
assert.ok(circ(0.5, 0.5) && !circ(0.05, 0.5) && circ(0.5, 0.02), 'circle mask (aspect 2)')
const rect = makeMask({ mKind: 'rect', mX: 0.75, mW: 0.5 }, 1)
assert.ok(rect(0.6, 0.5) && !rect(0.4, 0.5), 'rect mask')

/* lights: 3 lights over a 1456 × 1056 line screen in ≤ 16 ms */
const { renderGenerate, paramsFor } = await import('./index.js')
const lp = { ...paramsFor('lineScreen', 'eclipse'), fKind: 'lights', fLightN: 3, mKind: 'none' }
renderGenerate(lp, 1456, 1056)
const t0 = performance.now(); for (let i = 0; i < 5; i++) renderGenerate(lp, 1456, 1056)
const ms = (performance.now() - t0) / 5
assert.ok(ms <= 16, `3 lights took ${ms.toFixed(1)} ms`)
console.log(`lights: 3 lights ${ms.toFixed(1)} ms`)
console.log('field.check: ok')
