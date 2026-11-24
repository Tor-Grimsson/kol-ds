import SpecimenHeader from './SpecimenHeader.jsx'
import SpecimenRampRow from './SpecimenRampRow.jsx'
import { RAMP } from './specimenRamp.js'

/* taxonomy-ok: nests SpecimenHeader and SpecimenRampRow (relative). */

/**
 * SpecimenRampSection — One row of the ramp. The library master `SpecimenRampSection` (Styleguide page, Ramp
 * section): a `SpecimenHeader` (controls off) naming the row, 64 over its `SpecimenRampRow`s, 24 apart. The steps come
 * from `RAMP`.
 *
 * @param {'Display'|'Heading'|'Text'|'Utility'|'Label'} [row]  default 'Display' (Figma `row`)
 * @param {Object} [font]     the sheet's font, passed to every row
 * @param {string} [sample]   every row's sample text
 */
export default function SpecimenRampSection({ row = 'Display', font, sample }) {
  const { steps } = RAMP.find((r) => r.row === row) ?? RAMP[0]
  return (
    <div className="flex flex-col gap-16">
      <SpecimenHeader label={row} size="md" controls={false} />
      <div className="flex flex-col gap-6">
        {steps.map((step) => <SpecimenRampRow key={step} step={step} font={font} sample={sample} />)}
      </div>
    </div>
  )
}
