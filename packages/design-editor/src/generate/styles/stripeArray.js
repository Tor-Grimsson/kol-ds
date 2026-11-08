/* STRIPE ARRAY — `bands/` (plan 52 § 3.1).
 * N strips side by side. Each property RAMPS with the strip's index t = 0…1, from its A value to its B
 * value along a curve (linear, ease, a hump that peaks mid-way, a dip): width, the gap after it, where it
 * starts and ends, how far its ends shear, how much it waves, how far it bends. No 2D field — the strip
 * index is the field. Dashes split a strip, an optional hairline links the dashes (bands/bars). */
import { poly, clipToBox } from '../geom.js'
import { fbm } from '../field.js'

const CURVES = {
  linear: (t) => t,
  ease: (t) => t * t * (3 - 2 * t),
  in: (t) => t * t,
  out: (t) => 1 - (1 - t) * (1 - t),
  hump: (t) => Math.sin(Math.PI * t),
  dip: (t) => 1 - Math.sin(Math.PI * t),
  wave: (t) => 0.5 - 0.5 * Math.cos(2 * Math.PI * t),
  sine: (t) => 0.5 + 0.5 * Math.sin(2 * Math.PI * t),
  bell: (t) => Math.exp(-(((t - 0.5) / 0.22) ** 2)),
  /* only the last of a run takes B — the big gap closing a group (substances) */
  last: (t) => (t >= 1 ? 1 : 0),
}
const CURVE_OPTS = Object.keys(CURVES).map((v) => ({ value: v, label: v[0].toUpperCase() + v.slice(1) }))

/* a ramped property: A, B and its curve under a prefix */
const ramp = (key, label, min, max, a, b, section, extra = {}) => [
  { key: `${key}A`, label: `${label} A`, type: 'range', min, max, step: (max - min) / 200, default: a, section, ...extra },
  { key: `${key}B`, label: `${label} B`, type: 'range', min, max, step: (max - min) / 200, default: b, section, ...extra },
  { key: `${key}C`, label: `${label} curve`, type: 'select', default: 'linear', options: CURVE_OPTS, section, ...extra },
]
const at = (p, key, t) => {
  const a = p[`${key}A`] ?? 0, b = p[`${key}B`] ?? a
  return a + (b - a) * (CURVES[p[`${key}C`]] ?? CURVES.linear)(t)
}

