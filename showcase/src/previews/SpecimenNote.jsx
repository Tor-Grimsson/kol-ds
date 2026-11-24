import { SpecimenNote } from '@kolkrabbi/kol-styleguide'
import { NOTE } from '../demo-data/specimen.js'

export const stage = 'full'

export default function SpecimenNotePreview() {
  return <SpecimenNote label="NOTE 1" text={NOTE} />
}
