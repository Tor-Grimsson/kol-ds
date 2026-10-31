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

/* any SVG path `d`, filled solid black on white, centred and scaled to `fit` of the frame — kol-fxr's `vectorCanvas`
 * for a bare path: synchronous (no image decode), the bounds measured by the browser's own SVG `getBBox` */
export function pathCanvas(d, aspect, fit = 0.6, W = 400) {
  const H = Math.max(1, Math.round(W / aspect))
  const c = document.createElement('canvas')
  c.width = W; c.height = H
  const g = c.getContext('2d')
  g.fillStyle = '#fff'; g.fillRect(0, 0, W, H)
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  svg.setAttribute('style', 'position:absolute;width:0;height:0;overflow:hidden')
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
  path.setAttribute('d', d)
  svg.appendChild(path)
  document.body.appendChild(svg)
  let b
  try { b = path.getBBox() } finally { svg.remove() }
  if (!b.width || !b.height) return c
  const k = Math.min(W / b.width, H / b.height) * fit
  g.setTransform(k, 0, 0, k, (W - b.width * k) / 2 - b.x * k, (H - b.height * k) / 2 - b.y * k)
  g.fillStyle = '#000'
  g.fill(new Path2D(d))
  return c
}
