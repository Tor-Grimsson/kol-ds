/* LINE SWELL in Labs (R8.3, R8.4): every board of his canvas that Labs carries, as a loop. Its settings are the board's own
 * Tweaks panel from `spec.json` (the declaration the editor's panel draws: his names, sections, ranges and defaults), drawn
 * by the board engine (`source.js`, `waveOrganism.js`) through the call the board makes. The categories are his canvas's
 * pages, in its order: Presets (Blinds), Master (Swell), Line Effects (the seven, with their Motion section), References
 * (the refs sheet's marks as presets), Motion (Wave, Keys and the three references) and Wave shapes (Capsules, Band, the
 * landing). Labs reads no photo or outline, so a letter is the pixel font and the image source is the board's lit sphere.
 *
 * Time, as each board's renderVals makes it: the board's `loop` is the seconds one cycle takes (the Labs body sets the
 * transport to it), the loop's u is elapsed / loop, and with `play` off a board draws at its `frame`. A board whose speeds
 * need not be whole (`run`) loops over the fewest cycles after which both of its waves are whole again (`spanOf`). */
import { SPEC, drawForm, colorsOf, presetsOf, lineSwellLabel, parseRot, rings } from './index.js'
import * as LS from './source.js'
import * as WO from './waveOrganism.js'
import { pixelRings } from '../glyphs.js'

/* a layer's own fields a board's name cannot take (vortex's x and y): stored under another key, shown under his name */
const RESERVED = new Set(['id', 'type', 'x', 'y', 'w', 'h', 'src'])
export const keyOf = (name) => (RESERVED.has(name) ? `ls${name.toUpperCase()}` : name)
const TYPE = { range: 'range', int: 'range', enum: 'select', boolean: 'toggle', color: 'color', text: 'text' }
const rowOf = (c, section) => ({
  key: keyOf(c.name), label: c.name, type: TYPE[c.editor], default: c.default, section,
  ...(c.editor === 'range' || c.editor === 'int' ? { min: c.min, max: c.max, step: c.editor === 'int' ? 1 : c.step } : {}),
  ...(c.options && c.editor === 'enum' ? { options: c.options.map((o) => ({ value: o, label: o })) } : {}),
  ...(c.unit ? { format: (v) => `${v}${c.unit === '°' ? '°' : ` ${c.unit}`}` } : {}),
})
const paramsOf = (spec) => spec.sections.flatMap((s) => s.controls.map((c) => rowOf(c, s.title)))
/* the layer's values under his names, for the engine and the panel */
export const boardValues = (spec, p) => Object.fromEntries(spec.sections.flatMap((s) => s.controls.map((c) => [c.name, p[keyOf(c.name)]])))
const firstWords = (t) => t.split(/[,:]/)[0]
const letterEnv = (ch) => (ch ? { rings: pixelRings([...ch].pop()).map((r) => r.map(([x, y]) => [(x * 5) / 7, y])) } : {})

/* a form's panel in Labs: its board's sections, with the Motion section back in its place where the board has one */
const formSpec = (form) => {
  const f = SPEC.forms[form]
  if (!f.motion) return f
  const sections = [...f.sections]
  sections.splice(f.motion.at, 0, { title: 'Motion', controls: f.motion.controls })
  return { ...f, sections }
}
const formId = (form) => `lineswell-${form}`
/* Wave and Keys keep the ids they had (a saved layer opens on them) */
const loopId = (id) => `lineswell-${id}`

function formLoop(form) {
  const spec = formSpec(form)
  const params = paramsOf(spec)
  const moves = form === 'master' || !!spec.motion
  let last = { key: '', path: null }
  return {
    id: formId(form), label: form === 'master' ? 'Swell' : lineSwellLabel({ form }), group: 'lineswell', kind: '2d', duration: 4, still: !moves, params,
    lineSwell: { spec, kind: 'form' },
    draw(ctx, u, w, h, p) {
      const v0 = boardValues(spec, p)
      const motion = v0.motion && v0.motion !== 'off'
      const moving = (form === 'master' && v0.source === 'wave') || motion
      const { ink, ground } = colorsOf(form, v0)
      const key = JSON.stringify([w, h, moving ? u : 0, v0])
      if (key !== last.key) {
        const ch = String(v0.letter || (v0.shape === 'letter' ? 'R' : '')).trim()
        const v = drawForm(form, { ...v0, ...(motion ? { motionT: u } : {}) }, letterEnv(ch), form === 'master' && v0.source === 'wave' ? u : undefined)
        const k = Math.min(w, h) / 800, m = parseRot(v.rot)
        const path = new Path2D()
        for (const r of [...rings(v.d), ...rings(v.d2), ...rings(v.dh), ...rings(v.d3)]) {
          r.forEach(([x, y], i) => {
            const X = w / 2 + (m[0] * x + m[2] * y + m[4] - 600) * k, Y = h / 2 + (m[1] * x + m[3] * y + m[5] - 400) * k
            if (i) path.lineTo(X, Y); else path.moveTo(X, Y)
          })
          path.closePath()
        }
        last = { key, path }
      }
      ctx.fillStyle = ground
      ctx.fillRect(0, 0, w, h)
      ctx.fillStyle = ink
      ctx.fill(last.path, 'evenodd')
    },
  }
}

