/**
 * Foundations display data — names only.
 *
 * These arrays say *what* to show and in what order. The actual values are read
 * LIVE from the loaded @kolkrabbi/kol-theme at render (getComputedStyle), so the
 * page can never drift from the real tokens. Swatch fills use `var(--token)`
 * directly, so they also re-colour instantly on light/dark toggle.
 */

// KOL's signature: a 14-stop translucent foreground (ink-over-surface) scale.
export const OPACITY_SCALE = ['01', '02', '04', '08', '12', '16', '24', '32', '40', '48', '64', '80', '88', '96']
  .map((n) => ({ token: `--kol-fg-${n}`, label: `fg-${n}` }))

export const FG_SEMANTIC = ['emphasis', 'strong', 'body', 'meta', 'subtle']
  .map((n) => ({ token: `--kol-fg-${n}`, label: `fg-${n}` }))

export const SURFACES = ['primary', 'secondary', 'tertiary', 'inverse']
  .map((n) => ({ token: `--kol-surface-${n}`, label: `surface-${n}` }))

export const BRAND_RAMPS = [
  { name: 'yellow', note: 'primary accent' },
  { name: 'orange', note: 'secondary' },
  { name: 'red', note: 'danger / urgent' },
  { name: 'blue', note: 'info' },
  { name: 'teal', note: 'success' },
  { name: 'cream', note: 'warm neutral' },
].map((r) => ({
  ...r,
  stops: [100, 200, 300, 400, 500].map((s) => ({ token: `--kol-color-${r.name}-${s}`, label: `${r.name}-${s}` })),
}))

export const GREY_RAMP = {
  name: 'grey',
  note: 'greyscale',
  stops: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((s) => ({ token: `--grey-${s}`, label: `grey-${s}` })),
}

export const TYPE_SCALE = [
  { cls: 'kol-prose-display', label: 'Display · D1', size: '80 / 80', sample: 'Design tools' },
  { cls: 'kol-prose-display-md', label: 'Display · D2', size: '64 / 68', sample: 'Design tools' },
  { cls: 'kol-prose-title', label: 'Title · D3', size: '56 / 60', sample: 'Section title' },
  { cls: 'kol-sans-heading-01', label: 'Heading 01', size: '', sample: 'Heading one' },
  { cls: 'kol-sans-heading-03', label: 'Heading 03', size: '', sample: 'Heading three' },
  { cls: 'kol-prose-lede', label: 'Lede', size: '24 / 28', sample: 'A quiet editorial lede that sits beneath a display.' },
  { cls: 'kol-sans-body-01', label: 'Body 01', size: '', sample: 'Body copy, set for reading at length without fatigue.' },
  { cls: 'kol-mono-14', label: 'Mono 14', size: '', sample: 'const token = "--kol-fg-08"' },
]

export const RADII = ['none', 'sm', 'md', 'lg', 'xl', '2xl', 'full']
  .map((n) => ({ token: `--kol-radius-${n}`, label: `radius-${n}` }))

export const SHADOWS = ['sm', 'md', 'lg', 'xl', 'inner']
  .map((n) => ({ token: `--kol-shadow-${n}`, label: `shadow-${n}` }))

// Flat token list for the live-resolve hook (TYPE_SCALE carries no vars).
export const ALL_TOKENS = [
  ...OPACITY_SCALE, ...FG_SEMANTIC, ...SURFACES,
  ...BRAND_RAMPS.flatMap((r) => r.stops), ...GREY_RAMP.stops,
  ...RADII, ...SHADOWS,
].map((t) => t.token)
