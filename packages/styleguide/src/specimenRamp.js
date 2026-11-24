/**
 * The Specimen kit's data (type-ramp plan 7.5): the ramp's rows and steps, read off kol-theme's
 * `--kol-ramp-size-*` / `--kol-ramp-line-height-*` tokens (kol-typography.css, 48 steps), and the font helpers every
 * Specimen part shares. A sheet's font is a prop — `{ family, weights: [{ name, value }], link, role, tracking? }` —
 * passed down; nothing here names a font.
 */
const steps = (prefix, n) => Array.from({ length: n }, (_, i) => `${prefix}${i + 1}`)

export const RAMP = [
  { row: 'Display', steps: steps('d', 6) },
  { row: 'Heading', steps: steps('h', 6) },
  { row: 'Text', steps: steps('t', 12) },
  { row: 'Utility', steps: steps('u', 12) },
  { row: 'Label', steps: steps('l', 12) },
]

/** a step's size and line height as the ramp tokens (`d1` → var(--kol-ramp-size-d1) …) */
export const rampType = (step) => ({
  fontSize: `var(--kol-ramp-size-${step})`,
  lineHeight: `var(--kol-ramp-line-height-${step})`,
})

/** the sheet font's CSS stack; no font, the KOL sans */
export const fontStack = (font) => (font?.family ? `"${font.family}", var(--kol-font-family-sans)` : 'var(--kol-font-family-sans)')
