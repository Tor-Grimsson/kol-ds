/* The Specimen kit's preview data (kol-styleguide, type-ramp plan 7.5): the three fonts the Figma Previews section
 * (library Styleguide page, 2153:1973) sets, the footer tables and notes. Data only; the components name no font.
 * Sizes and line heights are READ from kol-theme's --kol-ramp-* tokens, never typed here. */
import { RAMP } from '@kolkrabbi/kol-styleguide'

const W = (pairs) => pairs.map(([name, value]) => ({ name, value }))

export const INTER = {
  family: 'Inter',
  role: 'Text typeface',
  link: 'fonts.google.com/specimen/Inter',
  description: 'Inter is the text face, used for body text.',
  detail: 'Weights 100 to 900.',
  weights: W([['Thin', 100], ['Extra Light', 200], ['Light', 300], ['Regular', 400], ['Medium', 500], ['Semi Bold', 600], ['Bold', 700], ['Extra Bold', 800], ['Black', 900]]),
}

export const SPECIAL_GOTHIC = {
  family: 'Special Gothic',
  role: 'Display typeface',
  link: 'fonts.google.com/specimen/Special+Gothic',
  description: 'Special Gothic is the display face, used for display and headings.',
  detail: 'Weights 400 to 700.',
  /* the font sheet lists them heaviest first, as the Figma sheet does */
  weights: W([['Bold', 700], ['Semi Bold', 600], ['Medium', 500], ['Regular', 400]]),
}

export const MONO = {
  family: 'JetBrains Mono',
  role: 'Mono',
  weights: W([['Regular', 400], ['Medium', 500], ['Semi Bold', 600], ['Bold', 700]]),
}

/* Special Gothic is not in kol-theme: the page that shows it adds the Google Fonts link (consumer-served, as
 * Public Sans is) */
export const SPECIAL_GOTHIC_CSS = 'https://fonts.googleapis.com/css2?family=Special+Gothic:wght@400..700&display=swap'

/* a step's px value off the live token */
const px = (name) =>
  typeof document === 'undefined' ? NaN : parseFloat(getComputedStyle(document.documentElement).getPropertyValue(name))

/* Inter's tracking per step: its published dynamic-metrics curve (15-type-ramp.md, Formulas), em */
export const interTracking = () =>
  Object.fromEntries(RAMP.flatMap(({ steps }) => steps).map((s) => {
    const size = px(`--kol-ramp-size-${s}`)
    return [s, +(-0.0223 + 0.185 * Math.exp(-0.1745 * size)).toFixed(4)]
  }))

/* the Size ramp footer table, every step off the tokens */
export const RAMP_TABLE_COLUMNS = [
  { accessor: 'row', header: 'Row' },
  { accessor: 'step', header: 'Step' },
  { accessor: 'size', header: 'Size px' },
  { accessor: 'rem', header: 'Size rem' },
  { accessor: 'lh', header: 'Line height px' },
  { accessor: 'pct', header: 'Line height %' },
]
export const rampTableRows = () =>
  RAMP.flatMap(({ row, steps }) => steps.map((s) => {
    const size = px(`--kol-ramp-size-${s}`)
    const lh = px(`--kol-ramp-line-height-${s}`)
    return { row, step: s.toUpperCase(), size, rem: +(size / 16).toFixed(3), lh, pct: `${Math.round((lh / size) * 100)}%` }
  }))

/* the Parts footer table (the font sheet view) */
export const PARTS_COLUMNS = [
  { accessor: 'part', header: 'Part' },
  { accessor: 'setAs', header: 'Set as' },
]
export const PARTS_ROWS = [
  { part: 'Link', setAs: 'emphasis ink, the accent underline at 1.5px, 4 under' },
  { part: 'Bold and italic in running text', setAs: 'bold at 700 in KOL’s strong level; italic in the face’s italic' },
  { part: 'Button', setAs: 'KOL Button, inverted, full radius' },
  { part: 'Quote and callout surfaces', setAs: 'KOL’s 4% fill (fg-04), or the dark surface' },
  { part: 'Byline / meta line', setAs: 't-eyebrow' },
  { part: 'tl;dr label', setAs: 't-label' },
  { part: 'Code block', setAs: 't-data in a pre on the 4% fill' },
  { part: 'Image', setAs: 'Atlas reference photos (05-graphics), cropped to the slot' },
  { part: 'Text opacity', setAs: 'KOL’s levels: emphasis, strong, lede, body, meta' },
]

export const NOTE =
  'Guidelines, not rules: the UI rarely needs text under 11px (the ramp goes to 6 so nothing is ever missing); UI headings usually stay at or under about 32px, twice a 16px body, and the larger steps are for the website and brand.'

/* adds the Special Gothic link once */
export function loadSpecialGothic() {
  if (typeof document === 'undefined' || document.querySelector(`link[href="${SPECIAL_GOTHIC_CSS}"]`)) return
  const link = Object.assign(document.createElement('link'), { rel: 'stylesheet', href: SPECIAL_GOTHIC_CSS })
  document.head.appendChild(link)
}
