/* GENERATE — the field, the mask and the warp (plan 52 § 1.2).
 *
 * Every sampled style is one machine: a scalar FIELD over the art box, clipped by a MASK, sampled on a
 * lattice whose points a WARP may displace, drawn as marks sized by the field. All three are built here
 * from FLAT layer params (the editor's convention: params ride flat on the layer, AutoControls edits
 * them), so a preset is just a bag of numbers.
 *
 * Coordinates: (u, v) ∈ [0, 1]² across the art box. Pure — no DOM — so the match script runs it in Node. */

const clamp01 = (x) => (x < 0 ? 0 : x > 1 ? 1 : x)
const smooth = (t) => t * t * (3 - 2 * t)

/* value noise: a hashed lattice, smoothstepped — deterministic per seed */
function hash(ix, iy, seed) {
  let h = (ix * 374761393 + iy * 668265263 + seed * 2147483647) | 0
  h = Math.imul(h ^ (h >>> 13), 1274126177)
  return ((h ^ (h >>> 16)) >>> 0) / 4294967295
}
export function noise2(x, y, seed = 1) {
  const ix = Math.floor(x), iy = Math.floor(y)
  const fx = smooth(x - ix), fy = smooth(y - iy)
  const a = hash(ix, iy, seed), b = hash(ix + 1, iy, seed), c = hash(ix, iy + 1, seed), d = hash(ix + 1, iy + 1, seed)
  return a + (b - a) * fx + (c - a) * fy + (a - b - c + d) * fx * fy
}
export function fbm(x, y, seed = 1, oct = 3) {
  let s = 0, a = 0.5, n = 0
  for (let i = 0; i < oct; i++) { s += a * noise2(x, y, seed + i * 17); n += a; x *= 2; y *= 2; a *= 0.5 }
  return s / n
}

