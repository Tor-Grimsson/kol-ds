import { drawsAsOutline } from './shape-math'

/* STROKE POSITION AND SIDES (plan-2026-11-20-kolbox-everything-left W6.1, Figma's Stroke row). One geometry for the
 * canvas (LayerRenderer) and the export (build.js), in the layer's own px (its box at 0,0).
 *
 *   strokeAlign   'inside' | 'center' | 'outside', on a rectangle, an ellipse and a frame. Unset reads 'inside', the
 *                 way those three always drew, so an old file draws as it did.
 *   strokeSides   [top, right, bottom, left] widths, on a rectangle and a frame (Figma's Individual strokes); unset,
 *                 every side is `strokeWidth`.
 *
 * `strokeRing` is null where the old drawing holds (inside, every side alike): the caller draws as before. */
const OUT = { inside: 0, center: 0.5, outside: 1 }

export const canAlignStroke = (l) => !!l && (l.type === 'frame' || (l.type === 'shape' && (l.kind === 'rect' || l.kind === 'ellipse') && !drawsAsOutline(l)))
export const canSideStroke = (l) => !!l && (l.type === 'frame' || (l.type === 'shape' && l.kind === 'rect' && !drawsAsOutline(l)))
export const strokeAlignOf = (l) => (canAlignStroke(l) && OUT[l.strokeAlign] != null ? l.strokeAlign : 'inside')
export const strokeSidesOf = (l) => (canSideStroke(l) && Array.isArray(l.strokeSides) && l.strokeSides.length === 4 ? l.strokeSides : null)
const widthOf = (l) => (l.stroke && (l.strokeWidth ?? 0) > 0 ? l.strokeWidth : 0)

/* how far the stroke reaches past the box, [top, right, bottom, left] */
export function strokeOutset(l) {
  const sides = strokeSidesOf(l)
  const sw = widthOf(l)
  if (!sw && !sides) return [0, 0, 0, 0]
  const o = OUT[strokeAlignOf(l)]
  return (sides ?? [sw, sw, sw, sw]).map((v) => (l.stroke ? v * o : 0))
}

/* the stroke's own shape, or null for the old drawing:
 *   { kind: 'ring', d }                       sides: the band between two boxes, painted with fill-rule evenodd
 *   { kind: 'rect', x, y, w, h, rx, sw }      one width, centred on a line moved out by the position
 *   { kind: 'ellipse', cx, cy, rx, ry, sw } */
export function strokeRing(l, w, h) {
  if (!l.stroke) return null
  const sides = strokeSidesOf(l)
  const align = strokeAlignOf(l)
  if (sides) {
    const [t, r, b, lf] = sides.map((v) => Math.max(0, Number(v) || 0))
    const o = OUT[align]
    const ox = -lf * o, oy = -t * o, ow = w + (lf + r) * o, oh = h + (t + b) * o
    const ix = ox + lf, iy = oy + t, iw = Math.max(0, ow - lf - r), ih = Math.max(0, oh - t - b)
    return { kind: 'ring', d: `M${ox} ${oy}h${ow}v${oh}h${-ow}Z M${ix} ${iy}v${ih}h${iw}v${-ih}Z` }
  }
  const sw = widthOf(l)
  if (!sw || align === 'inside') return null
  const off = align === 'center' ? 0 : sw / 2
  if (l.type === 'shape' && l.kind === 'ellipse') return { kind: 'ellipse', cx: w / 2, cy: h / 2, rx: w / 2 + off, ry: h / 2 + off, sw }
  return { kind: 'rect', x: -off, y: -off, w: w + off * 2, h: h + off * 2, rx: l.radius > 0 ? l.radius + off : 0, sw }
}

/* the ring as SVG markup (the export's), in `color`; `attrs` carries the dash, cap and join */
export function strokeRingSvg(ring, color, attrs = '') {
  const n = (v) => Number(v).toFixed(2)
  if (ring.kind === 'ring') return `<path d="${ring.d}" fill="${color}" fill-rule="evenodd"/>`
  if (ring.kind === 'ellipse') return `<ellipse cx="${n(ring.cx)}" cy="${n(ring.cy)}" rx="${n(ring.rx)}" ry="${n(ring.ry)}" fill="none" stroke="${color}" stroke-width="${ring.sw}"${attrs}/>`
  return `<rect x="${n(ring.x)}" y="${n(ring.y)}" width="${n(ring.w)}" height="${n(ring.h)}"${ring.rx ? ` rx="${n(ring.rx)}"` : ''} fill="none" stroke="${color}" stroke-width="${ring.sw}"${attrs}/>`
}
