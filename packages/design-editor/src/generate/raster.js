/* GENERATE — a plain scanline rasteriser for the Marks list (plan 52).
 * Pixels are sampled at their centres (2×2 supersampled by default, see `raster`); every ring and circle ORs in, the nonzero union
 * the SVG draws. Used by the match and tune scripts so both score the same way, independent of any SVG
 * renderer. `s` = frame px per bitmap px. */
/* union fill: every ring and circle ORs into the bitmap (nonzero union, like the SVG) */
function rasterRaw(m, w, h, s) {
  const b = new Uint8Array(w * h)
  for (const p of m.polys) {
    let y0 = Infinity, y1 = -Infinity
    for (const q of p) { y0 = Math.min(y0, q[1]); y1 = Math.max(y1, q[1]) }
    for (let y = Math.max(0, Math.floor(y0 / s)); y <= Math.min(h - 1, Math.ceil(y1 / s)); y++) {
      const sy = (y + 0.5) * s, xs = []
      for (let i = 0, j = p.length - 1; i < p.length; j = i++) {
        const [xi, yi] = p[i], [xj, yj] = p[j]
        if ((yi > sy) !== (yj > sy)) xs.push(xi + ((sy - yi) * (xj - xi)) / (yj - yi))
      }
      xs.sort((a, c) => a - c)
      for (let k = 0; k + 1 < xs.length; k += 2) {
        for (let x = Math.max(0, Math.ceil(xs[k] / s - 0.5)); x <= Math.min(w - 1, Math.floor(xs[k + 1] / s - 0.5)); x++) b[y * w + x] = 255
      }
    }
  }
  /* a compound fills even-odd across its own rings (holes stay empty), then ORs in */
  for (const c of m.compounds ?? []) {
    let y0 = Infinity, y1 = -Infinity
    for (const p of c) for (const q of p) { y0 = Math.min(y0, q[1]); y1 = Math.max(y1, q[1]) }
    for (let y = Math.max(0, Math.floor(y0 / s)); y <= Math.min(h - 1, Math.ceil(y1 / s)); y++) {
      const sy = (y + 0.5) * s, xs = []
      for (const p of c) for (let i = 0, j = p.length - 1; i < p.length; j = i++) {
        const [xi, yi] = p[i], [xj, yj] = p[j]
        if ((yi > sy) !== (yj > sy)) xs.push(xi + ((sy - yi) * (xj - xi)) / (yj - yi))
      }
      xs.sort((a, q) => a - q)
      for (let k = 0; k + 1 < xs.length; k += 2) {
        for (let x = Math.max(0, Math.ceil(xs[k] / s - 0.5)); x <= Math.min(w - 1, Math.floor(xs[k + 1] / s - 0.5)); x++) b[y * w + x] = 255
      }
    }
  }
  for (const [cx, cy, r, ry = r] of m.circles) {
    for (let y = Math.max(0, Math.floor((cy - ry) / s)); y <= Math.min(h - 1, Math.ceil((cy + ry) / s)); y++) {
      const dy = (y + 0.5) * s - cy
      if (Math.abs(dy) > ry) continue
      const dx = r * Math.sqrt(1 - (dy * dy) / (ry * ry))
      for (let x = Math.max(0, Math.ceil((cx - dx) / s - 0.5)); x <= Math.min(w - 1, Math.floor((cx + dx) / s - 0.5)); x++) b[y * w + x] = 255
    }
  }
  return b
}

/* SUPERSAMPLED: draw at ss× and keep a pixel white when at least half its sub-samples are — the way the
   reference is prepared (its @2x PNG averaged down to 1× and thresholded at 50 %), so a dot smaller than a
   pixel still counts when the reference shows it */
export function raster(m, w, h, s, ss = 2) {
  if (ss <= 1) return rasterRaw(m, w, h, s)
  const W = w * ss, b = rasterRaw(m, W, h * ss, s / ss), out = new Uint8Array(w * h), half = (ss * ss) / 2
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    let c = 0
    for (let dy = 0; dy < ss; dy++) for (let dx = 0; dx < ss; dx++) if (b[(y * ss + dy) * W + x * ss + dx]) c++
    if (c >= half) out[y * w + x] = 255
  }
  return out
}
