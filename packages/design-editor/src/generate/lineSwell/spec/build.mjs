/* LINE SWELL'S SPEC (plan-2026-11-19-kolbox-whats-left R8.2): every board's own Tweaks panel, read out of its file.
 *
 *   node packages/design-editor/src/generate/lineSwell/spec/build.mjs [folder]
 *
 * [folder] holds his live canvas's `project/` files (default `_tmp/2026-11-19-line-swell/live/project`, read with the
 * Artifact tool from https://claude.ai/artifact/4Npm9zbKAg753Cz4TMPSKw). Writes `../spec.json`: per form its board, the
 * engine call the board makes in `renderVals`, its sections in order with their controls in order (editor, range, step,
 * unit, default, options, as `data-props` declares them), the controls left out and why; the presets, which are the
 * References page's redrawn marks (refs-01-sheet: each tile's values from the sheet's own source, turned into the
 * form's panel values and checked to draw the same path); the picker's tiles in his three groups; and, for Labs (R8.4),
 * each form's Motion section where its board has one, and the Motion and Wave shapes boards as loops: each with its
 * whole panel, the engine call its `renderVals` makes, its clock and its frame. */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import * as LS from '../source.js'

const here = path.dirname(fileURLToPath(import.meta.url))
const repo = path.resolve(here, '../../../../../..')
const dir = path.resolve(process.argv[2] ?? path.join(repo, '_tmp/2026-11-19-line-swell/live-motion/project'))

/* the forms the editor offers: the boards his tiles come from */
const BOARDS = [
  ['master', 'swell-00-master'], ['blinds', 'swell-02-blinds'],
  ['warp', 'fx-01-warp'], ['radial', 'fx-02-radial'], ['moire', 'fx-03-moire'], ['pinch', 'fx-04-pinch'],
  ['flow', 'fx-05-flow'], ['rotor', 'fx-06-rotor'], ['vortex', 'fx-07-vortex'],
]
/* what the editor's layer cannot do, so it is not drawn (said in the report) */
const LEFT_OUT = {
  section: { Motion: 'the layer does not animate here; motion is Labs (R8.4)' },
  control: {
    handles: 'the board\'s drag handles on its own picture; the editor has none',
    view: 'shows the source picture in place of the lines; the port reads the source as numbers and has no picture of it',
  },
}

const unq = (s) => s.replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&#39;/g, "'")
function readBoard(file) {
  const html = fs.readFileSync(path.join(dir, `${file}.dc.html`), 'utf8')
  const m = html.match(/data-props='([^']*)'/) ?? html.match(/data-props="([^"]*)"/)
  const props = JSON.parse(unq(m[1]))
  const title = html.match(/<title>([^<]*)<\/title>/)[1]
  const rv = html.slice(html.indexOf('renderVals()'))
  const call = rv.match(/(LineSwell|WaveOrganism)\.(\w+)\(([^)]*)\)/)
  const name = call[3].match(/'(\w+)'/)?.[1] ?? null
  /* a frame drawn at a fixed place (the landing page's) in place of the engine's `rot` */
  const rot = html.match(/<g transform="(translate\([^"]*\))">/)?.[1] ?? null
  /* the landing scales the body's width and height from the 1200 × 800 board to its own page (its `fit`) */
  const fit = /const fit = /.test(rv)
  return { props, title, rot, call: { fn: call[2], ...(call[1] === 'WaveOrganism' ? { engine: 'organism' } : {}), ...(name ? { name } : {}), ...(fit ? { fit: true } : {}) } }
}

const forms = {}
for (const [id, board] of BOARDS) {
  const { props, title, call } = readBoard(board)
  const sections = [], left = []
  let motion = null
  for (const [name, c] of Object.entries(props)) {
    if (name.startsWith('$')) continue
    /* Labs draws the Motion section where the board has it */
    if (c.section === 'Motion') { const { section: _m, ...r } = c; (motion ??= { at: sections.length, controls: [] }).controls.push({ name, ...r }) }
    const why = LEFT_OUT.section[c.section] ?? LEFT_OUT.control[name]
    if (why) { left.push({ name, section: c.section, why }); continue }
    let s = sections.find((x) => x.title === c.section)
    if (!s) sections.push(s = { title: c.section, controls: [] })
    const { section: _s, ...rest } = c
    s.controls.push({ name, ...rest })
  }
  forms[id] = { board, title, call, sections, left, ...(motion ? { motion } : {}) }
}
const defaultsOf = (id) => Object.fromEntries([
  ...forms[id].left.map((c) => [c.name, readBoard(forms[id].board).props[c.name].default]),
  ...forms[id].sections.flatMap((s) => s.controls.map((c) => [c.name, c.default])),
])

