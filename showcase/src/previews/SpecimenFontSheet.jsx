import { useEffect } from 'react'
import { SpecimenFontSheet } from '@kolkrabbi/kol-styleguide'
import { SPECIAL_GOTHIC, INTER, loadSpecialGothic } from '../demo-data/specimen.js'

export const stage = 'full'

export default function SpecimenFontSheetPreview() {
  useEffect(loadSpecialGothic, [])
  return <SpecimenFontSheet font={SPECIAL_GOTHIC} faces={[SPECIAL_GOTHIC, INTER]} showFaces />
}
