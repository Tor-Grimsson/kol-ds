import { SpecimenSheet, SpecimenFooterGroup, SpecimenNote, SpecimenFontCard } from '@kolkrabbi/kol-styleguide'
import { SPECIAL_GOTHIC, NOTE } from '../demo-data/specimen.js'

export const stage = 'full'

/* the dark frame with a card in the light content slot and a note in the footer */
export default function SpecimenSheetPreview() {
  return (
    <div className="overflow-x-auto">
      <SpecimenSheet
        content={<SpecimenFontCard font={SPECIAL_GOTHIC} />}
        footer={<SpecimenFooterGroup title="Notes"><SpecimenNote label="NOTE 1" text={NOTE} /></SpecimenFooterGroup>}
      />
    </div>
  )
}