/* ONE SOURCE — kind + its knobs under a prefix (`f` for the first source, `g` for the second) */
export function source(p, k, aspect, image = null) {
  const kind = p[`${k}Kind`] ?? 'flat'
  const cx = p[`${k}X`] ?? 0.5, cy = p[`${k}Y`] ?? 0.5
  const ang = ((p[`${k}Angle`] ?? 0) * Math.PI) / 180
  const freq = p[`${k}Freq`] ?? 1, phase = ((p[`${k}Phase`] ?? 0) * Math.PI) / 180
  const rx = p[`${k}Rx`] ?? 0.5, ry = p[`${k}Ry`] ?? 0.5
  const ca = Math.cos(ang), sa = Math.sin(ang)
  switch (kind) {
    /* 0 at one edge → 1 at the other, along the angle */
    /* `Bend` curves the ramp: the across-axis distance², so a level line becomes a parabola (lines/cusp) */
    case 'linear': return (u, v) => {
      const along = (u - 0.5) * ca + (v - 0.5) * sa, across = -(u - 0.5) * sa + (v - 0.5) * ca
      return clamp01((along + (p[`${k}Bend`] ?? 0) * across * across * 4) * (p[`${k}Span`] ?? 1) + 0.5 + (p[`${k}Offset`] ?? 0))
    }
    /* 1 at the centre → 0 on a diamond's rim (lines/spooky's spikes) */
    case 'diamond': return (u, v) => clamp01(1 - Math.abs(u - cx) / rx - Math.abs(v - cy) / ry)
    /* 1 at the centre → 0 at radius rx (aspect-true circle) */
    case 'radial': return (u, v) => {
      const dx = (u - cx) * aspect, dy = v - cy
      return clamp01(1 - Math.hypot(dx, dy) / (rx * Math.min(aspect, 1)))
    }
    /* 1 inside an ellipse falling to 0 at its rim (rotated) */
    case 'ellipse': return (u, v) => {
      const dx = u - cx, dy = v - cy
      const x = dx * ca + dy * sa, y = -dx * sa + dy * ca
      /* Squareness: 2 is an ellipse, higher rounds toward a rectangle (a superellipse) */
      const n = p[`${k}Sq`] ?? 2
      return clamp01(1 - (n === 2 ? Math.hypot(x / rx, y / ry) : (Math.abs(x / rx) ** n + Math.abs(y / ry) ** n) ** (1 / n)))
    }
    /* a gaussian bump: soft blob */
    case 'blob': return (u, v) => {
      const dx = (u - cx) / rx, dy = (v - cy) / ry
      return Math.exp(-(dx * dx + dy * dy) * 2)
    }
    /* sine across the angle: 0..1 */
    case 'sine': return (u, v) => 0.5 + 0.5 * Math.sin(((u - 0.5) * ca + (v - 0.5) * sa) * freq * 2 * Math.PI + phase)
    /* |sine| — a ridge every half period */
    case 'ridge': return (u, v) => Math.abs(Math.sin(((u - 0.5) * ca + (v - 0.5) * sa) * freq * Math.PI + phase))
    /* sine × sine — a checker of bumps */
    case 'waves': return (u, v) => 0.5 + 0.5 * Math.sin(u * freq * 2 * Math.PI + phase) * Math.sin(v * (p[`${k}Freq2`] ?? freq) * 2 * Math.PI)
    /* Freq Y stretches it: a high y frequency over a low x one lays it in horizontal streaks (fields/streaks) */
    case 'noise': return (u, v) => fbm(u * freq * aspect, v * (p[`${k}Freq2`] ?? freq), p[`${k}Seed`] ?? 1, 3)
    /* distance from a centre line bending as a sine — the X / ribbon fields (lines/confluence, fulcrum) */
    case 'ribbon': return (u, v) => {
      const amp = p[`${k}Amp`] ?? 0.25
      const along = (u - 0.5) * ca + (v - 0.5) * sa, across = -(u - 0.5) * sa + (v - 0.5) * ca
      const centre = amp * Math.sin(along * freq * 2 * Math.PI + phase)
      /* Flare: the streak widens (+) or narrows (−) toward its ends — confluence's arms */
      const w = rx * Math.max(0.05, 1 + (p[`${k}Flare`] ?? 0) * (Math.abs(along) * 2))
      return clamp01(1 - Math.abs(across - centre) / w)
    }
    /* the angle around a centre, 0 → 1 once round, starting at Angle (his third gradient) */
    case 'conic': return (u, v) => {
      const a = Math.atan2(v - cy, (u - cx) * aspect) - ang
      return (((a / (2 * Math.PI)) % 1) + 1) % 1
    }
    /* LIGHTS: up to four point lights, each a soft falloff (position, radius, intensity), summed and clamped */
    case 'lights': {
      const n = Math.max(1, Math.min(8, Math.round(p[`${k}LightN`] ?? 2)))
      const L = Array.from({ length: n }, (_, i) => ({
        x: p[`${k}L${i + 1}x`] ?? [0.3, 0.7, 0.3, 0.7, 0.5, 0.5, 0.2, 0.8][i], y: p[`${k}L${i + 1}y`] ?? [0.3, 0.7, 0.7, 0.3, 0.2, 0.8, 0.5, 0.5][i],
        r: p[`${k}L${i + 1}r`] ?? 0.3, w: p[`${k}L${i + 1}i`] ?? 1,
      }))
      return (u, v) => {
        let s = 0
        const st = p[`${k}LightStretch`] ?? 1
        for (const l of L) { const d = Math.hypot((u - l.x) * aspect, (v - l.y) / st) / l.r; s += l.w * Math.exp(-d * d * 2) }
        return clamp01(s)
      }
    }
    /* INTERFERENCE: two point sources — bands where the distance DIFFERENCE is constant, the hyperbolas
       that bend round each source and run straight between them (dots/interference) */
    case 'interfere': return (u, v) => {
      const x2 = p[`${k}X2`] ?? 0.7, y2 = p[`${k}Y2`] ?? 0.5
      const d1 = Math.hypot((u - cx) * aspect, v - cy), d2 = Math.hypot((u - x2) * aspect, v - y2)
      return 0.5 + 0.5 * Math.cos(2 * Math.PI * freq * (d1 - d2) + phase)
    }
    case 'surface': { const f = surface(p[`${k}Surface`]); return (u, v) => clamp01(f(u, v)) }
    /* SHAPE: 1 inside a polygon typed as points ("u,v u,v …"), 0 outside — a composed region (text's block) */
    /* several shapes: "0.5: u,v u,v …; 1: u,v …" — each its own value, a later shape over an earlier one */
    case 'poly': {
      const shapes = String(p[`${k}Poly`] ?? '').split(';').map((part) => {
        const [val, body] = part.includes(':') ? part.split(':') : ['1', part]
        const pts = body.trim().split(/\s+/).map((q) => q.split(',').map(Number)).filter((q) => q.length === 2 && q.every(Number.isFinite))
        return { val: Number(val), pts }
      }).filter((sh) => sh.pts.length >= 3 && Number.isFinite(sh.val))
      if (!shapes.length) return () => 0
      return (u, v) => { let f = 0; for (const sh of shapes) if (inRings([sh.pts], u, v)) f = sh.val; return f }
    }
    case 'mesh': { const f = mesh(p[`${k}Mesh`]); return (u, v) => clamp01(f(u, v)) }
    /* IMAGE (plan 53 § 4.1): a photo's brightness, sampled by the caller (the editor reads the photo as
       placed on the canvas) — 0 where the photo is not */
    case 'image': return image ? (u, v) => clamp01(image(u, v)) : () => 0
    case 'flat':
    default: return () => p[`${k}Value`] ?? 1
  }
}

