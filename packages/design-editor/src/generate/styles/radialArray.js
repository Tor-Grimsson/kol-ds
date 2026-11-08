/* RADIAL ARRAY — `circles/` + `bands/beam` (plan 52 § 3.2).
 * The stripe array on polar axes. RAYS: N bars or wedges around a centre, from an inner to an outer
 * radius. RINGS: N concentric rings (or arcs of them) split into segments, tapering along the arc,
 * optionally zig-zagging. Every property ramps with the index like the stripes. The centre may sit off
 * the box (beam's arcs) — everything is clipped to the art box. Radii are in half the box's short side. */
import { clipToBox, poly } from '../geom.js'

const CURVES = {
  linear: (t) => t,
  ease: (t) => t * t * (3 - 2 * t),
  in: (t) => t * t,
  out: (t) => 1 - (1 - t) * (1 - t),
  hump: (t) => Math.sin(Math.PI * t),
  alt: (t, k) => k % 2,
}
const CURVE_OPTS = Object.keys(CURVES).map((v) => ({ value: v, label: { alt: 'Alternate' }[v] ?? v[0].toUpperCase() + v.slice(1) }))
const ramp = (key, label, min, max, a, b, section, extra = {}) => [
  { key: `${key}A`, label: `${label} A`, type: 'range', min, max, step: (max - min) / 400, default: a, section, ...extra },
  { key: `${key}B`, label: `${label} B`, type: 'range', min, max, step: (max - min) / 400, default: b, section, ...extra },
  { key: `${key}C`, label: `${label} curve`, type: 'select', default: 'linear', options: CURVE_OPTS, section, ...extra },
]
const at = (p, key, t, k) => {
  const a = p[`${key}A`] ?? 0, b = p[`${key}B`] ?? a
  return a + (b - a) * (CURVES[p[`${key}C`]] ?? CURVES.linear)(t, k)
}
const isRings = (l) => l.mode === 'rings'

