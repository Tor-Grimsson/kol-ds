import { ComboLab, DEFAULT_PALETTE } from '@kolkrabbi/kol-styleguide'

export const stage = 'full'

/* Inline "KOL" wordmark dropped into the layout's logo slots. */
const WORDMARK = (
  <svg viewBox="0 0 120 40" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="KOL">
    <text
      x="60"
      y="30"
      textAnchor="middle"
      fontFamily="'Right Grotesk', sans-serif"
      fontWeight="700"
      fontSize="34"
      letterSpacing="1"
      fill="currentColor"
    >
      KOL
    </text>
  </svg>
)

/* Named palette set — a Palette toggle appears and Randomize picks among these.
 * Literal hex is content, mirroring the DS brand tokens. */
const PALETTES = [
  DEFAULT_PALETTE,
  {
    id: 'teal-rise',
    label: 'Teal rise',
    description: 'Teal hero · yellow spark · navy ink on cream',
    primary: '#49A0A2',
    secondary: '#FFCF33',
    light: '#FAF7F0',
    dark: '#222D3D',
    accent: '#DF760B',
  },
  {
    id: 'dusk',
    label: 'Dusk',
    description: 'Navy hero · rust secondary · cream surface',
    primary: '#222D3D',
    secondary: '#AD5038',
    light: '#FAF7F0',
    dark: '#0F1622',
    accent: '#FFCF33',
  },
]

export default function ComboLabDemo() {
  return <ComboLab palettes={PALETTES} layout="applied-card" logo={WORDMARK} />
}
