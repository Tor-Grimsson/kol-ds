import { useMemo } from 'react'
import { SpecimenRampSection } from '@kolkrabbi/kol-styleguide'
import { INTER, interTracking } from '../demo-data/specimen.js'

export const stage = 'full'

export default function SpecimenRampSectionPreview() {
  const font = useMemo(() => ({ ...INTER, tracking: interTracking() }), [])
  return <SpecimenRampSection row="Heading" font={font} />
}
