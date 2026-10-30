/**
 * typeLab — the math behind TypeLab: a brand's type, from a base size and a ratio to every role it sets.
 *
 * Carried from kol-atlas `components/graphics/ScaleLab.jsx` (2026-10-20) as `typeScale`; grown into a brand's whole type
 * definition and renamed into the lab family (BrandLabToolGaps, kol-atlas 2026-10-29 — the user: *"the group of those
 * tools that generate should ship together … and have unified name system"*: `TypeLab` · `typeLab` · `typeLabCss` ·
 * `DEFAULT_TYPE_LAB`, beside the colour, combo and lockup labs).
 *
 *   Steps   base × ratio^n, rounded to a whole px; the line height is the step's factor × size, snapped up to the 4px
 *           grid. The factor is 1.2 for display and headings, 1.5 for text, and the brand's to tune (`leading`).
 *   Roles   what a brand sets text AS — sixteen, each on a step with its face (display · heading · text · mono), weight,
 *           tracking, case and ink (the colour lab's text levels). `roles` overrides any of them.
 *
 * The ramp owes nothing to KOL's own type scale — it is a brand's.
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

/* step n from the base; `face` is which of the brand's faces sets it, `k` the default line-height factor */
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

export const TYPE_FACES = ['display', 'heading', 'text', 'mono']
export const TYPE_CASES = ['none', 'upper', 'lower', 'title']
/* the colour lab's ink levels (colorLab `INK_LEVELS`), strongest first */
export const TYPE_INKS = ['emphasis', 'strong', 'lede', 'body', 'meta']

/* THE ROLES (kol-atlas apps/lab roles.css, 2026-10-29): sixteen roles on the eight steps — several share one. Tracking
 * is in em (−0.015 = −1.5 %). */
export const TYPE_ROLES = [
  { id: 'display-1', label: 'Display 1', step: 'display-1', face: 'display', weight: 700, tracking: -0.02, case: 'none', ink: 'emphasis' },
  { id: 'display-2', label: 'Display 2', step: 'display-2', face: 'display', weight: 700, tracking: -0.02, case: 'none', ink: 'emphasis' },
  { id: 'h1', label: 'Heading 1', step: 'heading-1', face: 'display', weight: 700, tracking: -0.015, case: 'none', ink: 'emphasis' },
  { id: 'h2', label: 'Heading 2', step: 'heading-2', face: 'heading', weight: 600, tracking: -0.01, case: 'none', ink: 'emphasis' },
  { id: 'h3', label: 'Heading 3', step: 'heading-3', face: 'heading', weight: 600, tracking: -0.005, case: 'none', ink: 'emphasis' },
  { id: 'h4', label: 'Heading 4', step: 'heading-4', face: 'heading', weight: 600, tracking: 0, case: 'none', ink: 'emphasis' },
  { id: 'h5', label: 'Heading 5', step: 'body', face: 'heading', weight: 600, tracking: 0, case: 'none', ink: 'emphasis' },
  { id: 'h6', label: 'Heading 6', step: 'small', face: 'heading', weight: 600, tracking: 0, case: 'none', ink: 'strong' },
  { id: 'quote', label: 'Quote', step: 'heading-4', face: 'heading', weight: 400, tracking: 0, case: 'none', ink: 'lede' },
  { id: 'lead', label: 'Lead', step: 'heading-4', face: 'text', weight: 400, tracking: 0, case: 'none', ink: 'lede' },
  { id: 'body', label: 'Body', step: 'body', face: 'text', weight: 400, tracking: 0, case: 'none', ink: 'body' },
  { id: 'small', label: 'Small', step: 'small', face: 'text', weight: 400, tracking: 0, case: 'none', ink: 'body' },
  { id: 'caption', label: 'Caption', step: 'small', face: 'text', weight: 400, tracking: 0, case: 'none', ink: 'meta' },
  { id: 'eyebrow', label: 'Eyebrow', step: 'small', face: 'mono', weight: 500, tracking: 0.08, case: 'upper', ink: 'meta' },
  { id: 'label', label: 'Label', step: 'small', face: 'mono', weight: 500, tracking: 0.04, case: 'upper', ink: 'body' },
  { id: 'data', label: 'Data', step: 'small', face: 'mono', weight: 400, tracking: 0, case: 'none', ink: 'body' },
]

