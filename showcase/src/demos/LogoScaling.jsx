import { LogoScaling } from '@kolkrabbi/kol-styleguide'

export const stage = 'full'

/* Two consumer-injected variants: a square logomark and the horizontal
 * wordmark. Each `node` fills its cell (width-constrained box), so the mark
 * scales with the pixel step. `widthMul` widens the wordmark column. */
const LOGOMARK = (
  <svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="KOL mark">
    <rect x="1.5" y="1.5" width="37" height="37" rx="4" fill="none" stroke="currentColor" strokeWidth="2.5" />
    <text
      x="20"
      y="28"
      textAnchor="middle"
      fontFamily="'Right Grotesk', sans-serif"
      fontWeight="700"
      fontSize="22"
      fill="currentColor"
    >
      K
    </text>
  </svg>
)

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

const VARIANTS = [
  { label: 'Logomark', node: LOGOMARK, widthMul: 1 },
  { label: 'Wordmark', node: WORDMARK, widthMul: 3 },
]

export default function LogoScalingDemo() {
  return <LogoScaling variants={VARIANTS} steps={[96, 64, 48, 32, 24, 16, 12, 8]} />
}
