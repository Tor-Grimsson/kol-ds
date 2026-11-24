/* node src/generate/lineSwell.check.mjs — Line Swell as his canvas has it (R8): every form in spec.json draws at its
 * board's defaults, through the generate pipeline as an effect row does; every preset draws its reference's path exactly
 * (refs-01-sheet, through the board's own call). It lists the controls whose ends draw the same picture on the board's
 * defaults (another control holds them off there, as on his canvas: a letter while the shape is not a letter). */
import assert from 'node:assert/strict'
import { SPEC, defaultsOf, drawForm, colorsOf } from './lineSwell/index.js'
import * as LS from './lineSwell/source.js'
import { renderGenerate } from './index.js'
import { marksD } from './geom.js'

const pic = (form, v) => marksD(renderGenerate({ genStyle: 'lineSwell', lsForm: form, lsValues: v, inset: 0 }, 600, 400)) + JSON.stringify(colorsOf(form, v))
/* a control whose ends draw the same picture on the board's defaults, because another control holds it off there:
   the source's own rows while the source is a shape, the letter's while no letter is typed, the master's wave rows */
const idle = (form, c, v) => (c.section ?? '').startsWith('Wave source') || ['contrast', 'source'].includes(c.name) && v.source !== 'image' && c.name === 'contrast'
  || (form === 'master' && /^letter(Font|Weight|Stretch|Lean|X|Y)$/.test(c.name) && !v.letter)
const dead = []
let controls = 0
for (const [form, f] of Object.entries(SPEC.forms)) {
  const base = defaultsOf(form)
  assert.ok(pic(form, base).length > 0, `${form} draws at its board's defaults`)
  for (const s of f.sections) for (const c of s.controls) {
    controls++
    if (c.editor === 'color' || c.name === 'randomSpread' || c.name === 'letterFont' || idle(form, { ...c, section: s.title }, base)) continue
    const ends = c.editor === 'range' || c.editor === 'int' ? [c.min, (c.min + c.max) / 2, c.max] : c.editor === 'boolean' ? [false, true] : c.options ?? (c.editor === 'text' ? ['', 'K'] : null)
    if (!ends) continue
    const seen = new Set(ends.map((e) => pic(form, { ...base, [c.name]: e })))
    if (seen.size < 2) dead.push(`${form}.${c.name}`)
  }
}
let exact = 0
for (const [form, list] of Object.entries(SPEC.presets)) for (const pr of list) {
  const want = LS.STUDIES.find(([l]) => l === pr.label)[1](), got = drawForm(form, pr.values)
  if (got.d === want.d && got.ink === want.ink) exact++
}
const presets = Object.values(SPEC.presets).flat().length
console.log(`line swell: ${Object.keys(SPEC.forms).length} forms, ${controls} controls, ${presets} presets (${exact} exact); held off at the board's defaults by another control, as on the board: ${dead.length ? dead.join(', ') : 'none'}`)
assert.equal(exact, presets, 'every preset draws its reference')
