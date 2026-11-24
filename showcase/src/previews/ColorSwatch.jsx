import { ColorSwatch } from '@kolkrabbi/kol-component'

/* Color is a PROPERTY, not a variant (user ruling 2026-08-09) — the demo
 * shows the STATES on one color: rest, selected, and no-color. Size rides
 * the toolbar picker. */
export const variants = ['default', 'halo', 'folio', 'kolbox']
export const sizes = [24, 32]

export default function ColorSwatchPreview({ variant = 'default', size = 24 }) {
  /* kolbox (Folio on kolbox, 2026-11-22): SwatchGrid kolbox's cell as one chip: rest, selected, unframed */
  if (variant === 'kolbox') return (
    <div className="flex items-center gap-2">
      <ColorSwatch variant="kolbox" hex="#AD5038" title="Red" aria-label="Red" size={size} onClick={() => {}} />
      <ColorSwatch variant="kolbox" hex="#AD5038" title="Red" aria-label="Red" size={size} selected onClick={() => {}} />
      <ColorSwatch variant="kolbox" hex="#427b58" frame={false} aria-label="Teal" size={size} onClick={() => {}} />
    </div>
  )
  /* folio (Folio batch C): Folio's Swatch, framed, selected, and an accent swatch painted by data-folio-accent */
  if (variant === 'folio') return (
    <div className="flex items-center gap-2">
      <ColorSwatch variant="folio" hex="#AD5038" aria-label="Red" onClick={() => {}} />
      <ColorSwatch variant="folio" hex="#AD5038" aria-label="Red" selected onClick={() => {}} />
      <ColorSwatch variant="folio" hex="var(--kol-folio-green)" frame={false} data-folio-accent="blue" aria-label="blue" onClick={() => {}} />
    </div>
  )
  return (
    <div className="flex items-center gap-2">
      <ColorSwatch hex="#AD5038" variant={variant} size={size} />
      <ColorSwatch hex="#AD5038" variant={variant} size={size} selected />
      <ColorSwatch variant={variant} size={size} showTransparent />
    </div>
  )
}
