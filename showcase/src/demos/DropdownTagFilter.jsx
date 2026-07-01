import { useState } from 'react'
import { DropdownTagFilter } from '@kolkrabbi/kol-component'

const OPTIONS = [
  { value: 'design', label: 'Design' },
  { value: 'code', label: 'Code' },
  { value: 'writing', label: 'Writing' },
  { value: 'research', label: 'Research' },
]

export default function DropdownTagFilterDemo() {
  const [selected, setSelected] = useState(new Set(OPTIONS.map((o) => o.value)))

  const handleChange = (value) => {
    if (value === null) {
      setSelected(new Set())
      return
    }
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(value)) next.delete(value)
      else next.add(value)
      return next
    })
  }

  return (
    <DropdownTagFilter
      options={OPTIONS}
      selectedValues={selected}
      onChange={handleChange}
    />
  )
}
