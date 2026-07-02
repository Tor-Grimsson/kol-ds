import { SectionLabel } from '@kolkrabbi/kol-component'

export const stage = 'sm'

export default function SectionLabelDemo() {
  return (
    <>
      <SectionLabel text="Collections" size="sm" />
      <SectionLabel text="Featured work" size="md" />
      <SectionLabel text="Latest prints" size="lg" />
    </>
  )
}
