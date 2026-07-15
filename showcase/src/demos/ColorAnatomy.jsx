import { ColorAnatomy } from '@kolkrabbi/kol-styleguide'

export const stage = 'full'

/* A composed-color sample node — a chip whose fill is a color-mix over a token,
 * the exact expression the figcaption documents. */
const MixSample = ({ expr }) => (
  <span className="h-24 w-24 rounded-[3px] border border-fg-08" style={{ background: expr }} />
)

export default function ColorAnatomyDemo() {
  return (
    <div className="flex flex-wrap items-start gap-10">
      {/* Fallback path — bare hex renders a DS ColorSwatch */}
      <ColorAnatomy
        hex="#FFCF33"
        code="--kol-color-yellow-300"
        caption="Pure-yellow hero, straight from the ramp token."
      />

      {/* Composed path — a color-mix expression shown beside its sample */}
      <ColorAnatomy
        sample={<MixSample expr="color-mix(in srgb, #AD5038 60%, transparent)" />}
        code="color-mix(in srgb, var(--kol-color-red-200) 60%, transparent)"
        caption="Rust at 60% over the surface — a translucent accent wash."
      />

      <ColorAnatomy
        sample={<MixSample expr="color-mix(in srgb, #222D3D, #FAF7F0 16%)" />}
        code="color-mix(in srgb, var(--kol-color-blue-400), var(--kol-color-cream-100) 16%)"
        caption="Navy ink lifted 16% toward cream — softened body text."
      />
    </div>
  )
}
