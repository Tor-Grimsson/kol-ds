import { RatioBar, DEFAULT_PALETTE } from '@kolkrabbi/kol-styleguide'

export const stage = 'lg'

/* Inline "KOL" wordmark for the primary slab's logo slot — consumer-injected,
 * currentColor so the slab's computed ink drives its fill. */
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

/* A second palette — RatioBar reads primary / secondary / light and flips the
 * ink per slab via fgOn, so a dark composition proves the luminance chooser. */
const DUSK = {
  id: 'dusk',
  label: 'Dusk',
  primary: '#222D3D',
  secondary: '#AD5038',
  light: '#FAF7F0',
  dark: '#0F1622',
  accent: '#FFCF33',
}

/* The 60 / 30 / 10 proportion stage: neutral 60, secondary 30, primary 10. */
export default function RatioBarDemo() {
  return (
    <>
      <RatioBar palette={DEFAULT_PALETTE} logo={WORDMARK} />
      <RatioBar palette={DUSK} />
    </>
  )
}
