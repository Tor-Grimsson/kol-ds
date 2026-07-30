/**
 * color-math.js — hex ⇄ HSV ⇄ HSL and WCAG contrast.
 *
 * The DS's picker family (`SpectrumControls`) is deliberately colour-math-only
 * and never converts — its header says conversion "lives at the call site".
 * This is that call site's shared copy, so the blocks demo and the foundations
 * tuner stop each carrying their own.
 *
 * HSV is what the picker speaks ({ hue, sat, val }); HSL is what a ramp's
 * relationships are legible in (lightness steps read as steps). Both are here
 * because the tuner needs to move between them on every keystroke.
 */

const clamp = (n, lo, hi) => Math.min(hi, Math.max(lo, n))

const toByte = (n) => clamp(Math.round(n), 0, 255).toString(16).padStart(2, '0').toUpperCase()

/** '#RGB' | '#RRGGBB' → [r, g, b] 0–255, or null when unparseable. */
export function hexToRgb(hex) {
  const d = String(hex ?? '').trim().replace(/^#/, '')
  const full = d.length === 3 ? d.split('').map((c) => c + c).join('') : d
  if (!/^[0-9a-f]{6}$/i.test(full)) return null
  return [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16))
}

export const rgbToHex = (r, g, b) => `#${toByte(r)}${toByte(g)}${toByte(b)}`

function rgbToHueChroma(r, g, b) {
  const R = r / 255, G = g / 255, B = b / 255
  const max = Math.max(R, G, B)
  const min = Math.min(R, G, B)
  const d = max - min
  let h = 0
  if (d) {
    if (max === R) h = ((G - B) / d) % 6
    else if (max === G) h = (B - R) / d + 2
    else h = (R - G) / d + 4
    h *= 60
    if (h < 0) h += 360
  }
  return { h, max, min, d }
}

/** → { hue, sat, val } in the shape SpectrumControls expects, or null. */
export function hexToHsv(hex) {
  const rgb = hexToRgb(hex)
  if (!rgb) return null
  const { h, max, d } = rgbToHueChroma(...rgb)
  return { hue: h, sat: max === 0 ? 0 : (d / max) * 100, val: max * 100 }
}

export function hsvToHex({ hue, sat, val }) {
  const s = clamp(sat, 0, 100) / 100
  const v = clamp(val, 0, 100) / 100
  const c = v * s
  const hh = (((hue % 360) + 360) % 360) / 60
  const x = c * (1 - Math.abs((hh % 2) - 1))
  const seg = hh < 1 ? [c, x, 0] : hh < 2 ? [x, c, 0] : hh < 3 ? [0, c, x]
    : hh < 4 ? [0, x, c] : hh < 5 ? [x, 0, c] : [c, 0, x]
  const m = v - c
  return rgbToHex(...seg.map((n) => (n + m) * 255))
}

/** → { h, s, l } with s/l as 0–100, or null. */
export function hexToHsl(hex) {
  const rgb = hexToRgb(hex)
  if (!rgb) return null
  const { h, max, min, d } = rgbToHueChroma(...rgb)
  const l = (max + min) / 2
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1))
  return { h, s: s * 100, l: l * 100 }
}

export function hslToHex(h, s, l) {
  const S = clamp(s, 0, 100) / 100
  const L = clamp(l, 0, 100) / 100
  const c = (1 - Math.abs(2 * L - 1)) * S
  const hh = (((h % 360) + 360) % 360) / 60
  const x = c * (1 - Math.abs((hh % 2) - 1))
  const seg = hh < 1 ? [c, x, 0] : hh < 2 ? [x, c, 0] : hh < 3 ? [0, c, x]
    : hh < 4 ? [0, x, c] : hh < 5 ? [x, 0, c] : [c, 0, x]
  const m = L - c / 2
  return rgbToHex(...seg.map((n) => (n + m) * 255))
}

/** Relative luminance per WCAG 2.1. */
function luminance(hex) {
  const rgb = hexToRgb(hex)
  if (!rgb) return 0
  const [r, g, b] = rgb.map((n) => {
    const c = n / 255
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

/** Contrast ratio 1–21. Order-independent. */
export function contrastRatio(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}
