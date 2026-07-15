/**
 * colorMath — HSL/hex conversion + harmony generation for the KOL color
 * pickers (SpectrumControls, PaletteHarmonyWheel).
 *
 * Plain functions, not a hook — it lives in src/hooks/ because that is the
 * taxonomy's only non-component folder (same rationale as cssVar.js).
 *
 * Two harmony paths:
 *   - Deterministic — `harmonyColors(hue, harmony, {saturation, lightness})`
 *     / `generateHarmony(baseHex, harmony)`: role-offset hues off a base,
 *     no randomness, so dragging the harmony wheel is smooth + repeatable.
 *   - Seeded/jittered — `seedHarmony(baseHex, mode)`: slot 0 = the base,
 *     slots 1–5 derived via a mode with small random jitter, so consecutive
 *     "randomize" clicks produce related-but-different variants around a seed.
 */

/* ── HSL / hex conversion ─────────────────────────────────────────────── */

/** '#RRGGBB' → { h: 0–360, s: 0–100, l: 0–100 }. */
export function hexToHsl(hex) {
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0, s = 0
  const l = (max + min) / 2
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break
      case g: h = (b - r) / d + 2; break
      case b: h = (r - g) / d + 4; break
    }
    h *= 60
  }
  return { h, s: s * 100, l: l * 100 }
}

/** (h: 0–360, s: 0–100, l: 0–100) → uppercase '#RRGGBB'. */
export function hslToHex(h, s, l) {
  h = normHue(h)
  s = Math.max(0, Math.min(100, s)) / 100
  l = Math.max(0, Math.min(100, l)) / 100
  const c = (1 - Math.abs(2 * l - 1)) * s
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = l - c / 2
  let r = 0, g = 0, b = 0
  if      (h <  60) { r = c; g = x; b = 0 }
  else if (h < 120) { r = x; g = c; b = 0 }
  else if (h < 180) { r = 0; g = c; b = x }
  else if (h < 240) { r = 0; g = x; b = c }
  else if (h < 300) { r = x; g = 0; b = c }
  else              { r = c; g = 0; b = x }
  const toHex = (v) => Math.round((v + m) * 255).toString(16).padStart(2, '0')
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase()
}

