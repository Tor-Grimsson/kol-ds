import { SpecimenRampRow } from '@kolkrabbi/kol-styleguide'
import { INTER } from '../demo-data/specimen.js'

export const stage = 'full'

/* plain, then case, italic and underline on */
export default function SpecimenRampRowPreview() {
  return (
    <div className="flex flex-col gap-6">
      <SpecimenRampRow step="t4" font={INTER} />
      <SpecimenRampRow step="t4" font={INTER} case italic underline />
    </div>
  )
}