/* a cubic surface over (u, v): 10 coefficients for 1 · u · v · u² · v² · uv · u³ · v³ · u²v · uv² — a free
   curved gradient (and a free displacement) fitted from a reference, or typed */
export const surface = (str) => {
  const c = String(str ?? '').split(',').map(Number)
  const g = (i) => (Number.isFinite(c[i]) ? c[i] : 0)
  return (u, v) => g(0) + g(1) * u + g(2) * v + g(3) * u * u + g(4) * v * v + g(5) * u * v + g(6) * u * u * u + g(7) * v * v * v + g(8) * u * u * v + g(9) * u * v * v
}

/* a MESH: a C × R lattice of values over the art box, read bilinearly — "CxR|v,v,v…" (row by row). A mesh
   gradient as a field, and (two meshes, dx and dy) an envelope-mesh warp. */
export const mesh = (str, part = 1) => {
  const segs = String(str ?? '').split('|')
  const [C, R] = (segs[0] || '').split('x').map(Number)
  const v = (segs[part] || '').split(',').map(Number)
  if (!(C >= 2 && R >= 2) || v.length < C * R) return () => 0
  return (u, w) => {
    const gx = Math.min(Math.max(u, 0), 1) * (C - 1), gy = Math.min(Math.max(w, 0), 1) * (R - 1)
    const i = Math.min(Math.floor(gx), C - 2), j = Math.min(Math.floor(gy), R - 2), fx = gx - i, fy = gy - j
    return (1 - fx) * (1 - fy) * v[j * C + i] + fx * (1 - fy) * v[j * C + i + 1] + (1 - fx) * fy * v[(j + 1) * C + i] + fx * fy * v[(j + 1) * C + i + 1]
  }
}

const OPS = {
  add:      (a, b) => a + b,
  multiply: (a, b) => a * b,
  max:      (a, b) => Math.max(a, b),
  min:      (a, b) => Math.min(a, b),
  screen:   (a, b) => 1 - (1 - a) * (1 - b),
  diff:     (a, b) => Math.abs(a - b),
}

/* THE FIELD — f, optionally combined with g, then shaped: remap (lo→hi), contrast, gamma, invert, steps */
/* a source, optionally flipped on its own (Inv) — the second source can then CUT (min with 1 − ribbon) */
const sourceInv = (p, k, aspect, image) => { const s = source(p, k, aspect, image); return p[`${k}Inv`] ? (u, v) => 1 - s(u, v) : s }
export function makeField(p, aspect = 1, image = null) {
  const f = sourceInv(p, 'f', aspect, image)
  const g = (p.gKind && p.gKind !== 'none') ? sourceInv(p, 'g', aspect, image) : null
  const op = OPS[p.fOp ?? 'max'] ?? OPS.max
  const gw = p.gWeight ?? 1
  const lo = p.fLo ?? 0, hi = p.fHi ?? 1
  const contrast = p.fContrast ?? 1, gamma = p.fGamma ?? 1
  const from = p.fFrom ?? 0, to = p.fTo ?? 1
  const steps = Math.round(p.fSteps ?? 0)
  const inv = !!p.fInvert
  const split = p.fSplit ?? 0
  return (u, v) => {
    let x = f(u, v)
    if (g) x = op(x, g(u, v) * gw)
    /* Split: below the axis the field reads inverted — the lower half of lines/spooky */
    if (split > 0 && v > split) x = 1 - x
    /* the input window: From → 0, To → 1 (a ramp between two radii, two levels) */
    if (from !== 0 || to !== 1) x = clamp01((x - from) / ((to - from) || 1e-6))
    x = clamp01((x - 0.5) * contrast + 0.5)
    if (gamma !== 1) x = Math.pow(x, gamma)
    if (inv) x = 1 - x
    if (steps >= 2) x = Math.min(steps - 1, Math.floor(x * steps)) / (steps - 1)
    return lo + (hi - lo) * clamp01(x)
  }
}

