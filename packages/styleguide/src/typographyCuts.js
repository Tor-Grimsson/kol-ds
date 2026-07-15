/**
 * typographyCuts — Right Grotesk cut / weight / case data for TypeBlock.
 *
 * Ported from the monorepo apps/brand styleguide (`data/typography-cuts.js`,
 * 2026-07). The port keeps the shared, framework-agnostic helpers a specimen
 * consumer needs — the weight list, the cut list, and `familyFor` (the
 * cut-key → CSS `font-family` resolver whose strings name the theme's Right
 * Grotesk / JetBrains Mono `@font-face` declarations). Consumer-facing control
 * UIs read WEIGHTS / CUTS / CASES to build their dropdowns.
 *
 * Deviations from source:
 *   • `applyCase` (JS string mutation: toUpperCase / charAt(0).toUpperCase())
 *     is NOT ported — KOL forbids JS-side casing of content. TypeBlock drives
 *     case through the CSS `text-transform` keyword instead (see CASES), so
 *     the sample string is never mutated. Sentence-case is dropped; author the
 *     sample string in the case it should render (KOL "default to authoring").
 *   • `familyFor`'s parameter is renamed `cut` (was `width`); behaviour is
 *     identical.
 */

/* Right Grotesk weight axis — PP naming convention.
 * Fine 100 · Light 300 · Regular 400 · Medium 500 · Dark 600 · Bold 700 · Black 900. */
export const WEIGHTS = [
  { id: 100, label: 'Fine' },
  { id: 300, label: 'Light' },
  { id: 400, label: 'Regular' },
  { id: 500, label: 'Medium' },
  { id: 600, label: 'Dark' },
  { id: 700, label: 'Bold' },
  { id: 900, label: 'Black' },
]

/* Right Grotesk cuts loaded by the theme (@font-face in kol-typography.css),
 * plus the mono escape hatch (JetBrains Mono, kol-typography-mono.css). `id` is
 * the key passed to TypeBlock's `cut` prop and to `familyFor`. */
export const CUTS = [
  { id: 'base', label: 'Right Grotesk' },
  { id: 'Narrow', label: 'Narrow' },
  { id: 'Compact', label: 'Compact' },
  { id: 'Tall', label: 'Tall' },
  { id: 'Wide', label: 'Wide' },
  { id: 'Spatial', label: 'Spatial' },
  { id: 'Tight', label: 'Tight' },
  { id: 'Text', label: 'Text' },
  { id: 'mono', label: 'JetBrains Mono' },
]

/* Case control — the four CSS `text-transform` keywords TypeBlock understands.
 * `id` is the value passed straight to the `case` prop → CSS text-transform.
 * Default is `none` (render the string exactly as authored). */
export const CASES = [
  { id: 'none', label: 'As authored' },
  { id: 'uppercase', label: 'Uppercase' },
  { id: 'lowercase', label: 'Lowercase' },
  { id: 'capitalize', label: 'Capitalize' },
]

/**
 * familyFor — resolve a cut key to a CSS `font-family` string.
 * The returned name matches a theme `@font-face` family: 'JetBrains Mono'
 * (mono token), 'Right Grotesk' (base), or 'Right Grotesk <Cut>' for a width
 * variant (Narrow / Compact / Tall / Wide / Spatial / Tight / Text).
 */
export const familyFor = (cut) => {
  if (cut === 'mono') return 'JetBrains Mono'
  if (cut === 'base') return 'Right Grotesk'
  return `Right Grotesk ${cut}`
}
