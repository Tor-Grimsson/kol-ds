// Shapes — the density sources the growing line reads with `densityFrom`: dark on light, at the frame's aspect.
// The one DOM in this engine (as `densityFrom` itself): a shape is a canvas, so these run in a browser.

/* the built-in orb, kol-fxr's `sourceCanvas('orb')` carried verbatim: a radial gradient, black at the centre */
export function orbCanvas(aspect, W = 400) {
  const H = Math.max(1, Math.round(W / aspect))
  const c = document.createElement('canvas')
  c.width = W; c.height = H
  const g = c.getContext('2d')
  g.fillStyle = '#fff'; g.fillRect(0, 0, W, H)
  const r = Math.min(W, H) * 0.46
  const grd = g.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, r)
  grd.addColorStop(0, '#000'); grd.addColorStop(1, '#fff')
  g.fillStyle = grd; g.fillRect(0, 0, W, H)
  return c
}

/* a path `d` measured by the browser's own SVG (`getBBox`), and the scale + offset that centre it at `fit` of W × H */
function placed(d, W, H, fit, read) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  svg.setAttribute('style', 'position:absolute;width:0;height:0;overflow:hidden')
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
  path.setAttribute('d', d)
  svg.appendChild(path)
  document.body.appendChild(svg)
  try {
    const b = path.getBBox()
    if (!b.width || !b.height) return null
    const k = Math.min(W / b.width, H / b.height) * fit
    return read(path, k, (W - b.width * k) / 2 - b.x * k, (H - b.height * k) / 2 - b.y * k)
  } finally { svg.remove() }
}

/* any SVG path `d`, filled solid black on white, centred and scaled to `fit` of the frame — kol-fxr's `vectorCanvas`
 * for a bare path: synchronous (no image decode) */
export function pathCanvas(d, aspect, fit = 0.6, W = 400) {
  const H = Math.max(1, Math.round(W / aspect))
  const c = document.createElement('canvas')
  c.width = W; c.height = H
  const g = c.getContext('2d')
  g.fillStyle = '#fff'; g.fillRect(0, 0, W, H)
  const t = placed(d, W, H, fit, (_, k, tx, ty) => [k, tx, ty])
  if (!t) return c
  g.setTransform(t[0], 0, 0, t[0], t[1], t[2])
  g.fillStyle = '#000'
  g.fill(new Path2D(d))
  return c
}

/* the same path's outline as a ring in 0..1, placed as `pathCanvas` places it — `n` points along its length, for
 * `Growth.seed({ points })` (GrowthLineSeedOutline, kol-atlas 2026-11-01). ponytail: a `d` with several subpaths is walked
 * as one ring (getPointAtLength joins them); split on `M` if a multi-part mark needs it */
export function pathRing(d, aspect, fit = 0.6, n = 512) {
  const W = 1, H = 1 / aspect
  return placed(d, W, H, fit, (path, k, tx, ty) => {
    const L = path.getTotalLength(), out = []
    for (let i = 0; i < n; i++) { const p = path.getPointAtLength((i / n) * L); out.push([(p.x * k + tx) / W, (p.y * k + ty) / H]) }
    return out
  })
}
