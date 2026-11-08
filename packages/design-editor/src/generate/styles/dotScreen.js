/* DOT SCREEN — `dots/` (plan 52 § 2.2).
 * A grid of dots whose RADIUS follows the field. Size is the largest dot's diameter as a share of the
 * pitch; past 100 % neighbours overlap and the union leaves diamond holes (warp) — no special case. The
 * warp moves each grid point before it is sampled, so the field and mask read the bent grid. A dot
 * whose centre leaves the mask is not drawn. */
import { circle, rotRect, poly } from '../geom.js'

export default {
  id: 'dotScreen',
  label: 'Dot screen',
  about: 'Dot screen — a grid of dots sized by a field, the grid bent by a warp',
  sampled: true,
  hold: ['cols', 'rows', 'shape'],
  schema: [
    { key: 'cols', label: 'Columns', type: 'range', min: 4, max: 160, step: 1, default: 40, animatable: false, section: 'Dots' },
    { key: 'rows', label: 'Rows', type: 'range', min: 0, max: 200, step: 1, default: 0, animatable: false, format: (v) => (v ? `${v}` : 'Square'), section: 'Dots' },
    { key: 'size', label: 'Size', type: 'range', min: 0.05, max: 1.8, step: 0.01, default: 0.9, format: (v) => `${Math.round(v * 100)}%`, section: 'Dots' },
    { key: 'min', label: 'Smallest', type: 'range', min: 0, max: 1, step: 0.01, default: 0.05, format: (v) => `${Math.round(v * 100)}%`, section: 'Dots' },
    /* Floor: no dot smaller than this share of the largest — the faint grid under interference's bands */
    { key: 'floor', label: 'Floor', type: 'range', min: 0, max: 0.6, step: 0.01, default: 0, format: (v) => `${Math.round(v * 100)}%`, section: 'Dots' },
    { key: 'shape', label: 'Shape', type: 'segmented', default: 'circle', options: [{ value: 'circle', label: 'Circle' }, { value: 'square', label: 'Square' }, { value: 'diamond', label: 'Diamond' }], section: 'Dots' },
    { key: 'stretch', label: 'Stretch', type: 'range', min: 0.2, max: 5, step: 0.05, default: 1, format: (v) => `${v}×`, section: 'Dots' },
    /* Edges: the outer dots touch the frame (his Figma grids), instead of sitting half a pitch in */
    { key: 'justify', label: 'Edge to edge', type: 'toggle', default: false, section: 'Dots' },
    { key: 'stagger', label: 'Stagger', type: 'toggle', default: false, section: 'Dots' },
  ],
  draw(m, p, box, { field, mask, warp }) {
    const cols = Math.max(1, Math.round(p.cols ?? 40))
    const pitchX = box.w / cols
    const rows = Math.max(1, Math.round(p.rows || box.h / pitchX))
    const pitchY = box.h / rows
    const pitch = Math.min(pitchX, pitchY)
    const maxR = (pitch * (p.size ?? 0.9)) / 2
    const minF = p.min ?? 0.05
    const st = p.stretch ?? 1
    /* a stretched dot keeps its area's scale: width shrinks as height grows, within the pitch */
    const sx = st >= 1 ? 1 / Math.sqrt(st) : 1, sy = st >= 1 ? Math.sqrt(st) : st
    const shape = p.shape ?? 'circle'
    for (let j = 0; j < rows; j++) {
      const off = p.stagger && j % 2 ? 0.5 : 0
      for (let i = 0; i < cols + (off ? -1 : 0); i++) {
        let u = (i + 0.5 + off) / cols, v = (j + 0.5) / rows
        if (p.justify) {
          const mu = (maxR * sx) / box.w, mv = (maxR * sy) / box.h
          u = mu + ((i + off) * (1 - 2 * mu)) / Math.max(1, cols - 1)
          v = mv + (j * (1 - 2 * mv)) / Math.max(1, rows - 1)
        }
        /* Grid: the dot moves and reads the field where it lands; Field: the dot stays, the field bends */
        let fu = u, fv = v
        if (warp) {
          const [wu, wv] = warp(u, v)
          if (p.wTarget === 'field') { fu = wu; fv = wv } else { u = fu = wu; v = fv = wv }
        }
        if (!mask(u, v)) continue
        let f = field(fu, fv)
        const fl = p.floor ?? 0
        if (fl > 0) f = fl + (1 - fl) * f
        else if (f < minF) continue
        const r = maxR * f * sx, ry = maxR * f * sy
        const x = box.x + u * box.w, y = box.y + v * box.h
        if (shape === 'square') rotRect(m, x, y, 2 * r, 2 * ry, 0)
        else if (shape === 'diamond') poly(m, [[x, y - ry * 1.25], [x + r * 1.25, y], [x, y + ry * 1.25], [x - r * 1.25, y]])
        else circle(m, x, y, r, ry)
      }
    }
  },
}
