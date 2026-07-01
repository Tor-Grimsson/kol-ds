import { Pill } from '@kolkrabbi/kol-component'

export default function PillDemo() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Pill variant="outline">Outline</Pill>
      <Pill variant="subtle">Subtle</Pill>
      <Pill variant="inverse">Inverse</Pill>
    </div>
  )
}
