/* STIPPLE — Half Line's stippling (plan 53 § 4.2). Seeded blue noise: a Poisson-disk set at Spacing (no two
 * points closer than it, Bridson's method), and each point kept with the field's brightness as its chance —
 * density follows the picture while the even, unclumped grain stays. Dot size can follow the field too. */
import { circle } from '../geom.js'

const rng = (seed) => {
  let s = (seed * 2654435761) >>> 0 || 1
  return () => { s ^= s << 13; s ^= s >>> 17; s ^= s << 5; return ((s >>> 0) % 1e9) / 1e9 }
}

export function poisson(w, h, r, seed, k = 20) {
  const rand = rng(seed), cell = r / Math.SQRT2
  const gw = Math.ceil(w / cell), gh = Math.ceil(h / cell), grid = new Int32Array(gw * gh).fill(-1)
  const pts = [], active = []
  const add = (x, y) => { pts.push([x, y]); active.push(pts.length - 1); grid[Math.floor(y / cell) * gw + Math.floor(x / cell)] = pts.length - 1 }
  add(rand() * w, rand() * h)
  while (active.length) {
    const ai = Math.floor(rand() * active.length), [px, py] = pts[active[ai]]
    let found = false
    for (let t = 0; t < k; t++) {
      const a = rand() * 2 * Math.PI, d = r * (1 + rand())
      const x = px + Math.cos(a) * d, y = py + Math.sin(a) * d
      if (x < 0 || y < 0 || x >= w || y >= h) continue
      const gx = Math.floor(x / cell), gy = Math.floor(y / cell)
      let ok = true
      for (let j = Math.max(0, gy - 2); j <= Math.min(gh - 1, gy + 2) && ok; j++) for (let i = Math.max(0, gx - 2); i <= Math.min(gw - 1, gx + 2); i++) {
        const q = grid[j * gw + i]
        if (q >= 0 && (pts[q][0] - x) ** 2 + (pts[q][1] - y) ** 2 < r * r) { ok = false; break }
      }
      if (ok) { add(x, y); found = true; break }
    }
    if (!found) active.splice(ai, 1)
  }
  return pts
}

export default {
  id: 'stipple',
  label: 'Stipple',
  about: 'Stipple — blue-noise dots, their density (and size) following a field',
  sampled: true,
  hold: ['spacing'],
  schema: [
    { key: 'spacing', label: 'Spacing', type: 'range', min: 2, max: 60, step: 0.5, default: 8, format: (v) => `${v}px`, section: 'Stipple' },
    { key: 'dot', label: 'Dot', type: 'range', min: 0.05, max: 1, step: 0.01, default: 0.35, format: (v) => `${Math.round(v * 100)}% spacing`, section: 'Stipple' },
    { key: 'sizeBy', label: 'Size by field', type: 'toggle', default: false, section: 'Stipple' },
    { key: 'gamma', label: 'Density curve', type: 'range', min: 0.2, max: 4, step: 0.05, default: 1, section: 'Stipple' },
    { key: 'seed', label: 'Seed', type: 'range', min: 1, max: 99, step: 1, default: 1, section: 'Stipple' },
  ],
  draw(m, p, box, { field, mask, warp }) {
    const sp = Math.max(2, p.spacing ?? 8), seed = p.seed ?? 1, rand = rng(seed + 101)
    for (const [x, y] of poisson(box.w, box.h, sp, seed)) {
      let u = x / box.w, v = y / box.h, fu = u, fv = v
      if (warp) { const [wu, wv] = warp(u, v); if (p.wTarget === 'field') { fu = wu; fv = wv } else { u = fu = wu; v = fv = wv } }
      if (!mask(u, v)) continue
      const f = field(fu, fv)
      if (rand() >= f ** (p.gamma ?? 1)) continue
      const r = sp * (p.dot ?? 0.35) * (p.sizeBy ? 0.3 + 0.7 * f : 1)
      circle(m, box.x + u * box.w, box.y + v * box.h, r)
    }
  },
}
