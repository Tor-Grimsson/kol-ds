/* The controls' shared pickers (plan-2026-10-31-menu-engine W3.1). A control takes its tone from a WRAPPER — one
 * `kol-tone-*` class on any ancestor, the trigger and its portalled panel follow — so every control preview wraps its
 * instance in `toneClass(tone)` instead of stamping the tone on the control. */
export const CONTROL_TONES = ['default', 'primary', 'secondary', 'inverted', 'outline', 'ghost', 'grey', 'faint', 'sunken']
export const ALIGNS = ['start', 'end']
export const toneWrap = (tone) => (tone && tone !== 'default' ? `kol-tone-${tone}` : '')
