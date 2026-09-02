/* ONE surface prop across the section family (SectionBackgroundProp, kol-website
 * 2026-08-27 — user: "ALL section family should pass bg as props"). A named
 * surface, `none`, or a raw utility / token string for the odd case
 * (`'bg-fg-ab-16'`). Each section's default is what it painted before,
 * so nothing moves on the bump. `theme` keeps scoping ink; this is the paint. */
export const SURFACES = {
  primary: 'bg-surface-primary',
  secondary: 'bg-surface-secondary',
  tertiary: 'bg-surface-tertiary',
  inverse: 'bg-surface-inverse',
  auto: 'bg-auto',
  none: '',
}
export const surfaceClass = (background, fallback = 'none') => {
  const key = background ?? fallback
  return key in SURFACES ? SURFACES[key] : key
}
