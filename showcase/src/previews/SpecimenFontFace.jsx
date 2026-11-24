import { SpecimenFontFace } from '@kolkrabbi/kol-styleguide'
import { INTER } from '../demo-data/specimen.js'

export const stage = 'md'

export default function SpecimenFontFacePreview() {
  return <SpecimenFontFace font={INTER} />
}
