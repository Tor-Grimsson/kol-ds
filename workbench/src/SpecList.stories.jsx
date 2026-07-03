import { SpecList } from '@kolkrabbi/kol-component'

const items = [
  { label: 'Edition', value: 'Limited (30)' },
  { label: 'Year', value: '2025' },
  { label: 'Category', value: 'Screen print' },
  { label: 'Sizes', value: 'A3, A2, A1' },
]

export const Default = () => (
  <div style={{ width: 360 }}>
    <SpecList items={items} />
  </div>
)

export const Framed = () => (
  <div style={{ width: 360 }}>
    <SpecList items={items} framed />
  </div>
)
