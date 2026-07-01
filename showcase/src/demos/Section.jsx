import { Section } from '@kolkrabbi/kol-component'

export default function SectionDemo() {
  return (
    <Section label="Aspect">
      <p className="text-body">Portrait 4:5</p>
      <p className="text-body">Square 1:1</p>
      <p className="text-body">Landscape 3:2</p>
    </Section>
  )
}
