import { SectionFooter, IconFrame, Dropdown } from '@kolkrabbi/kol-component'

export const stage = 'full'

/* every slot filled: an IconFrame leading, a Dropdown trailing */
export default function SectionFooterPreview() {
  return (
    <SectionFooter
      leading={<IconFrame name="search" variant="secondary" size="md" />}
      label="Section"
      trailing={<Dropdown options={[{ label: 'Roman', value: 'roman' }, { label: 'Italic', value: 'italic' }]} value="roman" onChange={() => {}} size="md" />}
    />
  )
}
