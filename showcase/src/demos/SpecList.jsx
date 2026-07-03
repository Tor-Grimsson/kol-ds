import { SpecList } from '@kolkrabbi/kol-component'

export const stage = 'md'

const items = [
  { label: 'Edition', value: 'Limited (30)' },
  { label: 'Year', value: '2025' },
  { label: 'Category', value: 'Screen print' },
  { label: 'Sizes', value: 'A3, A2, A1' },
]

export default function SpecListDemo() {
  return (
    <div className="w-full max-w-md">
      <SpecList items={items} framed />
    </div>
  )
}
