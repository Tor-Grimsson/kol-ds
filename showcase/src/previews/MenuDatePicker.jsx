import { useState } from 'react'
import { MenuDatePicker } from '@kolkrabbi/kol-component'

const GROUPS = [
  [{ key: 'day', label: 'Today', kbd: 'D' }, { key: 'yesterday', label: 'Yesterday', kbd: 'E' }],
  [{ key: '7d', label: 'Last 7 Days', kbd: 'W' }, { key: '28d', label: 'Last 28 Days', kbd: 'F' }],
  [{ key: 'custom', label: 'Custom Range', kbd: 'C' }],
]
const labelOf = (key) => GROUPS.flat().find((r) => r.key === key)?.label

export function Card() {
  return <MenuDatePicker groups={GROUPS} value="28d" label={labelOf('28d')} />
}

export default function MenuDatePickerPreview() {
  const [value, setValue] = useState('28d')
  const [compare, setCompare] = useState(false)
  return (
    <div className="flex min-h-[120px] w-full items-start justify-center">
      <MenuDatePicker groups={GROUPS} value={value} onChange={setValue} label={labelOf(value)}
        compare={{ label: compare ? 'Disable comparison' : 'Compare', kbd: 'X', onClick: () => setCompare((c) => !c) }} />
    </div>
  )
}
