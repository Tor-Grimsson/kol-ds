import { MoodTile } from '@kolkrabbi/kol-styleguide'

export const stage = 'lg'

/* Inline "KOL" wordmark — a self-contained brand node (currentColor so the
 * overlay's ink drives its fill). The component takes a consumer logo node; no
 * brand-app import needed. */
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

export default function MoodTileDemo() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <MoodTile src="/kol-images/tt-01.jpg" alt="Plate 01" logo={WORDMARK} caption="Editorial — logo lockup over image" />
      <MoodTile src="/kol-images/tt-02.jpg" alt="Plate 02" logo={WORDMARK} caption="Cover crop — centered overlay" />
      <MoodTile src="/kol-images/tt-03.jpg" alt="Plate 03" caption="No overlay — image only" />
      <MoodTile src="/kol-images/tt-04.jpg" alt="Plate 04" logo={WORDMARK} overlay={false} caption="Overlay off — logo suppressed" />
    </div>
  )
}
