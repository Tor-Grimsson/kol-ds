/**
 * toneClass — the control set's TONE, six values (tone-is-the-ground-axis,
 * kol-client-olina 2026-09-03; the six-tone list is the user's).
 *
 *   primary · secondary · inverted · outline · ghost · grey · sunken
 *
 * `secondary` paints the PAGE SURFACE and `inverted` the text colour as fill
 * (tone-secondary-is-inverse, 2026-09-03; user: "that tone should be called
 * secondary. What is currently secondary should be called inverted") — 0.134.0
 * had lifted `secondary` from Button's variant, which was already an inverse.
 *
 * A tone is a ground-and-ink bundle — `--kol-tone-*` custom properties in
 * kol-theme (kol-components-molecules.css, TONE) that every control paints
 * from. `default` is NOT a tone: it is the absence of one — the control
 * inherits its wrapper's tone (one `kol-tone-*` class on any ancestor), else
 * its family's fallback. That is the whole mechanism of "get a set with it
 * already set": nothing is stamped, so the inheritance is not blocked.
 *
 * `inverse` is `sunken`'s alias (0.117.0's name — ControlToneSunken,
 * kol-website 2026-08-28; user ruling: the control does not invert anything,
 * it sits BELOW the plane it is on) — NOT `inverted`; one kol-website call
 * still passes it, and it drops when that moves.
 */
export const TONES = ['primary', 'secondary', 'inverted', 'outline', 'ghost', 'grey', 'sunken']

export const toneClass = (tone) =>
  tone === 'inverse' ? 'kol-tone-sunken' : TONES.includes(tone) ? `kol-tone-${tone}` : ''

/* the properties a bundle sets — Dropdown copies them from its trigger onto
 * the PORTALLED panel, which the cascade cannot reach */
export const TONE_VARS = [
  'bg', 'image', 'fg', 'border',
  'hover-bg', 'hover-image', 'hover-fg', 'hover-border',
  'active-bg', 'active-image',
  'pressed-bg', 'pressed-image', 'pressed-fg',
  'panel-bg', 'panel-border-w', 'panel-border',
].map((k) => `--kol-tone-${k}`)