export default {
  id: 'stripeArray',
  label: 'Stripe array',
  about: 'Stripe array — strips whose width, gap, length, shear, wave and bend ramp from first to last',
  sampled: false,
  hold: ['count', 'orient'],
  schema: [
    { key: 'orient', label: 'Strips', type: 'segmented', default: 'h', options: [{ value: 'h', label: 'Rows' }, { value: 'v', label: 'Columns' }], section: 'Strips' },
    { key: 'count', label: 'Count', type: 'range', min: 1, max: 120, step: 1, default: 16, animatable: false, section: 'Strips' },
    { key: 'angle', label: 'Angle', type: 'range', min: -90, max: 90, step: 1, default: 0, format: (v) => `${v}°`, section: 'Strips' },
    /* Period: the ramps repeat every N strips (substances' groups of one wide and four thin) */
    { key: 'period', label: 'Period', type: 'range', min: 0, max: 40, step: 1, default: 0, format: (v) => (v ? `${v}` : 'All'), section: 'Strips' },
    /* Lead: the first strip of each period is this many times wider (air's header band) */
    { key: 'lead', label: 'Lead', type: 'range', min: 0.2, max: 60, step: 0.05, default: 1, format: (v) => `${v}×`, section: 'Strips' },
    /* a share of the pitch when even (shown as %); packed / units presets carry it in their own units (shown raw) */
    ...ramp('w', 'Width', 0, 1, 0.5, 0.5, 'Strips', { format: (v) => (v > 1 ? `${+v.toFixed(2)}` : `${Math.round(v * 100)}%`) }),
    ...ramp('s', 'Start', -0.5, 1, 0, 0, 'Length'),
    ...ramp('e', 'End', 0, 1.5, 1, 1, 'Length'),
    ...ramp('k', 'Shear', -3, 3, 0, 0, 'Length'),
    ...ramp('a', 'Wave', 0, 0.3, 0, 0, 'Wave'),
    { key: 'freq', label: 'Waves', type: 'range', min: 0, max: 12, step: 0.05, default: 3, section: 'Wave' },
    ...ramp('ph', 'Phase', -1, 1, 0, 0, 'Wave'),
    ...ramp('b', 'Bend', -0.6, 0.6, 0, 0, 'Bend'),
    { key: 'dash', label: 'Dash', type: 'range', min: 0, max: 1, step: 0.005, default: 0, format: (v) => (v ? `${Math.round(v * 100)}%` : 'Off'), section: 'Dashes' },
    { key: 'gap', label: 'Dash gap', type: 'range', min: 0, max: 1, step: 0.005, default: 0.05, section: 'Dashes', when: (l) => (l.dash ?? 0) > 0 },
    /* EDGES (plan 53 § 1.4): each dash edge its own curve across the strips — base:height:waves:phase per
       edge, pairs make a dash (bars). Edge noise adds a seeded organic wobble to every edge. */
    { key: 'edges', label: 'Dash edges', type: 'text', default: '', rows: 3, placeholder: 'base:height:waves:phase; …', section: 'Dashes' },
    { key: 'edgeNoise', label: 'Edge noise', type: 'range', min: 0, max: 0.2, step: 0.001, default: 0, section: 'Dashes' },
    { key: 'edgeNoiseFreq', label: 'Edge noise scale', type: 'range', min: 0.2, max: 12, step: 0.1, default: 3, section: 'Dashes', when: (l) => (l.edgeNoise ?? 0) > 0 },
    { key: 'edgeSeed', label: 'Edge seed', type: 'range', min: 1, max: 99, step: 1, default: 1, section: 'Dashes', when: (l) => (l.edgeNoise ?? 0) > 0 },
    { key: 'link', label: 'Link', type: 'range', min: 0, max: 8, step: 0.1, default: 0, format: (v) => (v ? `${v}px` : 'Off'), section: 'Dashes', when: (l) => (l.dash ?? 0) > 0 },
    { key: 'spread', label: 'Spacing', type: 'segmented', default: 'even', section: 'Strips',
      options: [{ value: 'even', label: 'Even' }, { value: 'packed', label: 'Packed' }, { value: 'units', label: 'Units' }] },
    /* Units: widths and gaps in px of an 800 px frame, laid from Offset — a run that does not stretch to fit */
    { key: 'offset', label: 'Offset', type: 'range', min: -1, max: 1, step: 0.001, default: 0, section: 'Strips', when: (l) => l.spread === 'units' },
    /* Packed: each strip takes its width plus its gap, the whole run scaled to fill (bands/air) */
    /* a roll keeps gaps on the width's own scale (rMin/rMax 0–0.6) — packed is width : gap, scale-free, so a gap rolled
       in px against a width rolled as a share drew hairlines; the slider keeps its reach */
    ...ramp('g', 'Gap', 0, 400, 0.5, 0.5, 'Strips', { rMin: 0, rMax: 0.6, when: (l) => l.spread === 'packed' || l.spread === 'units' }),
  ],
  draw(m, p, box) {
    const vert = p.orient === 'v'
    /* rotated: lay the strips out in a square that covers the box at any angle, then turn and clip */
    const ang = ((p.angle ?? 0) * Math.PI) / 180
    const diag = Math.hypot(box.w, box.h)
    const frame = ang ? { x: box.x + box.w / 2 - diag / 2, y: box.y + box.h / 2 - diag / 2, w: diag, h: diag } : box
    const across = vert ? frame.w : frame.h, along = vert ? frame.h : frame.w
    const n = Math.max(1, Math.round(p.count ?? 16))
    const pitch = across / n
    const per = Math.round(p.period ?? 0) || n
    const lead = p.lead ?? 1
    const SAMPLES = 96
    /* strip centres + widths in px: even pitch (width = share of the pitch), or packed (width + gap,
       scaled so the run fills the box) */
    const tk = (k) => (per > 1 ? (k % per) / (per - 1) : 0)
    const wAt = (k) => Math.max(0, at(p, 'w', tk(k))) * (k % per === 0 ? lead : 1)
    let centres, widths
    if (p.spread === 'packed' || p.spread === 'units') {
      const ws = Array.from({ length: n }, (_, k) => wAt(k))
      const gs = Array.from({ length: n }, (_, k) => Math.max(0, at(p, 'g', tk(k))))
      const scale = p.spread === 'units'
        ? Math.min(box.w, box.h) / 800
        : across / (ws.reduce((a, b) => a + b, 0) + gs.slice(0, -1).reduce((a, b) => a + b, 0) || 1)
      let acc = p.spread === 'units' ? (p.offset ?? 0) * across : 0
      centres = []; widths = []
      for (let k = 0; k < n; k++) { widths.push(ws[k] * scale); centres.push(acc + (ws[k] * scale) / 2); acc += (ws[k] + gs[k]) * scale }
    } else {
      /* even: edge to edge — the first strip's outer side on one edge, the last's on the other */
      widths = Array.from({ length: n }, (_, k) => wAt(k) * pitch)
      /* inset by the deepest wave, so the crests stay inside the frame (undulation's 2 big waves) */
      const amp = Math.max(...Array.from({ length: n }, (_, k) => Math.abs(at(p, 'a', tk(k))))) * across
      const c0 = widths[0] / 2 + amp, c1 = across - widths[n - 1] / 2 - amp
      centres = widths.map((_, k) => (n > 1 ? c0 + ((c1 - c0) * k) / (n - 1) : across / 2))
    }
    const cx = box.x + box.w / 2, cy = box.y + box.h / 2, ca = Math.cos(ang), sa = Math.sin(ang)
    const P = (a, c) => {
      const pt = vert ? [frame.x + c, frame.y + a] : [frame.x + a, frame.y + c]
      if (!ang) return pt
      const dx = pt[0] - cx, dy = pt[1] - cy
      return [cx + dx * ca - dy * sa, cy + dx * sa + dy * ca]
    }
    const put = (pts) => { if (ang) pts = clipToBox(pts, box); poly(m, pts) }
    for (let k = 0; k < n; k++) {
      const t = tk(k)
      const w = widths[k]
      if (w <= 0.05) continue
      const s0 = at(p, 's', t) * along, s1 = at(p, 'e', t) * along
      if (s1 - s0 <= 0.5) continue
      const shear = at(p, 'k', t), amp = at(p, 'a', t) * across, ph = at(p, 'ph', t), bend = at(p, 'b', t) * across
      const freq = p.freq ?? 3
      const centre = (a) => {
        const x = a / along
        return centres[k] + amp * Math.sin(2 * Math.PI * (x * freq + ph)) + bend * 4 * (x - 0.5) * (x - 0.5)
      }
      /* the pieces: the whole strip, or its dashes */
      const pieces = []
      const dash = (p.dash ?? 0) * along, gap = (p.gap ?? 0.05) * along
      const edges = String(p.edges ?? '').split(';').map((e) => e.split(':').map(Number)).filter((e) => e.length >= 1 && Number.isFinite(e[0]))
      const en = p.edgeNoise ?? 0
      if (edges.length >= 2) {
        const pos = edges.map(([b, a = 0, f = 0, ph = 0], ei) =>
          (b + a * Math.sin(2 * Math.PI * f * t + (ph * Math.PI) / 180) + (en ? en * (fbm(t * (p.edgeNoiseFreq ?? 3), ei * 7.3, p.edgeSeed ?? 1) - 0.5) * 2 : 0)) * along)
        for (let q = 0; q + 1 < pos.length; q += 2) pieces.push([Math.max(s0, Math.min(pos[q], pos[q + 1])), Math.min(s1, Math.max(pos[q], pos[q + 1]))])
      } else if (dash > 0) {
        const off = (((ph % 1) + 1) % 1) * (dash + gap)
        for (let a = s0 - off; a < s1; a += dash + gap) pieces.push([Math.max(s0, a), Math.min(s1, a + dash)])
      } else pieces.push([s0, s1])
      for (const [a0, a1] of pieces) {
        if (a1 - a0 <= 0.3) continue
        const top = [], bot = []
        const steps = amp || bend ? Math.max(2, Math.ceil((SAMPLES * (a1 - a0)) / along)) : 1
        for (let q = 0; q <= steps; q++) {
          const a = a0 + ((a1 - a0) * q) / steps
          const c = centre(a)
          /* shear slides the ends along the strip by the across offset — long edges stay parallel */
          const sh = q === 0 || q === steps ? shear * (w / 2) : 0
          top.push(P(a + (q === 0 ? sh : q === steps ? sh : 0), c - w / 2))
          bot.push(P(a - (q === 0 ? sh : q === steps ? sh : 0), c + w / 2))
        }
        put([...top, ...bot.reverse()])
      }
      /* the hairline under the dashes — it follows the strip's wave and bend */
      if ((dash > 0 || edges.length >= 2) && (p.link ?? 0) > 0) {
        const lw = p.link / 2, top = [], bot = []
        for (let q = 0; q <= SAMPLES; q++) {
          const a = s0 + ((s1 - s0) * q) / SAMPLES, c = centre(a)
          top.push(P(a, c - lw)); bot.push(P(a, c + lw))
        }
        put([...top, ...bot.reverse()])
      }
    }
  },
}
