import { SectionLabel } from '@kolkrabbi/kol-component'

export default function SectionLabelDemo() {
  return (
    <div className="flex flex-col gap-4">
      <SectionLabel text="Collections" size="sm" />
      <SectionLabel text="Featured work" size="md" />
      <SectionLabel text="Latest prints" size="lg" />
    </div>
  )
}
