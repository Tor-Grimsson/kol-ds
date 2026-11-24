import SpecimenWeightsSection from './SpecimenWeightsSection.jsx'
import { RAMP, fontStack } from './specimenRamp.js'

/* taxonomy-ok: nests SpecimenWeightsSection (relative). */

/**
 * SpecimenWeights — The ramp in every weight, the panel that hangs beside a sheet. The library master
 * `SpecimenWeights` (Styleguide page, Weights section): on surface-tertiary, 64 in; the column heads (Step 200,
 * Weights; medium 20/24 at fg-64), 88 over the five `SpecimenWeightsSection`s, 96 apart. Goes in `SpecimenSheet`'s
 * `aside` slot, where its rows meet the `SpecimenRamp` rows.
 *
 * @param {Object} [font]    the sheet's font, passed down
 * @param {string} [sample]  every row's word
 */
export default function SpecimenWeights({ font, sample }) {
  const head = 'm-0 text-[20px] leading-6 font-medium text-fg-64'
  return (
    <div className="flex flex-col gap-22 overflow-hidden bg-surface-tertiary p-16">
      <div className="flex gap-8" style={{ fontFamily: fontStack(font) }}>
        <p className={`${head} w-50`}>Step</p>
        <p className={head}>Weights</p>
      </div>
      <div className="flex flex-col gap-24">
        {RAMP.map(({ row }) => <SpecimenWeightsSection key={row} row={row} font={font} sample={sample} />)}
      </div>
    </div>
  )
}
