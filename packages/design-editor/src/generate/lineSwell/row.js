/* A Line Swell row's data side (R8): its form in spec.json, the source and colors its values ask for, the generate
 * vehicle it draws as, and a new row's values on its layer. Light on purpose: the layer model imports it, so it pulls in
 * nothing but the spec and the board engine (no pack, check:core). The drawing is `./index.js`. */
import SPEC from './spec.json' with { type: 'json' }
import * as LS from './source.js'

export { SPEC }
export const formOf = (id) => SPEC.forms[id] ?? null
export const defaultsOf = (id) => Object.fromEntries(formOf(id).sections.flatMap((s) => s.controls.map((c) => [c.name, c.default])))
export const presetsOf = (id) => SPEC.presets[id] ?? []
const title = (s) => String(s)[0].toUpperCase() + String(s).slice(1)
/* the row's name: the master board's preset (Piano, Half), else the board's own word (Blinds, Warp) */
export const lineSwellLabel = (p) => (p?.form === 'master' ? title(p.values?.preset ?? 'swell') : title(formOf(p?.form)?.title.split(' ')[0] ?? 'Line Swell'))

/* the source a form's values ask for, as the layer gives it */
const hasShape = (form) => formOf(form).sections.some((s) => s.controls.some((c) => c.name === 'shape'))
export function sourceOf(form, v) {
  if (v.source === 'image') return { kind: 'image' }
  if (v.source === 'wave') return { kind: 'wave' }
  if (!hasShape(form)) return { kind: 'none' }
  /* the master's shape 'preset' is its base's, and the glyph base is a letter */
  const base = form === 'master' && (!v.shape || v.shape === 'preset') ? LS.MASTER[v.preset] : null
  const typed = form === 'master' ? String(v.letter ?? '').trim() || (base?.shape === 'letter' ? base.letter : '') : v.shape === 'letter' ? String(v.letter || 'R') : ''
  if (typed) return { kind: 'letter', char: [...typed].pop(), weight: form === 'master' ? +v.letterWeight || 900 : 900 }
  if (v.shape === 'layer') return { kind: 'layer' }
  return { kind: 'shape' }
}

/* the board's ink and ground, as each engine reads its palette */
export function colorsOf(form, v) {
  if (formOf(form).call.fn === 'vals') return { ink: v.ink, ground: v.ground }
  const pal = LS.PALETTES[v.palette]
  if (pal) return { ink: pal[0], ground: pal[1] }
  if (form === 'master') {
    const b = LS.MASTER[v.preset] ?? LS.MASTER.sun
    return v.palette === 'custom' ? { ink: v.ink || b.ink, ground: v.ground || b.ground } : { ink: b.ink, ground: b.ground }
  }
  return { ink: v.ink, ground: v.ground }
}

/* a Line Swell row → the generate vehicle it draws as, on its host layer */
export function vehicleOf(host, row) {
  const { form, values = {} } = row.params ?? {}
  if (!formOf(form)) return null
  const src = sourceOf(form, values), { ink, ground } = colorsOf(form, values)
  return {
    type: 'generate', genStyle: 'lineSwell', lsForm: form, lsValues: values, inset: 0, color: ink, bg: values.ground ? ground : null,
    ...(src.kind === 'letter' ? { mKind: 'letter', mChar: src.char, mFamily: host.type === 'text' ? (host.family ?? 'inter') : 'inter', mWeight: src.weight } : {}),
    ...(src.kind === 'layer' ? { mKind: 'layer', mLayer: host.id } : {}),
    ...(src.kind === 'image' ? { fKind: 'image', fImgLayer: host.id } : {}),
  }
}

/* a new row's values for a form picked on a layer: the tile's, with the layer as the source where the form takes one */
/* …and its ground unset: only the ink is drawn and the layer's own fill shows, until a ground is set */
export const valuesOn = (host, form, values) => ({ ...placeOn(host, form, values), ground: '' })
function placeOn(host, form, values) {
  if (!hasShape(form) || values.source === 'image') return values
  if (host?.type === 'text' && host.text) {
    const ch = [...String(host.text).trim()][0]
    if (!ch) return values
    return form === 'master' ? { ...values, letter: ch } : { ...values, shape: 'letter', letter: ch }
  }
  if (host?.type === 'path' || host?.type === 'shape') return { ...values, shape: 'layer', ...(form === 'master' ? { letter: '' } : {}) }
  return values
}
