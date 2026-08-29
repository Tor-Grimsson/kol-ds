/**
 * toneClass — the control set's ONE sunken tone (ControlToneSunken,
 * kol-website 2026-08-28; user ruling: it is not "inverse" — the control does
 * not invert anything, it sits BELOW the plane it is on — call it `sunken`).
 * `inverse` (0.117.0's name) is an alias: every consumer on it renders the same
 * pixel. The rules are kol-theme's `.kol-tone-sunken`.
 */
export const toneClass = (tone) => (tone === 'sunken' || tone === 'inverse' ? 'kol-tone-sunken' : '')
