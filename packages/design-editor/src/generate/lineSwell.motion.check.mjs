/* node src/generate/lineSwell.motion.check.mjs [folder] — Line Swell's motion in Labs (R8.4). Every Motion and Wave shapes
 * board, with play on at its defaults, draws what HIS live engine draws for the same t (line-swell.js and wave-organism.js
 * from the canvas's `project/` folder, default `_tmp/2026-11-19-line-swell/live-motion/project`), moves, and closes (u 1 is
 * u 0); with play off it draws its frame whatever u is. Every line effect, with its Motion on, moves and closes. */
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import vm from 'node:vm'
import { fileURLToPath } from 'node:url'
import { SPEC, drawForm } from './lineSwell/index.js'
import { boardAt, boardT, spanOf } from './lineSwell/labs.js'

const here = path.dirname(fileURLToPath(import.meta.url))
const dir = path.resolve(process.argv[2] ?? path.join(here, '../../../../_tmp/2026-11-19-line-swell/live-motion/project'))
const win = {}
vm.runInNewContext(fs.readFileSync(path.join(dir, 'line-swell.js'), 'utf8') + ';' + fs.readFileSync(path.join(dir, 'wave-organism.js'), 'utf8'), { window: win, Math, isFinite, console })

const defaults = (spec) => Object.fromEntries(spec.sections.flatMap((s) => s.controls.map((c) => [c.name, c.default])))
let n = 0
for (const [id, spec] of Object.entries(SPEC.loops)) {
  const v = { ...defaults(spec), play: true }
  /* his board's own call; Keys cuts its bars to a shape drawn on a browser canvas, so it is compared in Chrome only */
  const live = (t, q = v) => {
    const { fn, engine, fit } = spec.call
    const p = fit ? { ...q, width: (q.width / 1200) * 1920, height: (q.height / 800) * 1080 } : q
    return engine === 'organism' ? win.WaveOrganism[fn](p, t) : win.LineSwell[fn](p, t)
  }
  if (spec.call.fn !== 'keys') for (const u of [0, 0.25, 0.5]) assert.equal(boardAt(spec, v, boardT(spec, v, u)).d, live(boardT(spec, v, u)).d, `${id} draws his board at u ${u}`)
  const at = (u) => boardAt(spec, v, boardT(spec, v, u)).d
  assert.notEqual(at(0), at(0.3), `${id} moves`)
  assert.equal(at(1), at(0), `${id} closes`)
  const off = { ...defaults(spec), play: false }
  assert.equal(boardAt(spec, off, boardT(spec, off, 0.6)).d, boardAt(spec, off, off.frame || 0).d, `${id} holds its frame with play off`)
  console.log(`  ${id}: ${spec.call.fn === 'keys' ? 'drawn' : 'his board'}, moves, closes over ${spanOf(spec, v)} cycle(s) of ${v.loop} s`)
  n++
}
let fx = 0
for (const [form, f] of Object.entries(SPEC.forms)) {
  if (!f.motion || form === 'master') continue
  const kinds = f.motion.controls.find((c) => c.name === 'motion').options.filter((o) => o !== 'off')
  const v = { ...Object.fromEntries(f.sections.flatMap((s) => s.controls.map((c) => [c.name, c.default]))), motion: kinds[0], motionKind: 'swing', motionAmount: 0.3 }
  const at = (u) => { const o = drawForm(form, { ...v, motionT: u }); return [o.d, o.d2, o.dh, o.d3].join('|') }
  assert.notEqual(at(0), at(0.25), `${form} moves by ${kinds[0]}`)
  assert.equal(at(1), at(0), `${form} closes`)
  fx++
}
console.log(`line swell motion: ${n} boards draw his engines' picture, move and close; ${fx} line effects move by their Motion section`)
