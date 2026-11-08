/* SYMBOL GRID — `data/` (plan 52 § 3.3).
 * A grid of small symbols from an alphabet: | bar · . dot · o ring · x cross · / slash · - dash · # block
 * · [ box · ^ saw. Which symbol a cell draws: the field's level (an ordered alphabet), a seeded pick, or
 * one per row. Bars take their HEIGHT from the field; a wave lifts each column's bars (afterimage).
 * Extras: Accents (an occasional long block), a Track (a sine across the sheet whose cells draw a box —
 * carrier), Rules (loose hairlines), and Plot (grid + sampled curves with dots — test). */
import { circle, compound, rect, poly } from '../geom.js'

const rnd = (i, seed) => {
  let h = Math.imul(i + 1, 2654435761) ^ Math.imul(seed + 7, 40503)
  h = Math.imul(h ^ (h >>> 15), 2246822519)
  h ^= h >>> 13
  return (h >>> 0) / 4294967296
}
/* a line segment as a thin quad */
const seg = (m, x0, y0, x1, y1, w) => {
  const dx = x1 - x0, dy = y1 - y0, l = Math.hypot(dx, dy) || 1, nx = (-dy / l) * (w / 2), ny = (dx / l) * (w / 2)
  poly(m, [[x0 + nx, y0 + ny], [x1 + nx, y1 + ny], [x1 - nx, y1 - ny], [x0 - nx, y0 - ny]])
}
const ring = (m, x, y, r, w) => {
  const o = [], i = []
  for (let k = 0; k < 24; k++) { const a = (k / 24) * 2 * Math.PI; o.push([x + Math.cos(a) * r, y + Math.sin(a) * r]); i.push([x + Math.cos(a) * (r - w), y + Math.sin(a) * (r - w)]) }
  compound(m, [o, i])
}
const boxOutline = (m, x, y, hw, hh, w) => compound(m, [
  [[x - hw, y - hh], [x + hw, y - hh], [x + hw, y + hh], [x - hw, y + hh]],
  [[x - hw + w, y - hh + w], [x + hw - w, y - hh + w], [x + hw - w, y + hh - w], [x - hw + w, y + hh - w]],
])

/* draw one symbol in a cell of size cw × ch at centre (x, y); f = the field there, lw = stroke */
function symbol(m, c, x, y, cw, ch, f, lw) {
  const s = Math.min(cw, ch)
  switch (c) {
    case '|': { const h = ch * 0.9 * Math.max(0.08, f); rect(m, x - lw, y - h / 2, lw * 2, h); break }
    case '.': circle(m, x, y, s * 0.12); break
    case 'o': ring(m, x, y, s * 0.22, lw); break
    case 'x': seg(m, x - s * 0.2, y - s * 0.2, x + s * 0.2, y + s * 0.2, lw); seg(m, x - s * 0.2, y + s * 0.2, x + s * 0.2, y - s * 0.2, lw); break
    case '/': seg(m, x - s * 0.3, y + s * 0.3, x + s * 0.3, y - s * 0.3, lw); break
    case '-': rect(m, x - cw * 0.35, y - lw / 2, cw * 0.7, lw); break
    case '#': rect(m, x - cw * 0.3, y - ch * 0.18, cw * 0.6, ch * 0.36); break
    case '[': boxOutline(m, x, y, cw * 0.35, ch * 0.25, lw); break
    case '^': seg(m, x - cw * 0.45, y + s * 0.25, x + cw * 0.3, y + s * 0.25, lw); seg(m, x + cw * 0.3, y + s * 0.25, x + cw * 0.45, y - s * 0.25, lw); break
    default: break
  }
}