const GRID = 4
/** the lab's starting value; `leading` (stepId → factor) and `roles` (roleId → partial role) override the defaults */
export const DEFAULT_TYPE_LAB = { base: 16, ratio: 'P4', leading: {}, roles: {} }

/** everything the lab draws, from its value: `{ ...value, ratio, steps, roles }` — steps with `size` and `lh` in px, roles
 *  resolved onto their step */
export function typeLab(value) {
  const v = { ...DEFAULT_TYPE_LAB, ...value }
  const ratio = TYPE_RATIOS.find((x) => x.id === v.ratio) ?? TYPE_RATIOS[3]
  const steps = TYPE_STEPS.map((s) => {
    const k = v.leading?.[s.id] ?? s.k
    const size = Math.round(v.base * ratio.ratio ** s.n)
    return { ...s, k, size, lh: Math.ceil((size * k) / GRID) * GRID }
  })
  const roles = TYPE_ROLES.map((r) => {
    const role = { ...r, ...v.roles?.[r.id] }
    const step = steps.find((s) => s.id === role.step) ?? steps[6]
    return { ...role, size: step.size, lh: step.lh }
  })
  return { ...v, ratio, steps, roles }
}

const CASE_CSS = { none: 'none', upper: 'uppercase', lower: 'lowercase', title: 'capitalize' }

/** the type as CSS: the faces, each step's size and line height, each role's settings as variables, and a `.type-<role>`
 *  class per role that reads them. `faces` (`{ display: { family }, … }`) fills the family variables; the ink reads the
 *  colour lab's `--<inkPrefix>-ink-<level>` */
export function typeLabCss(value, { prefix = 'type', faces = value?.faces, inkPrefix = 'brand' } = {}) {
  const t = typeLab(value)
  const v = (name, val) => `  --${prefix}-${name}: ${val};`
  return [
    ':root {',
    ...TYPE_FACES.filter((f) => faces?.[f]?.family).map((f) => v(`face-${f}`, faces[f].family)),
    ...t.steps.flatMap((s) => [v(`${s.id}-size`, `${s.size}px`), v(`${s.id}-lh`, `${s.lh}px`)]),
    ...t.roles.flatMap((r) => [
      v(`${r.id}-weight`, r.weight),
      v(`${r.id}-tracking`, `${r.tracking}em`),
    ]),
    '}',
    ...t.roles.map((r) => [
      `.${prefix}-${r.id} {`,
      `  font-family: var(--${prefix}-face-${r.face});`,
      `  font-size: var(--${prefix}-${r.step}-size);`,
      `  line-height: var(--${prefix}-${r.step}-lh);`,
      `  font-weight: var(--${prefix}-${r.id}-weight);`,
      `  letter-spacing: var(--${prefix}-${r.id}-tracking);`,
      `  text-transform: ${CASE_CSS[r.case] ?? 'none'};`,
      `  color: var(--${inkPrefix}-ink-${r.ink});`,
      '}',
    ].join('\n')),
  ].join('\n')
}

/* ── the names before the lab family (deprecated 2026-10-29, on the retirement ledger) ── */
/** @deprecated use `typeLab(value).steps` */
export const typeScale = (value) => typeLab(value).steps
/** @deprecated use `typeLabCss` — this emits the steps alone, as it did */
export function typeScaleCss(value, prefix = 'type') {
  return [':root {', ...typeScale(value).flatMap((s) => [`  --${prefix}-${s.id}-size: ${s.size}px;`, `  --${prefix}-${s.id}-lh: ${s.lh}px;`]), '}'].join('\n')
}
/** @deprecated use DEFAULT_TYPE_LAB */
export const DEFAULT_TYPE_SCALE = { base: 16, ratio: 'P4' }
