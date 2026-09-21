import { Swatch } from '@kolkrabbi/kol-styleguide'

export const stage = 'md'

/* The documented swatch: a 96px specimen bar over name + value. `ColorSwatch`
 * (kol-component) is the chip alone — a pressable atom for paint bars; this is
 * the form a colour PAGE needs, and it composes that atom rather than redrawing
 * it. The depth, the 6px gap and the baseline-aligned meta row are the two
 * brand apps' own geometry (`.kol-swatch*`, which ships in kol-framework —
 * drawn here rather than depended on). `anchor` marks the canonical stop with a
 * difference-blended dot, so it reads on a near-white stop and a near-black one
 * alike; `height` is the seam for a shallower specimen. */
export default function SwatchDemo() {
  return (
    <div className="grid grid-cols-4 gap-6">
      <Swatch hex="#FFCF33" name="Yellow 300" anchor />
      <Swatch hex="#AD5038" name="Red 200" />
      <Swatch hex="#222D3D" name="Blue 400" />
      <Swatch hex="#FCFBFB" name="Paper" />
      <Swatch hex="#49A0A2" name="Teal 300" height={48} />
    </div>
  )
}
