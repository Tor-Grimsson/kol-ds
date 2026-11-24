/* LINE SWELL, as his canvas has it (plan-2026-11-19-kolbox-whats-left R8): a form is one board of the canvas, its
 * settings that board's own Tweaks panel (`spec.json`, built by `spec/build.mjs` from each board's `data-props`), drawn
 * by the board engine (`source.js`) through the call the board makes. Picked from the Effects menu, a form is an effect
 * row on a layer (`type: 'lineSwell'`, params `{ form, values }`); the row draws as a generate vehicle of the one style
 * here, so the canvas, the export and Expand go through the generate pipeline as before.
 *
 * Placement: the boards are 1200 × 800 with the mark at their centre; the layer's box takes the board's 800 square,
 * centred (k = the shorter side / 800), and the board's ground fills the box: a 1200 × 800 layer IS the board.
 * The source, where a form takes a shape: `shape` 'layer' is the layer's own outline (a shape or a path), a letter
 * is read from the editor's outline fonts, `source` 'image' reads the layer's own image fill (or the board's lit
 * sphere when it has none). */
import * as LS from './source.js'
import { pixelRings } from '../glyphs.js'

export { SPEC, formOf, defaultsOf, presetsOf, lineSwellLabel, sourceOf, colorsOf, vehicleOf, valuesOn } from './row.js'
import { SPEC, formOf, sourceOf } from './row.js'

/* the board's call, with the editor's source: env { image(x, y) → brightness at a field pixel, rings } */
export function drawForm(form, values, env = {}, t) {
  const c = formOf(form).call
  const v = { ...values, ...(t != null ? { waveT: t } : {}) }
  return c.fn === 'vals' ? LS.vals(v, c.name, env) : LS[c.fn](v, env)
}

/* ── the board's output → marks ─────────────────────────────────────────────────────────────────────────────────── */
const mul = (a, b) => [a[0] * b[0] + a[2] * b[1], a[1] * b[0] + a[3] * b[1], a[0] * b[2] + a[2] * b[3], a[1] * b[2] + a[3] * b[3], a[0] * b[4] + a[2] * b[5] + a[4], a[1] * b[4] + a[3] * b[5] + a[5]]
/* an SVG transform list (translate, rotate, scale) as one matrix */
export function parseRot(str) {
  let m = [1, 0, 0, 1, 0, 0]
  for (const [, fn, args] of String(str ?? '').matchAll(/(translate|rotate|scale)\(([^)]*)\)/g)) {
    const n = args.split(/[\s,]+/).filter(Boolean).map(Number)
    if (fn === 'translate') m = mul(m, [1, 0, 0, 1, n[0], n[1] ?? 0])
    else if (fn === 'scale') m = mul(m, [n[0], 0, 0, n[1] ?? n[0], 0, 0])
    else { const a = (n[0] * Math.PI) / 180; m = mul(m, [Math.cos(a), Math.sin(a), -Math.sin(a), Math.cos(a), 0, 0]) }
  }
  return m
}
/* a `d` of M, L and Z subpaths → point rings */
export function rings(d) {
  if (!d) return []
  return d.split('M').filter((s) => s.trim()).map((s) => s.replace(/Z/g, '').split('L').map((pt) => pt.trim().split(/\s+/).map(Number))).filter((r) => r.length >= 3)
}
const place = (box) => {
  const k = Math.min(box.w, box.h) / 800, cx = box.x + box.w / 2, cy = box.y + box.h / 2
  return { k, toLayer: (X, Y) => [cx + (X - 600) * k, cy + (Y - 400) * k] }
}
function push(m, v, box) {
  const t = parseRot(v.rot), { toLayer } = place(box)
  const map = (r) => r.map(([x, y]) => toLayer(t[0] * x + t[2] * y + t[4], t[1] * x + t[3] * y + t[5]))
  for (const r of rings(v.d)) m.polys.push(map(r))
  for (const r of rings(v.d2)) m.polys.push(map(r))
  /* a ring with its hole stays one shape (Expand keeps the hole) */
  const holes = rings(v.dh).map(map)
  for (let i = 0; i + 1 < holes.length; i += 2) m.compounds.push([holes[i], [...holes[i + 1]]])
  const ring = rings(v.d3).map(map)
  if (ring.length) m.compounds.push(ring)
}
/* the generate pipeline's source → the engine's: the photo as brightness at a field pixel; rings back in px (they come
   in the art box's units, which squash a box that is not square) */
function envOf(box, ctx, src) {
  const { k } = place(box)
  const cx = box.x + box.w / 2, cy = box.y + box.h / 2
  const image = ctx.image ? (x, y) => ctx.image((cx + (x - 400) * k - box.x) / box.w, (cy + (y - 400) * k - box.y) / box.h) : null
  const px = ctx.rings?.length ? ctx.rings.map((r) => r.map(([u, w]) => [u * box.w, w * box.h])) : null
  /* no outline yet (the font loading, Labs): a letter in the pixel font, so the source never comes up empty */
  const fallback = src.kind === 'letter' ? pixelRings(src.char).map((r) => r.map(([x, y]) => [(x * 5) / 7, y])) : null
  return { image, rings: px ?? fallback }
}

/* the one generate style a Line Swell row draws as (its params: lsForm, lsValues and the source fields) */
const KEYS = ['lsForm', 'lsValues', 'mKind', 'mChar', 'mFamily', 'mWeight', 'mLayer', 'fKind', 'fImgLayer']
export const LINE_SWELL_STYLE = {
  id: 'lineSwell', label: 'Line Swell', family: 'lineSwellEffect', about: 'Line Swell, his canvas\'s boards as effects',
  schema: KEYS.map((key) => ({ key, type: 'text', default: undefined, section: 'Line Swell' })),
  draw(m, p, box, ctx) {
    if (!formOf(p.lsForm)) return
    push(m, drawForm(p.lsForm, p.lsValues ?? {}, envOf(box, ctx, sourceOf(p.lsForm, p.lsValues ?? {}))), box)
  },
}

