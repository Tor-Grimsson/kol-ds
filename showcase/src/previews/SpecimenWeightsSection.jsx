import { SpecimenWeightsSection } from '@kolkrabbi/kol-styleguide'
import { INTER } from '../demo-data/specimen.js'

export const stage = 'full'

export default function SpecimenWeightsSectionPreview() {
  return <div className="overflow-x-auto"><SpecimenWeightsSection row="Text" font={INTER} /></div>
}
