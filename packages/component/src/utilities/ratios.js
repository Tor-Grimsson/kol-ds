/* The export-specs ladder (the img-canvas.sh presets) — kol-r2b2's lib/ratios.js,
 * promoted verbatim 2026-08-27 (MediaLibraryPages). The column preview frame
 * takes the NEAREST of these to the file's own ratio, so a story-shaped image
 * gets a tall box and a banner a wide one instead of everything letterboxed
 * into a square. Nearest by LOG distance: ratios are multiplicative. 2:3 / 3:2
 * are deliberately out — not img-canvas presets. */
export const RATIOS = [[9, 16], [3, 5], [4, 5], [1, 1], [5, 4], [5, 3], [16, 9]]

export function nearestRatio(w, h) {
  if (!w || !h) return '1 / 1'
  const target = Math.log(w / h)
  let best = { d: Infinity, css: '1 / 1' }
  for (const [a, b] of RATIOS) {
    const d = Math.abs(Math.log(a / b) - target)
    if (d < best.d) best = { d, css: `${a} / ${b}` }
  }
  return best.css
}
