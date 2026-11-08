/* The editor's side of a `generate` layer (plan 52 § 1.1): its marks, its SVG body, its key.
 *
 * The layer IS the params (flat, like `pattern`). `generateMarks` draws them at the layer's own size —
 * the same Marks list feeds the canvas, the export and Expand. A letter / type-layer mask (W4) comes in as
 * rings, kept per layer id in `ringCache` by whoever resolved them last (the canvas renderer), so the
 * export — which only sees one layer — reads the same outline the canvas drew. */
import { renderGenerate, schemaFor } from '../../generate/index.js'
import { marksD } from '../../generate/geom.js'

export const ringCache = new Map()
/* the image sampler a layer drew with last (image as field) — the export and Expand reuse it */
export const imageSamplers = new Map()

/* the params that change the picture — memo key; x / y / rotation / opacity do not */
export function generateKey(layer) {
  const keys = schemaFor(layer.genStyle).map((r) => r.key)
  return JSON.stringify([layer.genStyle, Math.round(layer.w ?? 0), Math.round(layer.h ?? 0), keys.map((k) => layer[k])])
}

export function generateMarks(layer, rings = ringCache.get(layer.id) ?? null, image = imageSamplers.get(layer.id) ?? null) {
  return renderGenerate(layer, layer.w ?? 0, layer.h ?? 0, { rings, image })
}

/* ground + ink as SVG in LAYER-LOCAL coordinates — the caller translates to (x, y) */
export function generateBody(layer, colors, marks = generateMarks(layer)) {
  const w = layer.w ?? 0, h = layer.h ?? 0
  const ground = colors.bg ? `<rect width="${w}" height="${h}" fill="${colors.bg}"/>` : ''
  const d = marksD(marks)
  return ground + (d ? `<path d="${d}" fill="${colors.ink ?? '#FFFFFF'}"/>` : '')
}
