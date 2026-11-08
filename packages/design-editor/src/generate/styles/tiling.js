/* TILING — `patterns/` bricks · chessboard · columns · maze (plan 52 § 3.4).
 * A layout of cells — Bricks (rows offset by half, lengths varied), Checker, Columns (stacked blocks) —
 * each cell filled with Fill A or Fill B: solid, a dot texture, a line texture, or nothing. Which fill: a
 * checker, by row, by column, or a seeded coin. Frame draws a border round the board (chessboard).
 * Maze draws nested rectangle outlines that step inward. */
import { circle, rect, compound } from '../geom.js'

const rnd = (i, seed) => {
  let h = Math.imul(i + 1, 2654435761) ^ Math.imul(seed + 3, 40503)
  h = Math.imul(h ^ (h >>> 15), 2246822519)
  h ^= h >>> 13
  return (h >>> 0) / 4294967296
}
const FILLS = ['solid', 'dots', 'lines', 'hlines', 'none'].map((v) => ({ value: v, label: { hlines: 'Rows of lines' }[v] ?? v[0].toUpperCase() + v.slice(1) }))

function fill(m, kind, x, y, w, h, tp, ts) {
  if (w <= 0 || h <= 0) return
  if (kind === 'solid') rect(m, x, y, w, h)
  else if (kind === 'dots') {
    for (let yy = y + tp / 2; yy < y + h; yy += tp) for (let xx = x + tp / 2; xx < x + w; xx += tp) circle(m, xx, yy, ts * tp * 0.5)
  } else if (kind === 'lines') {
    for (let xx = x; xx < x + w - 0.1; xx += tp) rect(m, xx, y, Math.min(ts * tp, x + w - xx), h)
  } else if (kind === 'hlines') {
    for (let yy = y; yy < y + h - 0.1; yy += tp) rect(m, x, yy, w, Math.min(ts * tp, y + h - yy))
  }
}

