import { SpecimenDisplay } from '@kolkrabbi/kol-styleguide'
import { INTER } from '../demo-data/specimen.js'

export const stage = 'full'

/* both variants: Styles (ramp false) and Ramp */
export default function SpecimenDisplayPreview() {
  return (
    <div className="flex flex-col gap-8 overflow-x-auto">
      <SpecimenDisplay font={INTER} />
      <SpecimenDisplay ramp font={INTER} />
    </div>
  )
}
