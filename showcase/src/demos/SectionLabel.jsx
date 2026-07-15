import { SectionLabel } from '@kolkrabbi/kol-component'

export const stage = 'sm'

export default function SectionLabelDemo() {
  return (
    <>
      <SectionLabel text="COLLECTIONS" size="sm" />
      <SectionLabel text="FEATURED WORK" size="md" />
      <SectionLabel text="LATEST PRINTS" size="lg" />
    </>
  )
}
