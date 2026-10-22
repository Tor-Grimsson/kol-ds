/**
 * typeScale — a modular type scale from two inputs: a base size and a musical ratio.
 *
 * Carried from kol-atlas `components/graphics/ScaleLab.jsx` (2026-10-20). Each step is base × ratio^n,
 * rounded to a whole px; line heights snap up to the 4px grid (1.2 for display and headings, 1.5 for
 * text). The ramp owes nothing to KOL's own type scale — it is a brand's.
 */
export const TYPE_RATIOS = [
  { id: 'M2', label: 'Major 2nd', ratio: 9 / 8, note: '9:8', about: 'The gentlest step, with neighbouring sizes close together. It suits dense interfaces and long documents, where hierarchy comes from weight and spacing more than from size.' },
  { id: 'm3', label: 'Minor 3rd', ratio: 6 / 5, note: '6:5', about: 'A modest step with clear but quiet contrast between levels. It works for product interfaces and editorial text that need order and calm rather than drama.' },
  { id: 'M3', label: 'Major 3rd', ratio: 5 / 4, note: '5:4', about: 'A balanced step and a common default for websites. Headings stand apart from body text, while the largest sizes stay practical for headlines and page titles.' },
  { id: 'P4', label: 'Perfect 4th', ratio: 4 / 3, note: '4:3', about: 'A confident step with strong contrast between levels. It suits marketing pages and brand material, where headlines lead and body text supports them below.' },
  { id: 'A4', label: 'Augmented 4th', ratio: Math.SQRT2, note: '1:√2', about: 'The ratio of A-series paper, set between a fourth and a fifth. Its large jumps read as deliberate and architectural, suited to print and structured layouts.' },
  { id: 'P5', label: 'Perfect 5th', ratio: 3 / 2, note: '3:2', about: 'A wide step, with few sizes far apart. It suits posters, decks and expressive layouts, where display type carries the page and body text stays secondary.' },
  { id: 'G', label: 'Golden ratio', ratio: (1 + Math.sqrt(5)) / 2, note: '1:φ', about: 'The widest step here, where sizes grow fast. It is best kept to display and editorial work, since the text end of the scale thins out quickly.' },
]

/* step n from the base; `face` is which of the brand's faces sets it, `k` the line-height factor */
export const TYPE_STEPS = [
  { id: 'display-1', role: 'Display 1', n: 6, face: 'display', k: 1.2 },
  { id: 'display-2', role: 'Display 2', n: 5, face: 'display', k: 1.2 },
  { id: 'heading-1', role: 'Heading 1', n: 4, face: 'display', k: 1.2 },
  { id: 'heading-2', role: 'Heading 2', n: 3, face: 'heading', k: 1.2 },
  { id: 'heading-3', role: 'Heading 3', n: 2, face: 'heading', k: 1.2 },
  { id: 'heading-4', role: 'Heading 4', n: 1, face: 'heading', k: 1.2 },
  { id: 'body', role: 'Body', n: 0, face: 'text', k: 1.5 },
  { id: 'small', role: 'Small', n: -1, face: 'text', k: 1.5 },
]

const GRID = 4
export const DEFAULT_TYPE_SCALE = { base: 16, ratio: 'P4' }

/** the steps for `{ base, ratio }` (ratio is a TYPE_RATIOS id) — each with `size` and `lh` in px */
export function typeScale({ base, ratio } = DEFAULT_TYPE_SCALE) {
  const r = (TYPE_RATIOS.find((x) => x.id === ratio) ?? TYPE_RATIOS[3]).ratio
  return TYPE_STEPS.map((s) => {
    const size = Math.round(base * r ** s.n)
    return { ...s, size, lh: Math.ceil((size * s.k) / GRID) * GRID }
  })
}

/** the scale as CSS custom properties — `--<prefix>-<step>-size` / `-lh` */
export function typeScaleCss(value, prefix = 'type') {
  return [':root {', ...typeScale(value).flatMap((s) => [`  --${prefix}-${s.id}-size: ${s.size}px;`, `  --${prefix}-${s.id}-lh: ${s.lh}px;`]), '}'].join('\n')
}
