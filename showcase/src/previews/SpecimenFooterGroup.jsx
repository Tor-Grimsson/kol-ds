import { SpecimenFooterGroup, SpecimenNote } from '@kolkrabbi/kol-styleguide'
import { NOTE } from '../demo-data/specimen.js'

export const stage = 'full'

export default function SpecimenFooterGroupPreview() {
  return (
    <div data-theme="dark" className="bg-surface-primary p-8">
      <SpecimenFooterGroup title="Notes">
        <SpecimenNote label="NOTE 1" text={NOTE} />
        <SpecimenNote label="NOTE 2" text={NOTE} />
      </SpecimenFooterGroup>
    </div>
  )
}
