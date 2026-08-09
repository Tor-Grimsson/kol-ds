import { ColorSwatch } from '@kolkrabbi/kol-component'

/* Color is a PROPERTY, not a variant (user ruling 2026-08-09) — the demo
 * shows the STATES on one color: rest, selected, and no-color. Size rides
 * the toolbar picker. */
export const sizes = [24, 32]

export default function ColorSwatchDemo({ size = 24 }) {
  return (
    <div className="flex items-center gap-2">
      <ColorSwatch hex="#AD5038" size={size} />
      <ColorSwatch hex="#AD5038" size={size} selected />
      <ColorSwatch size={size} showTransparent />
    </div>
  )
}
