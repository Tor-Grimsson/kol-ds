import { LogoCard } from '@kolkrabbi/kol-styleguide'

export const stage = 'lg'

/* Mark + construction overlays, all authored to one 120×40 viewBox so the grid
 * and x-height keyline align to the wordmark. All consumer-injected nodes. */
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

const GRID = (
  <svg viewBox="0 0 120 40" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    {[0, 12, 24, 36, 48, 60, 72, 84, 96, 108, 120].map((x) => (
      <line key={`v${x}`} x1={x} y1="0" x2={x} y2="40" stroke="currentColor" strokeWidth="0.25" opacity="0.3" />
    ))}
    {[0, 8, 16, 24, 32, 40].map((y) => (
      <line key={`h${y}`} x1="0" y1={y} x2="120" y2={y} stroke="currentColor" strokeWidth="0.25" opacity="0.3" />
    ))}
  </svg>
)

const KEYLINE = (
  <svg viewBox="0 0 120 40" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <rect x="6" y="6" width="108" height="28" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2" opacity="0.6" />
    <line x1="0" y1="10" x2="120" y2="10" stroke="currentColor" strokeWidth="0.4" opacity="0.55" />
    <line x1="0" y1="30" x2="120" y2="30" stroke="currentColor" strokeWidth="0.4" opacity="0.55" />
  </svg>
)

export default function LogoCardDemo() {
  return (
    <LogoCard
      caption="Wordmark — clearspace & grid"
      aspect="2 / 1"
      logo={WORDMARK}
      grid={GRID}
      keyline={KEYLINE}
      toggleLabel="Clearspace"
    />
  )
}
