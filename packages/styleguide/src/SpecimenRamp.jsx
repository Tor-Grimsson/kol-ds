import SpecimenRampSection from './SpecimenRampSection.jsx'
import { RAMP_COLUMNS } from './SpecimenRampRow.jsx'
import { RAMP, fontStack } from './specimenRamp.js'

/* taxonomy-ok: nests SpecimenRampSection (relative). */

/**
 * SpecimenRamp — The whole size ramp. The library master `SpecimenRamp` (Styleguide page, Ramp section): the column
 * heads (Step, Sample, Size, Line height, Tracking; medium 20/24 at fg-64), 88 over the five `SpecimenRampSection`s,
 * 96 apart, every step from `RAMP`.
 *
 * @param {Object} [font]    the sheet's font, passed down
 * @param {string} [sample]  every row's sample text
 */
export default function SpecimenRamp({ font, sample }) {
  const head = 'm-0 text-[20px] leading-6 font-medium text-fg-64'
  return (
    <div className="flex flex-col gap-22">
      <div className={RAMP_COLUMNS} style={{ fontFamily: fontStack(font) }}>
        {['Step', 'Sample', 'Size', 'Line height', 'Tracking'].map((h) => <p key={h} className={head}>{h}</p>)}
      </div>
      <div className="flex flex-col gap-24">
        {RAMP.map(({ row }) => <SpecimenRampSection key={row} row={row} font={font} sample={sample} />)}
      </div>
    </div>
  )
}
