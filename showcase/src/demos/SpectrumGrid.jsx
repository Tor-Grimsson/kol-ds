// Relative import: SpectrumGrid isn't in the package barrel yet (barrels are
// off-limits this pass) — pull it straight from source so the demo renders.
import { SpectrumGrid } from '@kolkrabbi/kol-component'

export const stage = 'full'

// Hoisted so the resolve-on-mount effect keys off stable array refs.
const RAMPS = ['kol-color-yellow', 'kol-color-red', 'kol-color-orange', 'kol-color-blue', 'kol-color-teal', 'kol-color-cream']
const FIVE = [100, 200, 300, 400, 500]
const ANCHORS = [
  { ramp: 'kol-color-yellow', stop: 300 },
  { ramp: 'kol-color-red', stop: 200 },
  { ramp: 'kol-color-blue', stop: 400 },
]
const GREY = ['grey']
const GREY_STOPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900]

export default function SpectrumGridDemo() {
  return (
    <div className="flex w-full flex-col gap-8">
      <SpectrumGrid ramps={RAMPS} stops={FIVE} brandAnchors={ANCHORS} />
      <SpectrumGrid ramps={GREY} stops={GREY_STOPS} />
    </div>
  )
}
