/* GENERATE — the registry and the one render entry (plan 52).
 *
 * `renderGenerate(params, w, h, { rings })` → Marks, for a `generate` layer's live render, its export
 * and its Expand alike. A style is { id, label, about, schema, sampled?, warp?, draw(marks, p, box, ctx) };
 * a sampled style gets the shared Field · Mask (· Warp) rows and its ctx carries them built. Pure. */
import { createMarks } from './geom.js'
import { makeField, makeMask, makeWarp, FIELD_SCHEMA, MASK_SCHEMA, WARP_SCHEMA } from './field.js'
import lineScreen from './styles/lineScreen.js'
import dotScreen from './styles/dotScreen.js'
import stripeArray from './styles/stripeArray.js'
import radialArray from './styles/radialArray.js'
import symbolGrid from './styles/symbolGrid.js'
import tiling from './styles/tiling.js'
import ascii from './styles/ascii.js'
import stipple from './styles/stipple.js'
import mosaic from './styles/mosaic.js'
import { PRESETS } from './presets.js'
import { REPEAT_SCHEMA, copyMatrices, apply } from './repeat.js'

export const STYLES = [lineScreen, dotScreen, ascii, stripeArray, radialArray, symbolGrid, tiling, stipple, mosaic]
export const styleById = (id) => STYLES.find((s) => s.id === id) ?? STYLES[0]

/* RANDOMNESS (plan 53 § 1.3): a seeded jitter on every mark after the style draws — position (px), size
   (share) and drop-out (chance). All zero = the marks untouched, byte for byte. */
const JITTER_SCHEMA = [
  { key: 'jPos', label: 'Jitter position', type: 'range', min: 0, max: 40, step: 0.5, default: 0, format: (v) => `${v}px`, section: 'Randomness' },
  { key: 'jSize', label: 'Jitter size', type: 'range', min: 0, max: 1, step: 0.01, default: 0, format: (v) => `${Math.round(v * 100)}%`, section: 'Randomness' },
  { key: 'jDrop', label: 'Drop-out', type: 'range', min: 0, max: 1, step: 0.01, default: 0, format: (v) => `${Math.round(v * 100)}%`, section: 'Randomness' },
  { key: 'jSeed', label: 'Seed', type: 'range', min: 1, max: 99, step: 1, default: 1, section: 'Randomness' },
]
const rnd = (i, seed) => {
  let h = Math.imul(i + 1, 2654435761) ^ Math.imul(seed + 11, 374761393)
  h = Math.imul(h ^ (h >>> 15), 2246822519); h ^= h >>> 13
  return (h >>> 0) / 4294967296
}
function jitter(m, p) {
  const jp = p.jPos ?? 0, js = p.jSize ?? 0, jd = p.jDrop ?? 0, seed = p.jSeed ?? 1
  if (!jp && !js && !jd) return m
  let k = 0
  const move = (i) => [(rnd(i * 3, seed) * 2 - 1) * jp, (rnd(i * 3 + 1, seed) * 2 - 1) * jp]
  const size = (i) => 1 + (rnd(i * 3 + 2, seed) * 2 - 1) * js
  const keep = (i) => rnd(i * 7 + 5, seed) >= jd
  const shape = (pts, i) => {
    const [dx, dy] = move(i), sc = size(i)
    let cx = 0, cy = 0
    for (const q of pts) { cx += q[0]; cy += q[1] }
    cx /= pts.length; cy /= pts.length
    return pts.map(([x, y]) => [cx + (x - cx) * sc + dx, cy + (y - cy) * sc + dy])
  }
  m.polys = m.polys.filter(() => keep(k++)).map((pts, i) => shape(pts, i))
  m.compounds = (m.compounds ?? []).filter(() => keep(k++)).map((c, i) => {
    const all = c.flat(), cx = all.reduce((a, q) => a + q[0], 0) / all.length, cy = all.reduce((a, q) => a + q[1], 0) / all.length
    const [dx, dy] = move(i + 50000), sc = size(i + 50000)
    return c.map((r) => r.map(([x, y]) => [cx + (x - cx) * sc + dx, cy + (y - cy) * sc + dy]))
  })
  m.circles = m.circles.filter(() => keep(k++)).map(([cx, cy, r, ry], i) => {
    const [dx, dy] = move(i + 90000), sc = size(i + 90000)
    return ry == null ? [cx + dx, cy + dy, r * sc] : [cx + dx, cy + dy, r * sc, ry * sc]
  })
  return m
}