/* THE MASK — inside(u, v) over the art box. `poly` rings (a letter, a selected shape) come in art-box
   units from the caller as `maskRings` (not a param: derived, never saved). Even-odd, so counters punch. */
export function inRings(rings, u, v) {
  let inside = false
  for (const r of rings) {
    for (let i = 0, j = r.length - 1; i < r.length; j = i++) {
      const [xi, yi] = r[i], [xj, yj] = r[j]
      if ((yi > v) !== (yj > v) && u < ((xj - xi) * (v - yi)) / (yj - yi) + xi) inside = !inside
    }
  }
  return inside
}
/* rings → a lookup: the outline scanned once (even-odd) into a GRID² bitmap over [0,1]², so a sample is
   one read, not a walk over hundreds of edges (a letter change has to re-render inside a frame) */
const GRID = 512
const gridCache = new WeakMap()
function ringGrid(rings) {
  if (gridCache.has(rings)) return gridCache.get(rings)
  const g = new Uint8Array(GRID * GRID)
  /* active-edge sweep: edges sorted by their top row, each row visits only the edges that cross it */
  const edges = []
  for (const r of rings) for (let i = 0, j = r.length - 1; i < r.length; j = i++) {
    const [xi, yi] = r[i], [xj, yj] = r[j]
    if (yi === yj) continue
    const y0 = Math.min(yi, yj), y1 = Math.max(yi, yj)
    edges.push({ y0, y1, x0: yi < yj ? xi : xj, k: (yi < yj ? xj - xi : xi - xj) / (y1 - y0) })
  }
  edges.sort((a, c) => a.y0 - c.y0)
  let next = 0, active = []
  for (let y = 0; y < GRID; y++) {
    const v = (y + 0.5) / GRID
    while (next < edges.length && edges[next].y0 <= v) active.push(edges[next++])
    active = active.filter((e) => e.y1 > v)
    if (!active.length) continue
    const xs = active.map((e) => e.x0 + (v - e.y0) * e.k).sort((a, c) => a - c)
    for (let k = 0; k + 1 < xs.length; k += 2) {
      for (let x = Math.max(0, Math.ceil(xs[k] * GRID - 0.5)); x <= Math.min(GRID - 1, Math.floor(xs[k + 1] * GRID - 0.5)); x++) g[y * GRID + x] = 1
    }
  }
  const fn = (u, v) => u >= 0 && u < 1 && v >= 0 && v < 1 && g[Math.floor(v * GRID) * GRID + Math.floor(u * GRID)] === 1
  gridCache.set(rings, fn)
  return fn
}
export function makeMask(p, aspect = 1, rings = null) {
  const kind = p.mKind ?? 'none'
  const s = p.mSize ?? 1
  switch (kind) {
    /* a sub-rectangle of the art box: centre (mX, mY), size (mW, mH) */
    case 'rect': {
      const x = p.mX ?? 0.5, y = p.mY ?? 0.5, w = (p.mW ?? 1) / 2, h = (p.mH ?? 1) / 2
      return (u, v) => Math.abs(u - x) <= w && Math.abs(v - y) <= h
    }
    case 'ellipse': return (u, v) => ((u - 0.5) / (0.5 * s)) ** 2 + ((v - 0.5) / (0.5 * s)) ** 2 <= 1
    /* aspect-true: distances in art-box HEIGHTS, radius half the short side */
    case 'circle':  return (u, v) => {
      const r = 0.5 * s * Math.min(aspect, 1)
      return ((u - 0.5) * aspect) ** 2 + (v - 0.5) ** 2 <= r * r
    }
    /* two triangles tip to tip: width at height v is |v − ½|·2 floored at the waist */
    case 'hourglass': return (u, v) => {
      const w = Math.max(p.mWaist ?? 0.08, Math.abs(v - 0.5) * 2) * 0.5 * s
      return Math.abs(u - 0.5) <= w
    }
    case 'diamond': return (u, v) => Math.abs(u - 0.5) + Math.abs(v - 0.5) <= 0.5 * s
    /* a square with its corners cut at 30 % (fields/lattice) */
    case 'octagon': return (u, v) => {
      const x = Math.abs(u - 0.5), y = Math.abs(v - 0.5), r = 0.5 * s
      return x <= r && y <= r && x + y <= r * 1.4
    }
    /* a shield: flat top, round bottom (lines/summer) */
    case 'arch': return (u, v) => v <= 0.5 || ((u - 0.5) / 0.5) ** 2 + ((v - 0.5) / 0.5) ** 2 <= 1
    case 'letter':
    case 'layer':   return rings?.length ? ringGrid(rings) : () => true
    case 'none':
    default:        return () => true
  }
}

