import { ColorRamp, SpectrumGrid } from '@kolkrabbi/kol-component'

export const meta = {
  title: 'Palette reference',
  description: 'Token ramps and a full spectrum matrix from the KOL theme',
  category: 'color',
}
export const stage = 'full'

/* Hoisted so SpectrumGrid's resolve-on-mount effect keys off stable refs. */
const RAMPS = ['kol-color-yellow', 'kol-color-red', 'kol-color-orange', 'kol-color-blue', 'kol-color-teal', 'kol-color-cream']
const STOPS = [100, 200, 300, 400, 500]
const ANCHORS = [
  { ramp: 'kol-color-yellow', stop: 300 },
  { ramp: 'kol-color-red', stop: 200 },
  { ramp: 'kol-color-blue', stop: 400 },
]

export default function PaletteReference() {
  return (
    <div className="flex w-full flex-col gap-10">
      <div className="flex flex-col">
        {/* `ramp` sugar → each chip resolves --{ramp}-{stop} live from the theme */}
        <ColorRamp ramp="kol-color-yellow" anchor={300} note="Pure-yellow lock — anchor at 300." />
        <ColorRamp ramp="kol-color-teal" anchor={300} note="Cool secondary." />
        {/* Explicit --kol-color-* custom-property names */}
        <ColorRamp
          label="Blue (explicit vars)"
          vars={['--kol-color-blue-100', '--kol-color-blue-200', '--kol-color-blue-300', '--kol-color-blue-400', '--kol-color-blue-500']}
          anchor="kol-color-blue-400"
        />
        {/* Static literal hex — the merged former-Ramp mode */}
        <ColorRamp
          label="Brand accents (static hex)"
          colors={[['yellow', '#FFCF33'], ['rust', '#AD5038'], ['ink', '#222D3D']]}
          anchor="yellow"
        />
      </div>

      <SpectrumGrid ramps={RAMPS} stops={STOPS} brandAnchors={ANCHORS} />
    </div>
  )
}
