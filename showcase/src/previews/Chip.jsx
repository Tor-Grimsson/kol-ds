import { Chip, IconFrame } from '@kolkrabbi/kol-component'

export const stage = 'hug'

/* a tile with every slot filled, and one with "Aa" in the slot as the Specimen font cuts wear it */
export default function ChipPreview() {
  return (
    <div className="flex items-center gap-6">
      <Chip leading={<IconFrame name="search" size="sm" />} title="Inter" meta="Regular" />
      <Chip leading={<span className="font-[family-name:var(--kol-font-family-sans)] text-[20px] text-auto">Aa</span>} title="Inter" meta="Bold" />
    </div>
  )
}