/* THE WARP — displaces a lattice point (u, v) → (u', v'). Amount in art-box units. */
export function makeWarp(p, aspect = 1, field = null) {
  const w = warpRaw(p, aspect, field)
  if (!w || !p.wPin) return w
  /* Pin: the displacement fades to nothing at the art box's edges, so a bent grid keeps a straight frame */
  return (u, v) => {
    const [x, y] = w(u, v)
    const k = Math.sin(Math.PI * Math.min(1, Math.max(0, u))) * Math.sin(Math.PI * Math.min(1, Math.max(0, v)))
    return [u + (x - u) * k, v + (y - v) * k]
  }
}
function warpRaw(p, aspect, field) {
  const kind = p.wKind ?? 'none'
  const a = p.wAmt ?? 0
  if (kind === 'none' || !a) return null
  /* FIELD: the gradient itself pushes each point along Push angle — dots move where the shading turns,
     cloth over a form (dots/slipstream). The caller hands the field in. */
  if (kind === 'field') {
    if (!field) return null
    const t = ((p.wAngle ?? 0) * Math.PI) / 180, c = Math.cos(t), s = Math.sin(t)
    return (u, v) => { const f = field(u, v) - 0.5; return [u + a * f * c, v + a * f * s] }
  }
  if (kind === 'mesh') {
    const dx = mesh(p.wMesh, 1), dy = mesh(p.wMesh, 2)
    return (u, v) => [u + a * dx(u, v), v + a * dy(u, v)]
  }
  if (kind === 'surface') {
    const dx = surface(p.wSurfX), dy = surface(p.wSurfY)
    return (u, v) => [u + a * dx(u, v), v + a * dy(u, v)]
  }
  const freq = p.wFreq ?? 1, seed = p.wSeed ?? 3
  const cx = p.wX ?? 0.5, cy = p.wY ?? 0.5
  switch (kind) {
    /* squeeze toward the vertical centre line, strongest at mid-height (dots/compression) */
    case 'pinch': return (u, v) => {
      const k = Math.sin(v * Math.PI) ** 2
      return [0.5 + (u - 0.5) * (1 - a * k), v]
    }
    /* push away from a centre (dots/warp) */
    case 'bulge': return (u, v) => {
      const dx = (u - cx) * aspect, dy = v - cy, d = Math.hypot(dx, dy)
      const k = a * Math.exp(-d * d * 4 * freq)
      return [u + (dx / aspect) * k, v + dy * k]
    }
    /* sideways sine (dots/slipstream) */
    case 'wave': return (u, v) => [u + a * Math.sin(v * freq * 2 * Math.PI), v + a * 0.5 * Math.sin(u * freq * 2 * Math.PI)]
    /* rotate around a centre by an angle that falls off as a gaussian — a local twist (dots/warp) */
    case 'swirl': return (u, v) => {
      const dx = (u - cx) * aspect, dy = v - cy, d = Math.hypot(dx, dy)
      const t = a * Math.exp(-((d * 3 * freq) ** 2))
      const c = Math.cos(t), s = Math.sin(t)
      return [cx + (dx * c - dy * s) / aspect, cy + dx * s + dy * c]
    }
    case 'noise': return (u, v) => [u + a * (fbm(u * freq * 3, v * freq * 3, seed) - 0.5), v + a * (fbm(u * freq * 3 + 9, v * freq * 3, seed + 5) - 0.5)]
    /* FLOW: each point slides along a smooth direction field (an angle from noise) — cloth folding */
    case 'flow': return (u, v) => {
      const th = fbm(u * freq, v * freq, seed) * Math.PI * 4
      const m = fbm(u * freq + 5, v * freq + 5, seed + 2)
      return [u + a * m * Math.cos(th), v + a * m * Math.sin(th)]
    }
    default: return null
  }
}