/* the marks copied by the repeat matrices (source box = the layer's own box); the original stays */
function repeatMarks(m, p, w, h) {
  if (!p.repOn) return m
  const mats = copyMatrices(p, { x: 0, y: 0, w, h })
  const out = { polys: [...m.polys], circles: [...m.circles], compounds: [...(m.compounds ?? [])] }
  for (const mt of mats) {
    const sc = Math.sqrt(Math.abs(mt[0] * mt[3] - mt[1] * mt[2]))
    for (const p0 of m.polys) out.polys.push(p0.map(([x, y]) => apply(mt, x, y)))
    for (const c of m.compounds ?? []) out.compounds.push(c.map((r) => r.map(([x, y]) => apply(mt, x, y))))
    for (const [cx, cy, r, ry] of m.circles) { const [x, y] = apply(mt, cx, cy); out.circles.push(ry == null ? [x, y, r * sc] : [x, y, r * sc, ry * sc]) }
  }
  return out
}

/* the rows every generate layer carries, whatever its style: art inset, ink, ground */
const FRAME_SCHEMA = [
  { key: 'inset', label: 'Inset', type: 'range', min: 0, max: 400, step: 1, default: 0, format: (v) => `${v}px`, section: 'Frame' },
  { key: 'color', label: 'Ink', type: 'color', default: '#FFFFFF', section: 'Frame' },
  { key: 'bg', label: 'Ground', type: 'color', default: '#000000', section: 'Frame' },
]

/* Warp and Frame open closed: the window leads with the style's own controls, its field and its mask */
const closed = (rows) => rows.map((r) => ({ ...r, collapsed: true }))
export function schemaFor(styleId) {
  const s = styleById(styleId)
  return [
    ...s.schema,
    ...(s.sampled ? [...FIELD_SCHEMA, ...MASK_SCHEMA, ...(s.warp === false ? [] : closed(WARP_SCHEMA))] : []),
    ...closed(JITTER_SCHEMA),
    /* REPEAT inside the layer (plan 53 § 3.2): the marks themselves copied — radial, grid, mirror */
    ...closed([{ key: 'repOn', label: 'Repeat', type: 'toggle', default: false }, { key: 'repMode', label: 'Mode', type: 'select', default: 'radial',
      options: [{ value: 'radial', label: 'Radial' }, { value: 'grid', label: 'Grid' }, { value: 'mirror', label: 'Mirror' }] },
    ...REPEAT_SCHEMA.map((r) => ({ ...r, when: (l) => !!l.repOn && (!r.when || r.when(l)) }))].map((r) => ({ ...r, section: 'Repeat' }))),
    ...closed(FRAME_SCHEMA),
  ]
}

/* a style's defaults from its whole schema, then a preset's numbers over them */
export function paramsFor(styleId, presetId) {
  const base = Object.fromEntries(schemaFor(styleId).filter((r) => r.default !== undefined).map((r) => [r.key, r.default]))
  const pr = presetId ? PRESETS.find((x) => x.id === presetId) : null
  return { ...base, ...(pr?.params ?? {}), genStyle: styleId, genPreset: pr?.id ?? null, genLabel: pr?.label ?? styleById(styleId).label }
}
export const presetsOf = (styleId) => PRESETS.filter((x) => x.style === styleId)

export function artBox(p, w, h) {
  const i = Math.max(0, Math.min(p.inset ?? 0, Math.min(w, h) / 2 - 1))
  return { x: i, y: i, w: w - 2 * i, h: h - 2 * i }
}

export function renderGenerate(p, w, h, { rings = null, image = null } = {}) {
  const s = styleById(p.genStyle)
  const m = createMarks()
  const box = artBox(p, w, h)
  if (box.w <= 1 || box.h <= 1) return m
  const aspect = box.w / box.h
  const ctx = { aspect }
  if (s.sampled) {
    ctx.field = makeField(p, aspect, image)
    ctx.mask = makeMask(p, aspect, rings)
    ctx.warp = s.warp === false ? null : makeWarp(p, aspect, ctx.field)
  }
  s.draw(m, p, box, ctx)
  return repeatMarks(jitter(m, p), p, w, h)
}
