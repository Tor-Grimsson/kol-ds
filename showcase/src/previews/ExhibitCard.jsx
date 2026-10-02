import { ExhibitCard } from '@kolkrabbi/kol-workshop'

export default function ExhibitCardPreview() {
  return (
    <ExhibitCard
      name="Default state"
      description="The resting look, before any input."
      details="variant='primary' · .kol-btn-primary"
      code="<Button tone='primary' />"
    />
  )
}
