import { ClearspaceDiagram } from '@kolkrabbi/kol-styleguide'

export const stage = 'lg'

/* Mark + overlays on a shared 120×40 viewBox. ClearspaceDiagram fills its
 * parent (w-full h-full), so the demo supplies a sized, framed box. */
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

export default function ClearspaceDiagramDemo() {
  return (
    <div className="aspect-[2/1] w-full rounded-[4px] border border-fg-04 bg-fg-02 p-8 text-emphasis">
      <ClearspaceDiagram framework logo={WORDMARK} grid={GRID} keyline={KEYLINE} />
    </div>
  )
}
