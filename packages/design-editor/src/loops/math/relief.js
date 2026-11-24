// Relief (C7, after the Atlas Web Sketch boards web-01-iceland-loop, web-02-iceland-globe and web-03-iceland-coast):
// a height picture drawn as a field of square dots in perspective, raised, lit from its slope and shaded low to high,
// with a dotted loop just inside its shore and pulses running round it. Three views, the three boards: Turn (the
// relief turns whole turns, the tilt following it), Globe (bent over a sphere, the camera swaying in a circle) and Fly
// (the camera laps the shore, high over the sea, looking in). The boards baked one island's elevation into their code;
// here the height is your shape or image (lib/source.js), bright = high, and its shore is read from it. Their cables,
// labels and arcs are Atlas's and stay there. Every motion makes whole turns or laps per loop, so it closes.
import { sourceParams, sourceField } from '../lib/source.js'

const TAU = Math.PI * 2, DEG = Math.PI / 180
const on = (v) => v === true || v === 'true'
const rgb = (c) => {
  const m = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(String(c).trim())
  if (!m) return [128, 128, 128]
  const h = m[1].length === 3 ? m[1].replace(/./g, (x) => x + x) : m[1]
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16))
}
const memo = { key: '', grid: null }

/* the land: every cell above the sea, its height and its light; and the shore as a closed path (polar, smoothed) */
function bake(F, C, R, p) {
  const H = (r, c) => (r < 0 || c < 0 || r >= R || c >= C ? 0 : Math.max(0, F((c + 0.5) / C, (r + 0.5) / R) - p.sea) / (1 - p.sea || 1))
  const lx = Math.cos(p.light * DEG), lz = Math.sin(p.light * DEG)
  const pts = []
  let cx = 0, cz = 0
  for (let r = 0; r < R; r++) for (let c = 0; c < C; c++) {
    const e = H(r, c)
    if (e <= 0) continue
    const nx = (H(r, c - 1) - H(r, c + 1)) * p.relief, nz = (H(r - 1, c) - H(r + 1, c)) * p.relief
    const sh = Math.max(0.45, Math.min(1, 0.8 + 0.5 * p.shade * (nx * -lx + nz * -lz) / Math.hypot(nx, nz, 1)))
    pts.push({ x: c - C / 2, z: r - R / 2, e, sh }); cx += c - C / 2; cz += r - R / 2
  }
  const n = Math.max(1, pts.length); cx /= n; cz /= n
  /* the shore: along K rays from the land's centre, the last cell above the sea, pulled in by Inset, then smoothed */
  const K = 240, ray = []
  for (let k = 0; k < K; k++) {
    const a = (k / K) * TAU, ux = Math.cos(a), uz = Math.sin(a)
    let last = 0
    for (let s = 0; s < Math.hypot(C, R); s += 0.5) if (H(Math.round(cz + R / 2 + uz * s), Math.round(cx + C / 2 + ux * s)) > 0) last = s
    ray.push(last * p.inset)
  }
  let sm = ray
  for (let pass = 0; pass < 3; pass++) sm = sm.map((_, k) => { let s = 0; for (let m = -6; m <= 6; m++) s += sm[(k + m + K) % K]; return s / 13 })
  const shore = sm.map((rr, k) => {
    const a = (k / K) * TAU, x = cx + Math.cos(a) * rr, z = cz + Math.sin(a) * rr
    return { x, z, e: H(Math.round(z + R / 2), Math.round(x + C / 2)) + 0.03 }
  })
  return { pts, shore, cx, cz }
}

