import { useEffect } from 'react'
import { SpecimenFontCard } from '@kolkrabbi/kol-styleguide'
import { SPECIAL_GOTHIC, MONO, loadSpecialGothic } from '../demo-data/specimen.js'

export const stage = 'full'

export default function SpecimenFontCardPreview() {
  useEffect(loadSpecialGothic, [])
  return (
    <div className="flex flex-col gap-16 overflow-x-auto">
      <SpecimenFontCard font={SPECIAL_GOTHIC} />
      <SpecimenFontCard ramp font={MONO} />
    </div>
  )
}
