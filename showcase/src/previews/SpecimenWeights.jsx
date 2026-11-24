import { useMemo } from 'react'
import { SpecimenWeights } from '@kolkrabbi/kol-styleguide'
import { INTER, interTracking } from '../demo-data/specimen.js'

export const stage = 'full'

export default function SpecimenWeightsPreview() {
  const font = useMemo(() => ({ ...INTER, tracking: interTracking() }), [])
  return <div className="overflow-x-auto"><SpecimenWeights font={font} /></div>
}