export default {
  id: 'math-relief',
  label: 'Relief',
  group: 'math',
  kind: '2d',
  duration: 8,
  params: [
    { key: 'bg', label: 'Ground', type: 'color', role: 'bg', default: '#000000', section: 'Color' },
    { key: 'ink', label: 'High', type: 'color', role: 'fg', default: '#ffffff', section: 'Color' },
    { key: 'low', label: 'Low', type: 'color', role: 'dim', default: '#666666', section: 'Color' },
    { key: 'shadow', label: 'Footprint', type: 'color', role: 'warm', default: '#2a2a2a', section: 'Color' },
    { key: 'accent', label: 'Shore loop', type: 'color', role: 'accent', default: '#f6c453', section: 'Color' },
    ...sourceParams('Height', 'blob'),
    { key: 'view', label: 'View', type: 'select', default: 'turn', options: [{ value: 'turn', label: 'Turn' }, { value: 'globe', label: 'Globe' }, { value: 'fly', label: 'Fly' }], section: 'View' },
    { key: 'cols', label: 'Columns', type: 'range', min: 20, max: 200, step: 1, default: 120, section: 'Relief' },
    { key: 'sea', label: 'Sea level', type: 'range', min: 0, max: 0.95, step: 0.01, default: 0.12, section: 'Relief' },
    { key: 'height', label: 'Exaggeration', type: 'range', min: 0, max: 0.5, step: 0.005, default: 0.09, section: 'Relief' },
    { key: 'relief', label: 'Slope', type: 'range', min: 0, max: 40, step: 0.5, default: 6, section: 'Relief' },
    { key: 'shade', label: 'Shade', type: 'range', min: 0, max: 2, step: 0.05, default: 1, section: 'Relief' },
    { key: 'light', label: 'Light from', type: 'range', min: 0, max: 360, step: 5, default: 53, format: (v) => `${v}°`, section: 'Relief' },
    { key: 'ramp', label: 'Ramp', type: 'range', min: 0.05, max: 1, step: 0.01, default: 0.52, section: 'Relief' },
    { key: 'dot', label: 'Dot', type: 'range', min: 0.2, max: 2, step: 0.05, default: 0.9, section: 'Relief' },
    { key: 'zoom', label: 'Zoom', type: 'range', min: 0.2, max: 3, step: 0.05, default: 1, section: 'View' },
    { key: 'focal', label: 'Focal', type: 'range', min: 100, max: 3000, step: 50, default: 900, section: 'View' },
    { key: 'turns', label: 'Turns', type: 'range', min: 0, max: 6, step: 1, default: 2, when: (l) => l.view === 'turn', section: 'View' },
    { key: 'yaw', label: 'Turn from', type: 'range', min: -180, max: 180, step: 1, default: -20, format: (v) => `${v}°`, section: 'View' },
    { key: 'tilt', label: 'Tilt', type: 'range', min: 5, max: 85, step: 1, default: 54, format: (v) => `${v}°`, section: 'View' },
    { key: 'tiltSwing', label: 'Tilt swing', type: 'range', min: 0, max: 30, step: 1, default: 14, format: (v) => `${v}°`, section: 'View' },
    { key: 'sway', label: 'Sway', type: 'range', min: 0, max: 45, step: 1, default: 18, format: (v) => `${v}°`, when: (l) => l.view === 'globe', section: 'View' },
    { key: 'globe', label: 'Sphere', type: 'range', min: 0.5, max: 10, step: 0.1, default: 2.5, when: (l) => l.view === 'globe', section: 'View' },
    { key: 'seaGrid', label: 'Sea grid', type: 'toggle', default: false, section: 'View' },
    { key: 'camHeight', label: 'Camera height', type: 'range', min: 0.05, max: 1, step: 0.01, default: 0.33, when: (l) => l.view === 'fly', section: 'View' },
    { key: 'camOut', label: 'Camera out', type: 'range', min: -0.3, max: 0.6, step: 0.01, default: 0.2, when: (l) => l.view === 'fly', section: 'View' },
    { key: 'ahead', label: 'Look ahead', type: 'range', min: 0, max: 0.2, step: 0.005, default: 0.03, when: (l) => l.view === 'fly', section: 'View' },
    { key: 'laps', label: 'Laps', type: 'range', min: 1, max: 4, step: 1, default: 1, when: (l) => l.view === 'fly', section: 'View' },
    { key: 'shore', label: 'Shore loop', type: 'toggle', default: true, section: 'Shore' },
    { key: 'inset', label: 'Inset', type: 'range', min: 0.5, max: 1.1, step: 0.01, default: 0.9, section: 'Shore' },
    { key: 'pulses', label: 'Pulses', type: 'range', min: 0, max: 16, step: 1, default: 6, section: 'Shore' },
    { key: 'pulseLaps', label: 'Pulse laps', type: 'range', min: -6, max: 6, step: 1, default: 2, section: 'Shore' },
    { key: 'tail', label: 'Tail', type: 'range', min: 1, max: 20, step: 1, default: 6, section: 'Shore' },
  ],
  draw(ctx, u, w, h, p) {
    ctx.fillStyle = p.bg; ctx.fillRect(0, 0, w, h)
    const F = sourceField(p)
    if (!F) return
    const C = Math.max(4, Math.round(p.cols)), R = C
    const key = [C, p.fieldSource, p.fieldImage, p.customSvg, p.fieldSoften, p.fieldInvert, p.sea, p.relief, p.shade, p.light, p.inset].join('|')
    if (memo.key !== key || !memo.grid) { memo.key = key; memo.grid = bake(F, C, R, p) }
    const { pts, shore, cx, cz } = memo.grid
    const EX = p.height * C
    const S = (Math.min(w, h) / C) * p.zoom, D = p.focal

    /* the camera for the view: a projector (x, z, height 0 to 1) → [sx, sy, depth, scale] */
    let P
    if (p.view === 'fly') {
      const NS = shore.length, at = (v) => {
        const k = ((((v % 1) + 1) % 1) * NS), i = Math.floor(k), f = k - i, a = shore[i], b = shore[(i + 1) % NS]
        const x = a.x + (b.x - a.x) * f, z = a.z + (b.z - a.z) * f, ox = x - cx, oz = z - cz, l = Math.hypot(ox, oz) || 1
        return [x, z, ox / l, oz / l]
      }
      const lap = u * Math.max(1, Math.round(p.laps))
      const [px, pz, ox, oz] = at(lap), [qx, qz] = at(lap + p.ahead)
      const Cm = [px + ox * p.camOut * C, p.camHeight * C, pz + oz * p.camOut * C], G = [qx, 0, qz]
      const nrm = (v) => { const l = Math.hypot(...v) || 1; return v.map((c) => c / l) }
      const Fw = nrm([G[0] - Cm[0], G[1] - Cm[1], G[2] - Cm[2]])
      const Rr = nrm([-Fw[2], 0, Fw[0]]), V = [Rr[1] * Fw[2] - Rr[2] * Fw[1], Rr[2] * Fw[0] - Rr[0] * Fw[2], Rr[0] * Fw[1] - Rr[1] * Fw[0]]
      const foc = (D / 1200) * w * p.zoom
      P = (x, z, e) => {
        const dx = x - Cm[0], dy = e * EX - Cm[1], dz = z - Cm[2], d = dx * Fw[0] + dy * Fw[1] + dz * Fw[2]
        if (d < 2) return [-1e4, -1e4, -1e9, 0]
        const k = foc / d
        return [w / 2 + k * (dx * Rr[0] + dy * Rr[1] + dz * Rr[2]), h * 0.56 - k * (dx * V[0] + dy * V[1] + dz * V[2]), -d, Math.min(k, w * 0.031)]
      }
    } else {
      const globe = p.view === 'globe'
      const yaw = p.yaw * DEG + (globe ? p.sway * DEG * Math.sin(u * TAU) : u * TAU * Math.round(p.turns))
      const pitch = (p.tilt + p.tiltSwing * (globe ? Math.cos(u * TAU) : Math.sin(yaw) ** 2)) * DEG
      const cy = Math.cos(yaw), sy = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch), SR = p.globe * C, Dp = (D / 1200) * w
      P = (x, z, e) => {
        let bx = x, bz = z, Y = e * EX
        if (globe) { const r = SR + Y, lq = x / SR, la = z / SR, cl = Math.cos(la); bx = r * cl * Math.sin(lq); Y = r * cl * Math.cos(lq) - SR; bz = r * Math.sin(la) }
        const X = bx * cy - bz * sy, Z = bx * sy + bz * cy, sY = Z * cp - Y * sp, dep = Z * sp + Y * cp, f = Dp / Math.max(Dp * 0.1, Dp - dep * S * 0.6)
        return [w / 2 + X * S * f, h / 2 + sY * S * f, dep, S * f]
      }
    }

    if (on(p.seaGrid)) {
      ctx.fillStyle = p.low
      const rmax = C * 1.25
      for (let x = -rmax; x <= rmax; x += C / 30) for (let z = -rmax; z <= rmax; z += C / 30) {
        const d = Math.hypot(x, z) / rmax
        if (d >= 1) continue
        const [a, b, , f] = P(x, z, 0); if (!f) continue
        ctx.globalAlpha = 0.4 * (1 - d); ctx.fillRect(a - 0.13 * f, b - 0.13 * f, 0.26 * f, 0.26 * f)
      }
      ctx.globalAlpha = 1
    }
    ctx.fillStyle = p.shadow
    for (const q of pts) { const [a, b, , f] = P(q.x, q.z, 0); if (f) ctx.fillRect(a - 0.15 * p.dot * f, b - 0.15 * p.dot * f, 0.3 * p.dot * f, 0.3 * p.dot * f) }
    const out = pts.map((q) => [...P(q.x, q.z, q.e), q]).filter((o) => o[3]).sort((m, n) => m[2] - n[2])
    const lo = rgb(p.low), hi = rgb(p.ink)
    for (const [a, b, , f, q] of out) {
      const k = Math.min(q.e / p.ramp, 1), t = Math.min(1, 0.15 + k * 1.1), s = (0.35 + 0.23 * k) * p.dot * f
      ctx.fillStyle = `rgb(${lo.map((v, i) => Math.round((v + (hi[i] - v) * t) * (0.5 + 0.5 * q.sh))).join(',')})`
      ctx.fillRect(a - s / 2, b - s / 2, s, s)
    }
    if (on(p.shore) && shore.length) {
      const NP = shore.length, step = 4
      ctx.fillStyle = p.accent; ctx.globalAlpha = 0.9
      for (let i = 0; i < NP; i += step) { const q = shore[i], [a, b, , f] = P(q.x, q.z, q.e); if (f) ctx.fillRect(a - 0.32 * f, b - 0.32 * f, 0.64 * f, 0.64 * f) }
      const n = Math.round(p.pulses), T = Math.round(p.tail)
      for (let k = 0; k < n; k++) {
        const head = (u * Math.round(p.pulseLaps) * NP + (k * NP) / n) % NP
        for (let j = 0; j < T; j++) {
          const q = shore[Math.floor(head - j * step + NP * 4) % NP], [a, b, , f] = P(q.x, q.z, q.e)
          if (!f) continue
          ctx.globalAlpha = 1 - j / T; const s = (1.8 - (j * 1.2) / T) * f
          ctx.fillRect(a - s / 2, b - s / 2, s, s)
        }
      }
      ctx.globalAlpha = 1
    }
  },
}