export default {
  id: 'symbolGrid',
  label: 'Symbol grid',
  about: 'Symbol grid — small symbols in a grid, picked and sized by a field, with tracks, accents and plots',
  sampled: true,
  warp: false,
  hold: ['set', 'pick', 'cols', 'rows', 'plot'],
  schema: [
    { key: 'set', label: 'Symbols', type: 'text', default: '|', placeholder: '| . o x / - # [ ^', section: 'Symbols' },
    { key: 'pick', label: 'Pick by', type: 'segmented', default: 'field', section: 'Symbols',
      options: [{ value: 'field', label: 'Field' }, { value: 'random', label: 'Random' }, { value: 'row', label: 'Row' }] },
    { key: 'empty', label: 'Empty below', type: 'range', min: 0, max: 1, step: 0.01, default: 0.05, section: 'Symbols' },
    { key: 'cols', label: 'Columns', type: 'range', min: 2, max: 160, step: 1, default: 40, animatable: false, section: 'Grid' },
    { key: 'rows', label: 'Rows', type: 'range', min: 2, max: 200, step: 1, default: 40, animatable: false, section: 'Grid' },
    { key: 'stroke', label: 'Stroke', type: 'range', min: 0.5, max: 8, step: 0.1, default: 2, format: (v) => `${v}px`, section: 'Grid' },
    { key: 'wave', label: 'Wave', type: 'range', min: 0, max: 2, step: 0.01, default: 0, format: (v) => `${v} rows`, section: 'Grid' },
    { key: 'waveFreq', label: 'Waves', type: 'range', min: 0, max: 12, step: 0.05, default: 2, section: 'Grid', when: (l) => (l.wave ?? 0) > 0 },
    /* desync (afterimage): each row's wave its own phase, each tick its own fine offset, ragged row ends */
    { key: 'waveDesync', label: 'Row desync', type: 'range', min: 0, max: 1, step: 0.01, default: 0, format: (v) => `${Math.round(v * 100)}%`, section: 'Grid', when: (l) => (l.wave ?? 0) > 0 },
    { key: 'grain', label: 'Grain', type: 'range', min: 0, max: 1, step: 0.01, default: 0, format: (v) => `${Math.round(v * 100)}% row`, section: 'Grid' },
    { key: 'ragged', label: 'Ragged ends', type: 'range', min: 0, max: 0.5, step: 0.005, default: 0, format: (v) => `${Math.round(v * 100)}%`, section: 'Grid' },
    { key: 'widthBy', label: 'Width by field', type: 'range', min: 0, max: 1, step: 0.01, default: 0, format: (v) => `${Math.round(v * 100)}%`, section: 'Grid' },
    { key: 'accent', label: 'Accents', type: 'range', min: 0, max: 0.2, step: 0.002, default: 0, format: (v) => `${(v * 100).toFixed(1)}%`, section: 'Extras' },
    { key: 'accentLen', label: 'Accent length', type: 'range', min: 1, max: 12, step: 1, default: 3, section: 'Extras', when: (l) => (l.accent ?? 0) > 0 },
    { key: 'track', label: 'Track', type: 'range', min: 0, max: 0.5, step: 0.01, default: 0, format: (v) => (v ? `${Math.round(v * 100)}%` : 'Off'), section: 'Extras' },
    { key: 'trackFreq', label: 'Track waves', type: 'range', min: 0.1, max: 6, step: 0.05, default: 1, section: 'Extras', when: (l) => (l.track ?? 0) > 0 },
    { key: 'trackPhase', label: 'Track phase', type: 'range', min: 0, max: 1, step: 0.01, default: 0, section: 'Extras', when: (l) => (l.track ?? 0) > 0 },
    { key: 'rules', label: 'Rules', type: 'range', min: 0, max: 40, step: 1, default: 0, section: 'Extras' },
    { key: 'plot', label: 'Plot', type: 'toggle', default: false, section: 'Plot' },
    { key: 'gridLine', label: 'Grid line', type: 'range', min: 0.1, max: 4, step: 0.05, default: 0.5, format: (v) => `${v}px`, section: 'Plot', when: (l) => !!l.plot },
    /* each curve its own wave over the fixed grid — height, waves, phase, centre, dot size, dot every */
    ...[1, 2, 3].flatMap((i) => [
      ['A', 'height', 0, 0.5, [0.4, 0.2, 0.15][i - 1], 0.005], ['F', 'waves', 0.25, 4, [1.85, 1.3, 1][i - 1], 0.01],
      ['P', 'phase', -180, 180, 0, 1], ['Y', 'centre', 0, 1, 0.5, 0.005], ['D', 'dot', 0, 12, [2, 4, 6][i - 1], 0.1], ['N', 'dots across', 2, 160, 40, 1],
    ].map(([c, lab, mn, mx, d, st]) => ({ key: `c${i}${c}`, label: `Curve ${i} ${lab}`, type: 'range', min: mn, max: mx, step: st, default: d, section: 'Plot', when: (l) => !!l.plot && (l.curves ?? 3) >= i }))),
    { key: 'curves', label: 'Curves', type: 'range', min: 1, max: 6, step: 1, default: 3, section: 'Plot', when: (l) => !!l.plot },
    { key: 'seed', label: 'Seed', type: 'range', min: 1, max: 99, step: 1, default: 1, section: 'Grid' },
  ],
  draw(m, p, box, { field, mask }) {
    const cols = Math.max(1, Math.round(p.cols ?? 40)), rows = Math.max(1, Math.round(p.rows ?? 40))
    const cw = box.w / cols, ch = box.h / rows
    const lw = p.stroke ?? 2, seed = p.seed ?? 1
    if (p.plot) {
      /* test: hairline grid, then curves sampled per column with a dot at each sample */
      const gw = p.gridLine ?? 0.5
      for (let i = 0; i <= cols; i++) rect(m, box.x + i * cw - gw / 2, box.y, gw, box.h)
      for (let j = 0; j <= rows; j++) rect(m, box.x, box.y + j * ch - gw / 2, box.w, gw)
      /* the curves: each its own sine over the FIXED grid, a line plus a dot every N grid columns */
      const n = Math.max(1, Math.min(3, Math.round(p.curves ?? 3)))
      for (let c = 1; c <= n; c++) {
        const amp = p[`c${c}A`] ?? 0.2, fr = p[`c${c}F`] ?? 1, ph = ((p[`c${c}P`] ?? 0) * Math.PI) / 180, cy = p[`c${c}Y`] ?? 0.5
        const dot = p[`c${c}D`] ?? 3, nd = Math.max(1, Math.round(p[`c${c}N`] ?? 40))
        const y = (u) => box.y + box.h * (cy - amp * Math.sin(2 * Math.PI * u * fr + ph))
        let prev = null
        const N = cols * 4
        for (let i = 0; i <= N; i++) {
          const u = i / N, x = box.x + u * box.w, yy = y(u)
          if (prev) seg(m, prev[0], prev[1], x, yy, lw)
          prev = [x, yy]
        }
        for (let i = 0; i <= nd; i++) { const u = i / nd; circle(m, box.x + u * box.w, y(u), dot) }
      }
      return
    }
    const set = (p.set || '|').replace(/\s+/g, '').split('')
    const empty = p.empty ?? 0.05
    const amp = (p.wave ?? 0) * ch
    const tr = p.track ?? 0
    const rag = p.ragged ?? 0, grain = (p.grain ?? 0) * ch, wb = p.widthBy ?? 0
    for (let j = 0; j < rows; j++) {
      const ph = j * 0.07 + (p.waveDesync ?? 0) * rnd(j + 701, seed)
      const u0 = rag * rnd(j + 801, seed), u1 = 1 - rag * rnd(j + 901, seed)
      for (let i = 0; i < cols; i++) {
        const k = j * cols + i
        const u = (i + 0.5) / cols
        if (u < u0 || u > u1) continue
        const lift = (amp ? amp * Math.sin(2 * Math.PI * (u * (p.waveFreq ?? 2) + ph)) : 0) + (grain ? grain * (rnd(k + 1001, seed) - 0.5) : 0)
        const x = box.x + (i + 0.5) * cw, y = box.y + (j + 0.5) * ch + lift
        const v = (y - box.y) / box.h
        if (!mask(u, v)) continue
        const f = field(u, v)
        /* an accent: a long block from this cell, the cells it covers stay empty */
        if ((p.accent ?? 0) > 0 && rnd(k + 31, seed) < p.accent) {
          const len = Math.round(p.accentLen ?? 3)
          rect(m, x - cw * 0.45, y - ch * 0.18, cw * (len - 0.1), ch * 0.36)
          i += len - 1
          continue
        }
        /* the track: cells within half a row of the sine draw a box */
        if (tr > 0) {
          const ty = 0.5 + tr * Math.sin(2 * Math.PI * (u * (p.trackFreq ?? 1) + (p.trackPhase ?? 0)))
          if (Math.abs(ty - v) * rows < 0.5) { boxOutline(m, x, y, Math.min(cw, ch) * 0.35, Math.min(cw, ch) * 0.35, lw); continue }
        }
        if (f < empty) continue
        const c = p.pick === 'random' ? set[Math.floor(rnd(k, seed) * set.length)]
          : p.pick === 'row' ? set[j % set.length]
            : set[Math.min(set.length - 1, Math.floor(f * set.length))]
        symbol(m, c, x, y, cw, ch, f, wb ? lw * (1 - wb + wb * f) : lw)
      }
    }
    /* rules: loose hairlines, some across, some down, each a few cells long */
    for (let r = 0; r < Math.round(p.rules ?? 0); r++) {
      const vert = rnd(r + 101, seed) < 0.5
      const x = box.x + Math.floor(rnd(r + 201, seed) * cols) * cw, y = box.y + Math.floor(rnd(r + 301, seed) * rows) * ch
      const len = (3 + Math.floor(rnd(r + 401, seed) * 12)) * (vert ? ch : cw)
      if (vert) rect(m, x - lw / 4, y, lw / 2, Math.min(len, box.y + box.h - y))
      else rect(m, x, y - lw / 4, Math.min(len, box.x + box.w - x), lw / 2)
    }
  },
}