/* the master board's values that draw `sw(base, o)`: its controls are offsets on the base the preset names (size a
   factor, density the count's factor, the rest added), neutral where the reference says nothing */
const diff = (o, base, k) => (o[k] ?? base[k] ?? 0) - (base[k] ?? 0)
function masterValues(base, o = {}, variant = 0) {
  const b = { ...LS.MASTER[base], ...(variant ? LS.VARIANTS[base][variant - 1] : {}) }
  const v = { ...defaultsOf('master') }
  Object.assign(v, {
    random: 0, source: 'shape', preset: base, variant, effect: 1,
    shape: o.shape && o.shape !== 'letter' ? o.shape : 'preset', letter: o.shape === 'letter' ? o.letter : '',
    size: o.size != null ? o.size / b.size : 1, depth: diff(o, b, 'depth'), breakUp: diff(o, b, 'breakUp'), pattern: diff(o, b, 'pattern'),
    letterFont: '', letterWeight: 900, letterStretch: 1, letterLean: 0, letterX: 0, letterY: 0,
    levels: o.levels == null ? 'preset' : o.levels === 0 ? 'smooth' : String(o.levels), invert: false,
    density: o.count != null ? o.count / b.count : 1, angle: diff(o, b, 'angle'), thin: diff(o, b, 'thin'), thick: diff(o, b, 'thick'),
    taper: diff(o, b, 'taper'), dash: diff(o, b, 'dash'), length: o.length ?? 'preset',
    solid: diff(o, b, 'solid'), solidTurn: diff(o, b, 'solidTurn'), solidGap: diff(o, b, 'solidGap'),
    keys: diff(o, b, 'keys'), keysFrom: o.keysFrom ?? 'preset', overhang: diff(o, b, 'overhang'), ends: o.ends ?? 'preset',
    transition: diff(o, b, 'transition'), curve: o.curve ?? 'preset', shift: diff(o, b, 'shift'), growFrom: o.growFrom ?? 'preset',
    motion: 'off',
    ...(o.ink ? { palette: 'custom', ink: o.ink, ground: o.ground } : { palette: 'preset' }),
  })
  for (const k of Object.keys(v)) if (typeof v[k] === 'number') v[k] = Math.round(v[k] * 1e6) / 1e6
  return v
}
/* a board engine called with only some props reads its own defaults for the rest: those, as the board's controls */
const INNER = {
  warp: { shape: 'circle', letter: 'R', size: 0.8, depth: 0, levels: 'smooth', invert: false, contrast: 1.4, effect: 1, source: 'shape', count: 26, angle: 0, weight: 0.3, bend: 2.5, softness: 4, swell: 0, wave: 0, wavelength: 400, phase: 0, palette: 'ink on paper', random: 0 },
  pinch: { effect: 1, count: 17, angle: 0, weight: 0.3, poles: 2, position: -0.3, strength: 1, gather: 0.3, release: 0.9, fan: 1.8, palette: 'paper on ink', random: 0 },
}
const innerValues = (id, o) => ({ ...defaultsOf(id), ...INNER[id], ...o, motion: 'off' })