/* a `run` board's span: the fewest cycles after which both waves are whole (its speeds step by 0.01, so at most 100) */
const whole = (x) => Math.abs(x - Math.round(x)) < 1e-6
export function spanOf(spec, v) {
  if (spec.clock !== 'run') return 1
  let a = Math.abs(+v.speed || 0), b = Math.abs(+v.speed2 || 0)
  if (v.sync === true || v.sync === 'true') {
    const [hn, hd] = String(v.harmonic || '1:1').split(':').map((n) => Math.max(1, +n || 1))
    b = a * hn; a *= hd
  }
  for (let n = 1; n <= 100; n++) if (whole(n * a) && whole(n * b)) return n
  return 100
}
/* the board's t for the loop's u, as its renderVals makes it */
export function boardT(spec, v, u) {
  const frame = +v.frame || 0
  if (v.play === false) return frame
  if (spec.clock === 'cycle') return u
  if (spec.clock === 'from') return (frame + u) % 1
  return frame + u * spanOf(spec, v)
}
/* the board's output at t: its engine and call, the landing's fit */
export function boardAt(spec, v, t) {
  const { fn, engine, fit } = spec.call
  if (engine === 'organism') {
    const props = fit ? { ...v, width: ((+v.width || 1100) / 1200) * spec.frame.w, height: ((+v.height || 630) / 800) * spec.frame.h } : v
    return WO[fn](props, t)
  }
  return fn === 'keys' ? LS.keys(v, t, letterEnv(v.letter ? String(v.letter).trim() : '')) : LS[fn](v, t)
}

function boardLoop(id) {
  const spec = SPEC.loops[id]
  const params = paramsOf(spec)
  const { w: W, h: H } = spec.frame
  let last = { key: '', v: null }
  return {
    id: loopId(id), label: firstWords(spec.title), group: 'lineswell', kind: '2d', params,
    duration: spec.sections.flatMap((s) => s.controls).find((c) => c.name === 'loop')?.default ?? 4,
    about: spec.title,
    lineSwell: { spec, kind: 'loop' },
    draw(ctx, u, w, h, p) {
      const v0 = boardValues(spec, p)
      const t = boardT(spec, v0, u)
      const key = JSON.stringify([t, v0])
      if (key !== last.key) last = { key, v: boardAt(spec, v0, t) }
      const v = last.v
      /* the whole board in the canvas, at its centre; its ground fills the rest */
      const k = Math.min(w / W, h / H), m = parseRot(spec.frame.rot ?? v.rot)
      ctx.fillStyle = v.ground
      ctx.fillRect(0, 0, w, h)
      ctx.save()
      ctx.translate(w / 2, h / 2)
      ctx.scale(k, k)
      ctx.translate(-W / 2, -H / 2)
      ctx.transform(m[0], m[1], m[2], m[3], m[4], m[5])
      ctx.fillStyle = v.ink
      ctx.fill(new Path2D(v.d))
      ctx.restore()
    },
  }
}

const FORMS = Object.keys(SPEC.forms)
const LOOPS = Object.keys(SPEC.loops)
export const LINE_SWELL_LOOPS = [...FORMS.map(formLoop), ...LOOPS.map(boardLoop)]

/* his canvas's pages, in its order; a form's board preset sits on its page */
const PAGE = { blinds: 'Presets', master: 'Master' }
const board = (form) => ({ id: `lineswell-board-${form}`, label: form === 'master' ? 'Swell' : lineSwellLabel({ form }), loop: formId(form), sub: PAGE[form] ?? 'Line Effects', params: {} })
const ORDER = ['Presets', 'Master', 'Line Effects', 'References', 'Motion', 'Wave shapes']
export const LINE_SWELL_LOOP_PRESETS = [
  ...FORMS.map(board),
  ...FORMS.flatMap((form) => presetsOf(form).map((pr) => ({ id: `lineswell-${pr.id}`, label: pr.label, loop: formId(form), sub: 'References', params: Object.fromEntries(Object.entries(pr.values).map(([k, v]) => [keyOf(k), v])) }))),
  ...LOOPS.map((id) => ({ id: `lineswell-board-${id}`, label: firstWords(SPEC.loops[id].title), loop: loopId(id), sub: SPEC.loops[id].page, params: {} })),
].sort((a, b) => ORDER.indexOf(a.sub) - ORDER.indexOf(b.sub))
