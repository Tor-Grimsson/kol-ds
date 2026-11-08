/* MOSAIC — Half Line's mosaic (plan 53 § 4.2). A hex (or square) tiling; each tile drawn as its own shape,
 * scaled by the field — Gap keeps the seams, a tile at full size closes them. */
import { poly } from '../geom.js'

export default {
  id: 'mosaic',
  label: 'Mosaic',
  about: 'Mosaic — hex or square tiles, each scaled by a field',
  sampled: true,
  hold: ['cols', 'tile'],
  schema: [
    { key: 'tile', label: 'Tile', type: 'segmented', default: 'hex', options: [{ value: 'hex', label: 'Hex' }, { value: 'square', label: 'Square' }], section: 'Mosaic' },
    { key: 'cols', label: 'Columns', type: 'range', min: 3, max: 160, step: 1, default: 40, animatable: false, section: 'Mosaic' },
    { key: 'gap', label: 'Gap', type: 'range', min: 0, max: 0.6, step: 0.01, default: 0.08, format: (v) => `${Math.round(v * 100)}%`, section: 'Mosaic' },
    { key: 'min', label: 'Smallest', type: 'range', min: 0, max: 1, step: 0.01, default: 0.05, format: (v) => `${Math.round(v * 100)}%`, section: 'Mosaic' },
  ],
  draw(m, p, box, { field, mask, warp }) {
    const cols = Math.max(1, Math.round(p.cols ?? 40)), hex = (p.tile ?? 'hex') === 'hex'
    const pw = box.w / cols, R = hex ? pw / Math.sqrt(3) : pw / 2
    const ph = hex ? R * 1.5 : pw
    const rows = Math.ceil(box.h / ph) + 1
    for (let j = 0; j < rows; j++) for (let i = 0; i <= cols; i++) {
      const cx = (i + (hex && j % 2 ? 0.5 : 0)) * pw, cy = j * ph
      let u = cx / box.w, v = cy / box.h, fu = u, fv = v
      if (warp) { const [wu, wv] = warp(u, v); if (p.wTarget === 'field') { fu = wu; fv = wv } else { u = fu = wu; v = fv = wv } }
      if (u > 1.0001 || v > 1.0001 || !mask(u, v)) continue
      const f = field(fu, fv)
      if (f < (p.min ?? 0.05)) continue
      const s = f * (1 - (p.gap ?? 0.08)), x = box.x + u * box.w, y = box.y + v * box.h
      if (hex) poly(m, Array.from({ length: 6 }, (_, k) => { const a = (Math.PI / 3) * k + Math.PI / 6; return [x + Math.cos(a) * R * s, y + Math.sin(a) * R * s] }))
      else poly(m, [[x - (pw / 2) * s, y - (pw / 2) * s], [x + (pw / 2) * s, y - (pw / 2) * s], [x + (pw / 2) * s, y + (pw / 2) * s], [x - (pw / 2) * s, y + (pw / 2) * s]])
    }
  },
}
