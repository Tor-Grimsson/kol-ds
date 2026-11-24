/**
 * Per-letter random axis — a deterministic weight per char index + seed, any
 * value on the family's wght axis (variable fonts since 2026-11-18; the old
 * pool of static (width, weight) cuts is in _tmp/2026-11-18-static-cuts/).
 * Same inputs → same output, so re-renders don't shuffle on every keystroke.
 * Scrubbing the seed (via the canvas blend handle) re-rolls the layout.
 */

function hash32(x) {
  x = (x | 0) >>> 0
  x = ((x ^ 61) ^ (x >>> 16)) >>> 0
  x = (x + (x << 3)) >>> 0
  x = (x ^ (x >>> 4)) >>> 0
  x = Math.imul(x, 0x27d4eb2d) >>> 0
  x = (x ^ (x >>> 15)) >>> 0
  return x
}

/** A whole weight in [min, max] for this char and seed. */
export function pickWeightFor(charIndex, seed, min = 100, max = 900) {
  const h = hash32(charIndex * 374761393 + (seed | 0) * 668265263)
  return Math.round(min + (h / 4294967295) * (max - min))
}

/* Seed derived from the frame's `blend` (0..1) — 5-digit prime range so small
 * scrubs visibly change the layout. */
export const seedFromBlend = (blend) => Math.floor((blend ?? 0) * 99991)