/** RGB components (0–255) → uppercase '#RRGGBB'. Shared with the eyedropper. */
export function rgbToHex(r, g, b) {
  return '#' + [r, g, b]
    .map((n) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase()
}

/** Wrap any hue into [0, 360). */
export const normHue = (h) => ((h % 360) + 360) % 360

/* ── Harmony schemes ──────────────────────────────────────────────────── */

/**
 * Hue offsets for the five palette roles (Primary / Secondary / Light /
 * Dark / Accent) relative to the base hue. The wheel draws a satellite
 * marker per unique offset; the generators emit one color per role.
 */
export const HARMONIES = [
  { id: 'analogous',     label: 'Analogous',           roleOffsets: [0, -30, -15, 15, 30] },
  { id: 'complementary', label: 'Complementary',       roleOffsets: [0, 0, 0, 180, 180] },
  { id: 'split',         label: 'Split complementary', roleOffsets: [0, 150, 210, 0, 150] },
  { id: 'triadic',       label: 'Triadic',             roleOffsets: [0, 120, 240, 0, 120] },
  { id: 'tetradic',      label: 'Tetradic',            roleOffsets: [0, 90, 180, 270, 0] },
]

/** Resolve a harmony id string OR a harmony object to the object. */
export const harmonyById = (harmony) => {
  if (harmony && typeof harmony === 'object') return harmony
  return HARMONIES.find((h) => h.id === harmony) ?? HARMONIES[0]
}

/**
 * Deterministic role colors for a harmony, driven by a hue + fixed S/L.
 * Preserves saturation/lightness across roles (only hue rotates), so the
 * output tracks the wheel's satellite markers exactly.
 *
 * @param {number} hue      base hue, 0–360
 * @param {string|object} harmony  harmony id or object
 * @param {{saturation?: number, lightness?: number}} opts  base S/L (0–100)
 * @returns {string[]} one '#RRGGBB' per role offset
 */
export function harmonyColors(hue, harmony, { saturation = 100, lightness = 50 } = {}) {
  const { roleOffsets } = harmonyById(harmony)
  return roleOffsets.map((off) => hslToHex(normHue(hue + off), saturation, lightness))
}

/**
 * Deterministic role colors derived from a base hex (S/L taken from the hex).
 * Convenience wrapper over `harmonyColors` for callers holding a color, not
 * a hue.
 */
export function generateHarmony(baseHex, harmony) {
  const { h, s, l } = hexToHsl(baseHex)
  return harmonyColors(h, harmony, { saturation: s, lightness: l })
}

/* ── Seeded (jittered) modes ──────────────────────────────────────────── */

const jitter = (range) => (Math.random() - 0.5) * 2 * range

/**
 * Seed-based generators — slot 0 = the base, slots 1–5 derived via the mode.
 * Each call jitters parameters so repeated "randomize" produces visibly
 * different but harmonically-related variants around the same seed.
 */
const SEED_MODES = {
  random: (base) => {
    const { h, s, l } = hexToHsl(base)
    return [
      base,
      hslToHex(normHue(h + Math.random() * 360), s, l),
      hslToHex(normHue(h + Math.random() * 360), s, l),
      hslToHex(h, s, Math.max(10, l - 25 + jitter(10))),
      hslToHex(h, s, Math.min(90, l + 25 + jitter(10))),
      hslToHex(h, s * (0.4 + Math.random() * 0.4), l),
    ]
  },

  monochromatic: (base) => {
    const { h, s, l } = hexToHsl(base)
    const j = 8
    return [
      base,
      hslToHex(h, s, Math.max(10, l - 30 + jitter(j))),
      hslToHex(h, s, Math.max(20, l - 15 + jitter(j))),
      hslToHex(h, s, Math.min(85, l + 15 + jitter(j))),
      hslToHex(h, s, Math.min(95, l + 30 + jitter(j))),
      hslToHex(h, s, Math.min(98, l + 45 + jitter(j))),
    ]
  },

  analogous: (base) => {
    const { h, s, l } = hexToHsl(base)
    return [
      base,
      hslToHex(normHue(h - 30 + jitter(8)), s, l),
      hslToHex(normHue(h - 15 + jitter(8)), s, l),
      hslToHex(normHue(h + 15 + jitter(8)), s, l),
      hslToHex(normHue(h + 30 + jitter(8)), s, l),
      hslToHex(normHue(h + 45 + jitter(8)), s, l),
    ]
  },

  complementary: (base) => {
    const { h, s, l } = hexToHsl(base)
    return [
      base,
      hslToHex(h, s, Math.max(15, l - 25 + jitter(8))),
      hslToHex(h, s, Math.min(85, l + 25 + jitter(8))),
      hslToHex(normHue(h + 180 + jitter(10)), s, l),
      hslToHex(normHue(h + 180 + jitter(10)), s, Math.max(15, l - 15 + jitter(8))),
      hslToHex(normHue(h + 180 + jitter(10)), s, Math.min(85, l + 15 + jitter(8))),
    ]
  },

  triadic: (base) => {
    const { h, s, l } = hexToHsl(base)
    return [
      base,
      hslToHex(normHue(h + 120 + jitter(10)), s, l),
      hslToHex(normHue(h + 240 + jitter(10)), s, l),
      hslToHex(h, s, Math.min(85, l + 20 + jitter(8))),
      hslToHex(normHue(h + 120 + jitter(10)), s, Math.max(15, l - 20 + jitter(8))),
      hslToHex(normHue(h + 240 + jitter(10)), s, Math.min(85, l + 20 + jitter(8))),
    ]
  },

  doubleComplementary: (base) => {
    const { h, s, l } = hexToHsl(base)
    return [
      base,
      hslToHex(normHue(h + 90 + jitter(10)), s, l),
      hslToHex(normHue(h + 180 + jitter(10)), s, l),
      hslToHex(normHue(h + 270 + jitter(10)), s, l),
      hslToHex(h, s, Math.min(85, l + 20 + jitter(8))),
      hslToHex(normHue(h + 180 + jitter(10)), s, Math.max(15, l - 20 + jitter(8))),
    ]
  },
}

/** The available seed-mode ids (for a consumer's mode selector). */
export const SEED_MODE_IDS = Object.keys(SEED_MODES)

/**
 * Generate a jittered 6-color palette from a seed hex.
 *
 * @param {string} baseHex  the seed color, occupies slot 0
 * @param {string} mode     one of SEED_MODE_IDS (falls back to 'random')
 * @returns {string[]} six '#RRGGBB' values
 */
export function seedHarmony(baseHex, mode = 'random') {
  const gen = SEED_MODES[mode] ?? SEED_MODES.random
  return gen(baseHex)
}
