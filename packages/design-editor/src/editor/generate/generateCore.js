/* The editor's side of a `generate` layer (plan 52 § 1.1): its marks, its SVG body, its key.
 *
 * The layer IS the params (flat, like `pattern`). `generateMarks` draws them at the layer's own size —
 * the same Marks list feeds the canvas, the export and Expand. A letter / type-layer mask (W4) comes in as
 * rings, kept per layer id in `ringCache` by whoever resolved them last (the canvas renderer), so the
 * export — which only sees one layer — reads the same outline the canvas drew. */
import { renderGenerate, schemaFor } from '../../generate/index.js'
import { marksD } from '../../generate/geom.js'
import { CANVAS_W } from '../compose/state'

export const ringCache = new Map()
/* the image sampler a layer drew with last (image as field) — the export and Expand reuse it */
export const imageSamplers = new Map()

/* the params that change the picture — memo key; x / y / rotation / opacity do not */
export function generateKey(layer) {
  const keys = schemaFor(layer.genStyle).map((r) => r.key)
  return JSON.stringify([layer.genStyle, Math.round(layer.w ?? 0), Math.round(layer.h ?? 0), keys.map((k) => layer[k])])
}

/* FIT: the picture is drawn at the size the window previews it (the editor's canvas, square) and scaled into the layer's
   box keeping its proportions, centred: whole (`fit`) or covering it (`fill`, the box clips the rest). `actual`, and a
   layer from before the choice, draws at the box's own size. */
export function generateMarks(layer, rings = ringCache.get(layer.id) ?? null, image = imageSamplers.get(layer.id) ?? null) {
  const w = layer.w ?? 0, h = layer.h ?? 0
  const fit = layer.genFit ?? 'actual'
  if (fit === 'actual' || w <= 0 || h <= 0) return renderGenerate(layer, w, h, { rings, image })
  const m = renderGenerate(layer, CANVAS_W, CANVAS_W, { rings, image })
  const s = (fit === 'fill' ? Math.max(w, h) : Math.min(w, h)) / CANVAS_W
  const dx = (w - CANVAS_W * s) / 2, dy = (h - CANVAS_W * s) / 2
  const pt = ([x, y]) => [dx + x * s, dy + y * s]
  return {
    ...m,
    polys: m.polys.map((p) => p.map(pt)),
    compounds: (m.compounds ?? []).map((c) => c.map((r) => r.map(pt))),
    circles: m.circles.map(([cx, cy, r, ry]) => (ry == null ? [dx + cx * s, dy + cy * s, r * s] : [dx + cx * s, dy + cy * s, r * s, ry * s])),
  }
}

/* ground + ink as SVG in LAYER-LOCAL coordinates — the caller translates to (x, y) */
export function generateBody(layer, colors, marks = generateMarks(layer)) {
  const w = layer.w ?? 0, h = layer.h ?? 0
  const ground = colors.bg ? `<rect width="${w}" height="${h}" fill="${colors.bg}"/>` : ''
  const d = marksD(marks)
  return ground + (d ? `<path d="${d}" fill="${colors.ink ?? '#FFFFFF'}"/>` : '')
}