export default {
  id: 'radialArray',
  label: 'Radial array',
  about: 'Radial array — rays or rings around a centre, each ramping in length, width and turn',
  /* sampled for Width by field: a ray's width along its length follows the field (ring's stepped rays) */
  sampled: true,
  warp: false,
  hold: ['mode', 'count'],
  schema: [
    { key: 'mode', label: 'Draw', type: 'segmented', default: 'rays', section: 'Radial', options: [{ value: 'rays', label: 'Rays' }, { value: 'rings', label: 'Rings' }] },
    { key: 'count', label: 'Count', type: 'range', min: 1, max: 240, step: 1, default: 36, animatable: false, section: 'Radial' },
    /* roll spans (rMin/rMax): a roll keeps the centre on the frame and the rings inside it — the sliders keep their reach */
    { key: 'cx', label: 'Centre X', type: 'range', min: -2, max: 3, step: 0.01, default: 0.5, rMin: 0.25, rMax: 0.75, section: 'Radial' },
    { key: 'cy', label: 'Centre Y', type: 'range', min: -2, max: 3, step: 0.01, default: 0.5, rMin: 0.25, rMax: 0.75, section: 'Radial' },
    { key: 'start', label: 'Start', type: 'range', min: -180, max: 180, step: 1, default: -90, format: (v) => `${v}°`, section: 'Radial' },
    { key: 'span', label: 'Span', type: 'range', min: 1, max: 360, step: 1, default: 360, format: (v) => `${v}°`, section: 'Radial' },
    { key: 'byField', label: 'Width by field', type: 'toggle', default: false, section: 'Rays', when: (l) => !isRings(l) },
    { key: 'raySample', label: 'Ray sample', type: 'range', min: 1, max: 40, step: 0.5, default: 4, format: (v) => `${v}px`, section: 'Rays', when: (l) => !isRings(l) && !!l.byField },
    { key: 'shape', label: 'Ray', type: 'segmented', default: 'bar', section: 'Rays', when: (l) => !isRings(l), options: [{ value: 'bar', label: 'Bar' }, { value: 'wedge', label: 'Wedge' }, { value: 'spike', label: 'Spike' }] },
    ...ramp('r0', 'Inner', 0, 4, 0.2, 0.2, 'Radii', { rMin: 0, rMax: 0.5 }),
    ...ramp('r1', 'Outer', 0, 12, 1, 1, 'Radii', { rMin: 0.6, rMax: 1.6 }),
    ...ramp('w', 'Width', 0, 1, 0.5, 0.5, 'Width', { format: (v) => `${Math.round(v * 100)}%` }),
    ...ramp('rot', 'Turn', -180, 180, 0, 0, 'Turn', { format: (v) => `${Math.round(v)}°` }),
    { key: 'segments', label: 'Segments', type: 'range', min: 1, max: 24, step: 1, default: 1, section: 'Rings', when: isRings },
    { key: 'segGap', label: 'Segment gap', type: 'range', min: 0, max: 0.9, step: 0.01, default: 0.1, section: 'Rings', when: (l) => isRings(l) && (l.segments ?? 1) > 1 },
    { key: 'taper', label: 'Taper', type: 'range', min: -1, max: 1, step: 0.01, default: 0, section: 'Rings', when: isRings },
    /* Taper keeps: the centre line (both edges move), the outer edge, or the inner edge — a crescent */
    { key: 'taperPow', label: 'Taper curve', type: 'range', min: 0.2, max: 6, step: 0.05, default: 1, section: 'Rings', when: isRings },
    { key: 'taperAlign', label: 'Taper keeps', type: 'segmented', default: 'centre', section: 'Rings', when: isRings,
      options: [{ value: 'centre', label: 'Centre' }, { value: 'outer', label: 'Outer' }, { value: 'inner', label: 'Inner' }] },
    { key: 'zig', label: 'Zigzag', type: 'range', min: 0, max: 1, step: 0.01, default: 0, section: 'Rings', when: isRings },
    { key: 'zigN', label: 'Zigzag points', type: 'range', min: 2, max: 32, step: 1, default: 8, section: 'Rings', when: (l) => isRings(l) && (l.zig ?? 0) > 0 },
  ],
  draw(m, p, box, { field, mask }) {
    const n = Math.max(1, Math.round(p.count ?? 36))
    const R = Math.min(box.w, box.h) / 2
    const cx = box.x + (p.cx ?? 0.5) * box.w, cy = box.y + (p.cy ?? 0.5) * box.h
    const a0 = ((p.start ?? -90) * Math.PI) / 180, span = ((p.span ?? 360) * Math.PI) / 180
    const full = (p.span ?? 360) >= 360
    const put = (pts) => poly(m, clipToBox(pts, box))
    const pol = (a, r) => [cx + Math.cos(a) * r, cy + Math.sin(a) * r]
    const tk = (k) => (n > 1 ? k / (n - 1) : 0)
    if (p.mode === 'rings') {
      const segs = Math.max(1, Math.round(p.segments ?? 1)), sg = p.segGap ?? 0.1
      const zig = p.zig ?? 0, zn = Math.round(p.zigN ?? 8)
      /* a triangle wave, +1 at whole periods and −1 between: the ring's points go out and in */
      const tri = (x) => 4 * Math.abs((((x % 1) + 1) % 1) - 0.5) - 1
      for (let k = 0; k < n; k++) {
        const t = tk(k)
        /* a ring's centre radius is its Outer ramp; Inner is unused for rings */
        const rr = at(p, 'r1', t, k) * R, w = at(p, 'w', t, k) * R
        if (w <= 0.05 || rr <= 0) continue
        const rot = (at(p, 'rot', t, k) * Math.PI) / 180
        const segSpan = span / segs
        for (let s = 0; s < segs; s++) {
          const b0 = a0 + rot + s * segSpan + (segs > 1 ? (segSpan * sg) / 2 : 0)
          const b1 = a0 + rot + (s + 1) * segSpan - (segs > 1 ? (segSpan * sg) / 2 : 0)
          const steps = Math.max(8, Math.ceil(((b1 - b0) * rr) / 6)) * (zig ? 4 : 1)
          /* the ring's centre line (zig-zagging if asked), then stroked: offset ± half the width along
             each point's normal, so a steep zig keeps the same stroke width as the round (emblem) */
          const cl = [], tws = []
          for (let q = 0; q <= steps; q++) {
            const a = b0 + ((b1 - b0) * q) / steps, u = q / steps
            const z = zig ? zig * R * 0.25 * tri(((a - a0) / (2 * Math.PI)) * zn) : 0
            cl.push(pol(a, rr + z))
            /* taper: width grows (+) or shrinks (−) along the arc — counterturn's crescents */
            /* Taper curve: > 1 holds the width longer before it narrows (an elliptical crescent) */
            tws.push(w * Math.max(0, 1 + (p.taper ?? 0) * (2 * u ** (p.taperPow ?? 1) - 1)))
          }
          const outer = [], inner = []
          for (let q = 0; q < cl.length; q++) {
            const a = cl[Math.max(0, q - 1)], b = cl[Math.min(cl.length - 1, q + 1)]
            let nx = -(b[1] - a[1]), ny = b[0] - a[0]
            const l = Math.hypot(nx, ny) || 1
            nx /= l; ny /= l
            /* point the normal away from the centre */
            if ((cl[q][0] - cx) * nx + (cl[q][1] - cy) * ny < 0) { nx = -nx; ny = -ny }
            const h = tws[q] / 2, h0 = w / 2
            /* the kept edge sits where the untapered stroke's edge would; the other edge carries the taper */
            const [ho, hi] = p.taperAlign === 'outer' ? [h0, 2 * h - h0] : p.taperAlign === 'inner' ? [2 * h - h0, h0] : [h, h]
            outer.push([cl[q][0] + nx * ho, cl[q][1] + ny * ho]); inner.push([cl[q][0] - nx * hi, cl[q][1] - ny * hi])
          }
          if (full && segs === 1) {
            /* a whole ring is two arcs; emit as two halves so neither ring crosses itself */
            const h = Math.floor(outer.length / 2)
            put([...outer.slice(0, h + 1), ...inner.slice(0, h + 1).reverse()])
            put([...outer.slice(h), ...inner.slice(h).reverse()])
          } else put([...outer, ...inner.reverse()])
        }
      }
      return
    }
    const step = full ? span / n : span / Math.max(1, n - 1)
    for (let k = 0; k < n; k++) {
      const t = tk(k)
      const a = a0 + k * step + (at(p, 'rot', t, k) * Math.PI) / 180
      const r0 = at(p, 'r0', t, k) * R, r1 = at(p, 'r1', t, k) * R
      if (r1 - r0 <= 0.3) continue
      const wf = at(p, 'w', t, k)
      if (wf <= 0) continue
      if (p.byField && field) {
        /* sampled along the ray: each step's half-width = Width × pitch arc at the outer radius × field */
        const ds = Math.max(1, p.raySample ?? 4), hwMax = (Math.abs(step) * r1 * wf) / 2
        const ux = Math.cos(a), uy = Math.sin(a), nx = -uy, ny = ux
        let run = []
        const flush = () => {
          if (run.length) {
            const left = run.map(([r, h]) => [cx + ux * r + nx * h, cy + uy * r + ny * h])
            const right = run.map(([r, h]) => [cx + ux * r - nx * h, cy + uy * r - ny * h]).reverse()
            put([...left, ...right])
          }
          run = []
        }
        for (let r = r0; r < r1; r += ds) {
          const re = Math.min(r1, r + ds), rm = (r + re) / 2
          const x = cx + ux * rm, y = cy + uy * rm
          const u = (x - box.x) / box.w, v = (y - box.y) / box.h
          const h = mask(u, v) ? hwMax * field(u, v) : 0
          if (h <= 0.05) { flush(); continue }
          run.push([r, h], [re, h])
        }
        flush()
      } else if (p.shape === 'spike') {
        /* a point at the inner radius, Width × the pitch's arc at the outer (sunburst, ring) */
        const hw = (Math.abs(step) * r1 * wf) / 2
        const ux = Math.cos(a), uy = Math.sin(a), nx = -uy, ny = ux
        put([[cx + ux * r0, cy + uy * r0], [cx + ux * r1 + nx * hw, cy + uy * r1 + ny * hw], [cx + ux * r1 - nx * hw, cy + uy * r1 - ny * hw]])
      } else if (p.shape === 'wedge') {
        /* constant angle: half the pitch × Width each side */
        const h = (Math.abs(step) * wf) / 2
        put([pol(a - h, r0), pol(a - h, r1), pol(a + h, r1), pol(a + h, r0)])
      } else {
        /* constant width: Width × the pitch's arc length at the OUTER radius */
        const hw = (Math.abs(step) * r1 * wf) / 2
        const ux = Math.cos(a), uy = Math.sin(a), nx = -uy, ny = ux
        put([
          [cx + ux * r0 + nx * hw, cy + uy * r0 + ny * hw], [cx + ux * r1 + nx * hw, cy + uy * r1 + ny * hw],
          [cx + ux * r1 - nx * hw, cy + uy * r1 - ny * hw], [cx + ux * r0 - nx * hw, cy + uy * r0 - ny * hw],
        ])
      }
    }
  },
}