export default {
  id: 'tiling',
  label: 'Tiling',
  about: 'Tiling — bricks, a checker, columns or a maze, each cell solid or textured',
  sampled: false,
  hold: ['layout', 'cols', 'rows'],
  schema: [
    { key: 'layout', label: 'Layout', type: 'select', default: 'bricks', section: 'Tiles',
      options: ['bricks', 'checker', 'columns', 'maze'].map((v) => ({ value: v, label: v[0].toUpperCase() + v.slice(1) })) },
    { key: 'cols', label: 'Columns', type: 'range', min: 1, max: 40, step: 1, default: 4, animatable: false, section: 'Tiles' },
    { key: 'rows', label: 'Rows', type: 'range', min: 1, max: 60, step: 1, default: 6, animatable: false, section: 'Tiles' },
    { key: 'gap', label: 'Gap', type: 'range', min: 0, max: 0.4, step: 0.005, default: 0.04, section: 'Tiles' },
    { key: 'vary', label: 'Vary length', type: 'range', min: 0, max: 0.9, step: 0.01, default: 0.4, section: 'Tiles', when: (l) => (l.layout ?? 'bricks') === 'bricks' },
    { key: 'shift', label: 'Shift odd columns', type: 'range', min: 0, max: 1, step: 0.01, default: 0, format: (v) => `${Math.round(v * 100)}%`, section: 'Tiles', when: (l) => l.layout === 'columns' },
    { key: 'fillA', label: 'Fill A', type: 'select', default: 'solid', options: FILLS, section: 'Fill' },
    { key: 'fillB', label: 'Fill B', type: 'select', default: 'dots', options: FILLS, section: 'Fill' },
    { key: 'alt', label: 'Alternate', type: 'select', default: 'checker', section: 'Fill',
      options: ['checker', 'row', 'col', 'random'].map((v) => ({ value: v, label: { col: 'Column' }[v] ?? v[0].toUpperCase() + v.slice(1) })) },
    { key: 'tex', label: 'Texture pitch', type: 'range', min: 2, max: 40, step: 0.5, default: 8, format: (v) => `${v}px`, section: 'Fill' },
    { key: 'texSize', label: 'Texture size', type: 'range', min: 0.05, max: 1, step: 0.01, default: 0.45, section: 'Fill' },
    { key: 'frame', label: 'Frame', type: 'range', min: 0, max: 0.1, step: 0.002, default: 0, format: (v) => (v ? `${(v * 100).toFixed(1)}%` : 'Off'), section: 'Fill' },
    { key: 'seed', label: 'Seed', type: 'range', min: 1, max: 99, step: 1, default: 1, section: 'Fill' },
  ],
  draw(m, p, box) {
    const cols = Math.max(1, Math.round(p.cols ?? 4)), rows = Math.max(1, Math.round(p.rows ?? 6))
    const seed = p.seed ?? 1, tp = p.tex ?? 8, ts = p.texSize ?? 0.45
    const which = (i, j, k) => {
      const b = p.alt === 'row' ? j % 2 : p.alt === 'col' ? i % 2 : p.alt === 'random' ? rnd(k, seed) < 0.5 : (i + j) % 2
      return b ? (p.fillB ?? 'dots') : (p.fillA ?? 'solid')
    }
    let bx = box
    const fr = (p.frame ?? 0) * Math.min(box.w, box.h)
    if (fr > 0) {
      /* the frame: a solid border, the board inside it */
      compound(m, [
        [[box.x, box.y], [box.x + box.w, box.y], [box.x + box.w, box.y + box.h], [box.x, box.y + box.h]],
        [[box.x + fr, box.y + fr], [box.x + box.w - fr, box.y + fr], [box.x + box.w - fr, box.y + box.h - fr], [box.x + fr, box.y + box.h - fr]],
      ])
      bx = { x: box.x + fr * 1.5, y: box.y + fr * 1.5, w: box.w - fr * 3, h: box.h - fr * 3 }
    }
    const cw = bx.w / cols, ch = bx.h / rows
    const g = (p.gap ?? 0.04) * Math.min(cw, ch)
    const layout = p.layout ?? 'bricks'
    if (layout === 'maze') {
      /* nested outlines stepping inward from a seeded corner each time */
      const lw = Math.max(1, tp * ts * 0.4)
      let x0 = bx.x, y0 = bx.y, x1 = bx.x + bx.w, y1 = bx.y + bx.h
      for (let k = 0; k < rows && x1 - x0 > 4 * lw && y1 - y0 > 4 * lw; k++) {
        compound(m, [
          [[x0, y0], [x1, y0], [x1, y1], [x0, y1]],
          [[x0 + lw, y0 + lw], [x1 - lw, y0 + lw], [x1 - lw, y1 - lw], [x0 + lw, y1 - lw]],
        ])
        const st = Math.min(x1 - x0, y1 - y0) / (rows - k + 1)
        const r = rnd(k, seed)
        x0 += st * (r < 0.5 ? 1 : 0.4); y0 += st * (r < 0.25 || r > 0.75 ? 1 : 0.5)
        x1 -= st * (r >= 0.5 ? 1 : 0.4); y1 -= st * (r >= 0.25 && r <= 0.75 ? 1 : 0.5)
      }
      return
    }
    let k = 0
    for (let j = 0; j < rows; j++) {
      if (layout === 'bricks') {
        /* lengths varied by a seeded amount around the column width, the row offset by half */
        let x = bx.x - (j % 2 ? cw / 2 : 0), i = 0
        while (x < bx.x + bx.w) {
          const len = cw * (1 + (p.vary ?? 0.4) * (rnd(k * 7 + j, seed) * 2 - 1))
          const xa = Math.max(bx.x, x), xb = Math.min(bx.x + bx.w, x + len)
          fill(m, which(i, j, k), xa + g / 2, bx.y + j * ch + g / 2, xb - xa - g, ch - g, tp, ts)
          x += len; i++; k++
        }
        continue
      }
      for (let i = 0; i < cols; i++, k++) {
        /* columns: odd columns slide down by Shift of a block, wrapping the overhang back to the top */
        const sh = layout === 'columns' && i % 2 ? (p.shift ?? 0) * ch : 0
        const x = bx.x + i * cw
        let y = bx.y + j * ch + sh
        if (sh && y + ch > bx.y + bx.h + 0.01) {
          const kind = which(0, j + (i % 2), k), gx = (cw * (p.gap ?? 0.04)) / 2, over = y + ch - (bx.y + bx.h)
          fill(m, kind, x + gx, y, cw - 2 * gx, ch - over, tp, ts)
          fill(m, kind, x + gx, bx.y, cw - 2 * gx, over, tp, ts)
          continue
        }
        /* columns: one strip per column, blocks stacked, the fill alternating down each */
        const kind = layout === 'columns' ? which(0, j + (i % 2), k) : which(i, j, k)
        /* columns: Gap is the space between columns (a share of the column), blocks butt vertically */
        const gx = layout === 'columns' ? (cw * (p.gap ?? 0.04)) / 2 : g / 2
        fill(m, kind, x + gx, y + (layout === 'columns' ? 0 : g / 2), cw - 2 * gx, ch - (layout === 'columns' ? 0 : g), tp, ts)
      }
    }
  },
}
