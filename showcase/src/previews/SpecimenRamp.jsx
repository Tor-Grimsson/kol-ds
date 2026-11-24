import { useMemo } from 'react'
import { SpecimenRamp } from '@kolkrabbi/kol-styleguide'
import { INTER, interTracking } from '../demo-data/specimen.js'

export const stage = 'full'

/* all 48 steps, each row measuring its own sample */
export default function SpecimenRampPreview() {
  const font = useMemo(() => ({ ...INTER, tracking: interTracking() }), [])
  return <SpecimenRamp font={font} />
}
