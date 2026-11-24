import { SpecimenWeightsRow } from '@kolkrabbi/kol-styleguide'
import { INTER } from '../demo-data/specimen.js'

export const stage = 'full'

export default function SpecimenWeightsRowPreview() {
  return <div className="overflow-x-auto"><SpecimenWeightsRow step="h6" font={INTER} /></div>
}