/* the references: each entry's call, base and values, out of the canvas's own engine source */
const src = fs.readFileSync(path.join(dir, 'line-swell.js'), 'utf8')
const block = src.slice(src.indexOf('var STUDIES = ['), src.indexOf('];', src.indexOf('var STUDIES = [')))
const obj = (s) => JSON.parse(s.replace(/'/g, '"').replace(/([{,]\s*)(\w+)\s*:/g, '$1"$2":'))
const VALS_KEYS = new Set(Object.keys(LS.PRESETS.Blinds))
const presets = Object.fromEntries(BOARDS.map(([id]) => [id, []]))
const checks = []
for (const [, label, fn, args] of block.matchAll(/\['([^']+)', function \(\) \{ return (\w+)\(([^;]*)\); \}\]/g)) {
  const id = label.split(',')[0]
  let form, values
  if (fn === 'sw') {
    const [, base, o] = args.match(/^'(\w+)', (\{.*\})$/)
    const oo = obj(o)
    if (base === 'blinds' && Object.keys(oo).every((k) => VALS_KEYS.has(k))) { form = 'blinds'; values = { ...defaultsOf('blinds'), ...oo } }
    else { form = 'master'; values = masterValues(base, oo) }
  } else { form = fn; values = innerValues(fn, obj(args)) }
  presets[form].push({ id, label, values })
  checks.push([label, form, values])
}

/* the picker: his three groups. Swell is the piano look on shapes and the plain blinds; Half is the half preset from
   its sheet (variants 2, 9 and 22: three of the four his engine rolls from); Line effects one tile each, at its board */
const tiles = [
  { group: 'Swell', items: [
    { id: 'piano-circle', label: 'Piano', form: 'master', values: masterValues('piano', { shape: 'circle' }) },
    { id: 'piano-hexagon', label: 'Piano hexagon', form: 'master', values: masterValues('piano', { shape: 'hexagon' }) },
    { id: 'piano-letter', label: 'Piano letter', form: 'master', values: masterValues('piano', { shape: 'letter', letter: 'S' }) },
    { id: 'blinds', label: 'Blinds', form: 'blinds', values: defaultsOf('blinds') },
  ] },
  { group: 'Half', items: [2, 9, 22].map((n) => ({ id: `half-${n}`, label: `Half ${n}`, form: 'master', values: masterValues('half', {}, n) })) },
  { group: 'Line effects', items: ['warp', 'radial', 'moire', 'pinch', 'flow', 'rotor', 'vortex'].map((id) => ({ id, label: id[0].toUpperCase() + id.slice(1), form: id, values: { ...defaultsOf(id), motion: 'off' } })) },
]

/* every preset draws its reference's path through the form's own call */
const draw = (form, v) => { const c = forms[form].call; return c.fn === 'vals' ? LS.vals(v, c.name) : LS[c.fn](v) }
const studies = LS.STUDIES.map(([label, f]) => [label, f()])
let same = 0
for (const [label, form, v] of checks) {
  const want = studies.find(([l]) => l === label)[1], got = draw(form, v)
  const eq = got.d === want.d && got.ink === want.ink && got.ground === want.ground
  if (eq) same++
  else console.log(`DIFFERS ${label} (${form}): d ${got.d.length} vs ${want.d.length}, ink ${got.ink}/${want.ink}, ground ${got.ground}/${want.ground}`)
}
/* the Motion and Wave shapes pages, for Labs (R8.4): each board whole, as its loop. `clock` is how its renderVals turns
   time into the engine's t: `cycle` t = elapsed / loop, wrapped (Wave, Keys, the three references); `from` t = frame +
   elapsed / loop, wrapped (Band); `run` the same, never wrapped, so speeds need not be whole (Capsules, the landing).
   With play off every one draws at t = frame. `page` is the canvas page it sits on (canvas.json). */
const LOOP_BOARDS = [
  ['wave', 'motion-01-wave', 'cycle'], ['keys', 'motion-02-keys', 'cycle'],
  ['spikes', 'wave-ref-01-spikes', 'cycle'], ['ribbon', 'wave-ref-02-ribbon', 'cycle'], ['center', 'wave-ref-03-center', 'cycle'],
  ['capsules', 'shape-05-capsules', 'run'], ['band', 'shape-03-band', 'from'], ['landing', 'landing-01-wave', 'run'],
]
const canvas = JSON.parse(fs.readFileSync(path.join(dir, 'canvas.json'), 'utf8'))
const pageName = (board) => canvas.pages.find((p) => p.id === canvas.boards[`${board}.dc.html`].page).name
const loops = {}
for (const [id, board, clock] of LOOP_BOARDS) {
  const { props, title, call, rot } = readBoard(board)
  const sections = []
  for (const [name, c] of Object.entries(props)) {
    if (name.startsWith('$')) continue
    let s = sections.find((x) => x.title === c.section)
    if (!s) sections.push(s = { title: c.section, controls: [] })
    const { section: _s, ...rest } = c
    s.controls.push({ name, ...rest })
  }
  loops[id] = { board, title, page: pageName(board), call, clock, frame: { w: props.$preview.width, h: props.$preview.height, ...(rot ? { rot } : {}) }, sections }
}

fs.writeFileSync(path.join(here, '../spec.json'), JSON.stringify({ source: 'https://claude.ai/artifact/4Npm9zbKAg753Cz4TMPSKw', forms, presets, tiles, loops }, null, 1) + '\n')
console.log(`loops: ${Object.keys(loops).map((k) => `${k} (${loops[k].page}, ${loops[k].call.fn})`).join(', ')}`)
console.log(`spec: ${Object.keys(forms).length} forms, ${checks.length} presets (${same} draw their reference exactly), ${tiles.reduce((n, g) => n + g.items.length, 0)} tiles`)