/* ── the shared schema rows: Field · Mask · Warp, appended to every sampled style ── */
const FIELD_KINDS = ['flat', 'image', 'linear', 'radial', 'conic', 'lights', 'interfere', 'mesh', 'surface', 'poly', 'diamond', 'ellipse', 'blob', 'sine', 'ridge', 'waves', 'noise', 'ribbon'].map((v) => ({ value: v, label: v[0].toUpperCase() + v.slice(1) }))
const g = (k) => k === 'g'
const srcRows = (k, section) => [
  { key: `${k}Kind`, label: g(k) ? 'Second' : 'Source', type: 'select', default: g(k) ? 'none' : 'radial', options: g(k) ? [{ value: 'none', label: 'None' }, ...FIELD_KINDS] : FIELD_KINDS, section },
  { key: `${k}X`, label: 'Centre X', type: 'range', min: -0.5, max: 1.5, step: 0.01, default: 0.5, section, when: (l) => ['radial', 'ellipse', 'blob', 'diamond', 'conic', 'interfere'].includes(l[`${k}Kind`]) },
  { key: `${k}Y`, label: 'Centre Y', type: 'range', min: -0.5, max: 1.5, step: 0.01, default: 0.5, section, when: (l) => ['radial', 'ellipse', 'blob', 'diamond', 'conic', 'interfere'].includes(l[`${k}Kind`]) },
  { key: `${k}Rx`, label: 'Radius', type: 'range', min: 0.02, max: 2, step: 0.01, default: 0.5, section, when: (l) => ['radial', 'ellipse', 'blob', 'ribbon', 'diamond'].includes(l[`${k}Kind`]) },
  { key: `${k}Ry`, label: 'Radius Y', type: 'range', min: 0.02, max: 2, step: 0.01, default: 0.5, section, when: (l) => ['ellipse', 'blob', 'diamond'].includes(l[`${k}Kind`]) },
  { key: `${k}Bend`, label: 'Bend', type: 'range', min: -2, max: 2, step: 0.01, default: 0, section, when: (l) => l[`${k}Kind`] === 'linear' },
  { key: `${k}Span`, label: 'Span', type: 'range', min: 0.2, max: 6, step: 0.05, default: 1, section, when: (l) => l[`${k}Kind`] === 'linear' },
  { key: `${k}Offset`, label: 'Offset', type: 'range', min: -1, max: 1, step: 0.01, default: 0, section, when: (l) => l[`${k}Kind`] === 'linear' },
  { key: `${k}Angle`, label: 'Angle', type: 'range', min: -180, max: 180, step: 1, default: 0, format: (v) => `${v}°`, section, when: (l) => ['linear', 'ellipse', 'sine', 'ridge', 'ribbon', 'conic'].includes(l[`${k}Kind`]) },
  { key: `${k}LightStretch`, label: 'Light stretch', type: 'range', min: 0.2, max: 6, step: 0.05, default: 1, section, when: (l) => l[`${k}Kind`] === 'lights' },
  { key: `${k}LightN`, label: 'Lights', type: 'range', min: 1, max: 8, step: 1, default: 2, section, when: (l) => l[`${k}Kind`] === 'lights' },
  ...[1, 2, 3, 4, 5, 6, 7, 8].flatMap((i) => [['x', 'X', [0.3, 0.7, 0.3, 0.7, 0.5, 0.5, 0.2, 0.8][i - 1], 0, 1], ['y', 'Y', [0.3, 0.7, 0.7, 0.3, 0.2, 0.8, 0.5, 0.5][i - 1], 0, 1], ['r', 'radius', 0.3, 0.02, 1.5], ['i', 'intensity', 1, 0, 2]].map(([c, lab, d, mn, mx]) =>
    ({ key: `${k}L${i}${c}`, label: `Light ${i} ${lab}`, type: 'range', min: mn, max: mx, step: 0.01, default: d, section, when: (l) => l[`${k}Kind`] === 'lights' && (l[`${k}LightN`] ?? 2) >= i }))),
  { key: `${k}Freq`, label: 'Frequency', type: 'range', min: 0.1, max: 12, step: 0.05, default: 1, section, when: (l) => ['sine', 'ridge', 'waves', 'noise', 'ribbon', 'interfere'].includes(l[`${k}Kind`]) },
  { key: `${k}Phase`, label: 'Phase', type: 'range', min: -180, max: 180, step: 1, default: 0, format: (v) => `${v}°`, section, when: (l) => ['sine', 'ridge', 'waves', 'ribbon', 'interfere'].includes(l[`${k}Kind`]) },
  { key: `${k}X2`, label: 'Second centre X', type: 'range', min: -0.5, max: 1.5, step: 0.01, default: 0.7, section, when: (l) => l[`${k}Kind`] === 'interfere' },
  { key: `${k}Y2`, label: 'Second centre Y', type: 'range', min: -0.5, max: 1.5, step: 0.01, default: 0.5, section, when: (l) => l[`${k}Kind`] === 'interfere' },
  { key: `${k}Poly`, label: 'Shape points', type: 'text', default: '', rows: 2, placeholder: 'u,v u,v u,v …', section, when: (l) => l[`${k}Kind`] === 'poly' },
  { key: `${k}Mesh`, label: 'Mesh', type: 'text', default: '', rows: 2, placeholder: 'CxR|v,v,…', section, when: (l) => l[`${k}Kind`] === 'mesh' },
  { key: `${k}Surface`, label: 'Surface', type: 'text', default: '', rows: 2, placeholder: '10 coefficients', section, when: (l) => l[`${k}Kind`] === 'surface' },
  { key: `${k}Sq`, label: 'Squareness', type: 'range', min: 1, max: 10, step: 0.1, default: 2, section, when: (l) => l[`${k}Kind`] === 'ellipse' },
  { key: `${k}Flare`, label: 'Flare', type: 'range', min: -1, max: 3, step: 0.01, default: 0, section, when: (l) => l[`${k}Kind`] === 'ribbon' },
  { key: `${k}Amp`, label: 'Bend', type: 'range', min: 0, max: 0.6, step: 0.01, default: 0.25, section, when: (l) => l[`${k}Kind`] === 'ribbon' },
  { key: `${k}Freq2`, label: 'Frequency Y', type: 'range', min: 0.1, max: 24, step: 0.05, default: 1, section, when: (l) => ['waves', 'noise'].includes(l[`${k}Kind`]) },
  { key: `${k}Seed`, label: 'Seed', type: 'range', min: 1, max: 99, step: 1, default: 1, section, when: (l) => l[`${k}Kind`] === 'noise' },
]
export const FIELD_SCHEMA = [
  ...srcRows('f', 'Field'),
  ...srcRows('g', 'Field'),
  { key: 'gInv', label: 'Invert second', type: 'toggle', default: false, section: 'Field', when: (l) => l.gKind && l.gKind !== 'none' },
  { key: 'fOp', label: 'Combine', type: 'select', default: 'max', section: 'Field', when: (l) => l.gKind && l.gKind !== 'none',
    options: ['max', 'min', 'add', 'multiply', 'screen', 'diff'].map((v) => ({ value: v, label: v[0].toUpperCase() + v.slice(1) })) },
  { key: 'fFrom', label: 'From', type: 'range', min: 0, max: 1, step: 0.01, default: 0, section: 'Field' },
  { key: 'fTo', label: 'To', type: 'range', min: 0, max: 1, step: 0.01, default: 1, section: 'Field' },
  { key: 'fContrast', label: 'Contrast', type: 'range', min: 0.2, max: 4, step: 0.05, default: 1, section: 'Field' },
  { key: 'fGamma', label: 'Gamma', type: 'range', min: 0.2, max: 4, step: 0.05, default: 1, section: 'Field' },
  { key: 'fSteps', label: 'Steps', type: 'range', min: 0, max: 12, step: 1, default: 0, format: (v) => (v < 2 ? 'Smooth' : `${v}`), section: 'Field' },
  { key: 'fInvert', label: 'Invert', type: 'toggle', default: false, section: 'Field' },
  { key: 'fSplit', label: 'Split at', type: 'range', min: 0, max: 1, step: 0.01, default: 0, format: (v) => (v ? `${Math.round(v * 100)}%` : 'Off'), section: 'Field' },
]
export const MASK_SCHEMA = [
  { key: 'mKind', label: 'Mask', type: 'select', default: 'none', section: 'Mask',
    options: ['none', 'rect', 'ellipse', 'circle', 'hourglass', 'diamond', 'octagon', 'arch', 'letter', 'layer'].map((v) => ({ value: v, label: { layer: 'Linked layer' }[v] ?? v[0].toUpperCase() + v.slice(1) })) },
  { key: 'mSize', label: 'Size', type: 'range', min: 0.2, max: 1.5, step: 0.01, default: 1, section: 'Mask', when: (l) => !['none', 'rect', 'letter', 'layer'].includes(l.mKind ?? 'none') },
  ...[['mX', 'Centre X', 0.5], ['mY', 'Centre Y', 0.5], ['mW', 'Width', 1], ['mH', 'Height', 1]].map(([key, label, d]) =>
    ({ key, label, type: 'range', min: 0, max: 1, step: 0.01, default: d, section: 'Mask', when: (l) => l.mKind === 'rect' })),
  /* LETTER (W4 § 4.1): a character in a Right Grotesk cut; the outline is resolved by the editor */
  { key: 'mChar', label: 'Letter', type: 'text', default: 'A', section: 'Mask', when: (l) => l.mKind === 'letter' },
  { key: 'mCut', label: 'Cut', type: 'select', default: 'base', section: 'Mask', when: (l) => l.mKind === 'letter',
    options: [['base', 'Display'], ['Compact', 'Compact'], ['Tall', 'Tall'], ['Wide', 'Wide'], ['Narrow', 'Narrow'], ['Spatial', 'Spatial'], ['Tight', 'Tight']].map(([value, label]) => ({ value, label })) },
  { key: 'mWeight', label: 'Weight', type: 'select', default: 700, section: 'Mask', when: (l) => l.mKind === 'letter',
    options: [[100, 'Fine'], [300, 'Light'], [400, 'Regular'], [500, 'Medium'], [600, 'Dark'], [700, 'Bold'], [900, 'Black']].map(([value, label]) => ({ value, label })) },
  { key: 'mFit', label: 'Fit', type: 'range', min: 0.2, max: 1.2, step: 0.01, default: 0.9, format: (v) => `${Math.round(v * 100)}%`, section: 'Mask', when: (l) => l.mKind === 'letter' },
  { key: 'mWaist', label: 'Waist', type: 'range', min: 0, max: 0.5, step: 0.01, default: 0.08, section: 'Mask', when: (l) => l.mKind === 'hourglass' },
]
export const WARP_SCHEMA = [
  { key: 'wKind', label: 'Warp', type: 'select', default: 'none', section: 'Warp',
    options: ['none', 'pinch', 'bulge', 'wave', 'swirl', 'noise', 'flow', 'field', 'mesh', 'surface'].map((v) => ({ value: v, label: v[0].toUpperCase() + v.slice(1) })) },
  { key: 'wTarget', label: 'Bends', type: 'segmented', default: 'grid', section: 'Warp', when: (l) => (l.wKind ?? 'none') !== 'none',
    options: [{ value: 'grid', label: 'Grid' }, { value: 'field', label: 'Field' }] },
  { key: 'wPin', label: 'Pin edges', type: 'toggle', default: false, section: 'Warp', when: (l) => (l.wKind ?? 'none') !== 'none' },
  { key: 'wAmt', label: 'Amount', type: 'range', min: -1, max: 1, step: 0.01, default: 0.2, section: 'Warp', when: (l) => (l.wKind ?? 'none') !== 'none' },
  { key: 'wFreq', label: 'Frequency', type: 'range', min: 0.2, max: 8, step: 0.05, default: 1, section: 'Warp', when: (l) => (l.wKind ?? 'none') !== 'none' },
  { key: 'wMesh', label: 'Mesh', type: 'text', default: '', rows: 2, placeholder: 'CxR|dx…|dy…', section: 'Warp', when: (l) => l.wKind === 'mesh' },
  { key: 'wSurfX', label: 'Surface X', type: 'text', default: '', rows: 2, section: 'Warp', when: (l) => l.wKind === 'surface' },
  { key: 'wSurfY', label: 'Surface Y', type: 'text', default: '', rows: 2, section: 'Warp', when: (l) => l.wKind === 'surface' },
  { key: 'wAngle', label: 'Push angle', type: 'range', min: -180, max: 180, step: 1, default: 0, format: (v) => `${v}°`, section: 'Warp', when: (l) => l.wKind === 'field' },
  { key: 'wSeed', label: 'Seed', type: 'range', min: 1, max: 99, step: 1, default: 3, section: 'Warp', when: (l) => ['noise', 'flow'].includes(l.wKind) },
  { key: 'wX', label: 'Centre X', type: 'range', min: 0, max: 1, step: 0.01, default: 0.5, section: 'Warp', when: (l) => ['bulge', 'swirl'].includes(l.wKind) },
  { key: 'wY', label: 'Centre Y', type: 'range', min: 0, max: 1, step: 0.01, default: 0.5, section: 'Warp', when: (l) => ['bulge', 'swirl'].includes(l.wKind) },
]
