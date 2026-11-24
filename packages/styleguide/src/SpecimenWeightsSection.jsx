import SpecimenHeader from './SpecimenHeader.jsx'
import SpecimenWeightsRow from './SpecimenWeightsRow.jsx'
import { RAMP } from './specimenRamp.js'

/* taxonomy-ok: nests SpecimenHeader and SpecimenWeightsRow (relative). */

/**
 * SpecimenWeightsSection — One row of the ramp in every weight. The library master `SpecimenWeightsSection`
 * (Styleguide page, Weights section): a `SpecimenHeader` (controls off), 64 over its `SpecimenWeightsRow`s, 24 apart;
 * the same rhythm as `SpecimenRampSection`, so the two line up row for row.
 *
 * @param {'Display'|'Heading'|'Text'|'Utility'|'Label'} [row]  default 'Display' (Figma `row`)
 * @param {Object} [font]    the sheet's font, passed to every row
 * @param {string} [sample]  every row's word
 */
export default function SpecimenWeightsSection({ row = 'Display', font, sample }) {
  const { steps } = RAMP.find((r) => r.row === row) ?? RAMP[0]
  return (
    <div className="flex flex-col gap-16">
      <SpecimenHeader label={row} size="md" controls={false} />
      <div className="flex flex-col gap-6">
        {steps.map((step) => <SpecimenWeightsRow key={step} step={step} font={font} sample={sample} />)}
      </div>
    </div>
  )
}
