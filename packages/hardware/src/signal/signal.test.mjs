// The signal engine's check: `node src/signal/signal.test.mjs`
import assert from 'node:assert/strict'
import { compileExpression, isExpression, fitRange, envelopeAt, createEnvelope, stageSeconds, EXPRESSION_SECTIONS } from './index.js'

// helpers span [min, max] — monitor's semantics; min 0 is mirror's / the editor's
const w = compileExpression('wave(t)')
assert.ok(w.ok)
assert.equal(Math.round(w.fn(0, 0, 0, 100)), 50)
assert.equal(Math.round(w.fn(0, 0, -100, 100)), 0)
assert.equal(compileExpression('pulse(0.25)').fn(0, 0, -100, 100), 100)
assert.equal(compileExpression('pulse(0.75)').fn(0, 0, -100, 100), -100)
assert.equal(compileExpression('saw(-0.25)').fn(0, 0, 0, 100), 75)   // wraps, never negative
// every shipped example compiles
for (const [code] of EXPRESSION_SECTIONS.examples.rows) assert.ok(compileExpression(code).ok, code)
// the gates
for (const bad of ['sin.constructor("return 1")()', 'window.x', 'Math.random()', 'fetch(1)', 'a+1', '"x"'])
  assert.equal(compileExpression(bad).ok, false, bad)
// bus names are allowed only when declared
const b = compileExpression('a*2+b', { bus: ['a', 'b'] })
assert.ok(b.ok)
assert.equal(b.fn(0, 0, 0, 100, { a: 3, b: 1 }), 7)
// never non-finite: last good value
const inf = compileExpression('1/(t-1)')
assert.equal(inf.fn(0), -1)
assert.equal(inf.fn(1), -1)
assert.ok(isExpression('wave(t)') && !isExpression('1e3') && !isExpression('42'))
assert.deepEqual(fitRange('wave(t)', { sec: 10 }), { min: -10, max: 110 })

// ADSR
assert.equal(stageSeconds(0), 0.005)
assert.equal(stageSeconds(100), 2)
const p = { attack: 50, decay: 50, sustain: 40, release: 50 }
const a = stageSeconds(50)
assert.equal(Math.round(envelopeAt(a, p)), 100)                       // top of attack
assert.equal(Math.round(envelopeAt(a * 2 + 0.5, p)), 40)              // holding sustain
assert.equal(envelopeAt(100, p), 0)                                   // long after release
const env = createEnvelope()
let lvl = 0
for (let i = 0; i < 600; i++) lvl = env.step(1 / 60, { gate: true }, p)
assert.equal(Math.round(lvl), 40)
assert.equal(env.stage, 'sustain')
for (let i = 0; i < 600; i++) lvl = env.step(1 / 60, { gate: false }, p)
assert.equal(lvl, 0)
assert.equal(env.stage, 'idle')

console.log('signal: ok')
