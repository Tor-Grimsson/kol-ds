import { useState } from 'react'
import { DropdownTagFilter } from '@kolkrabbi/kol-component'

const options = [
  { value: 'type', label: 'Typography' },
  { value: 'color', label: 'Color' },
  { value: 'layout', label: 'Layout' },
  { value: 'motion', label: 'Motion' },
  { value: 'icons', label: 'Icons' },
]

const Filter = ({ size }) => {
  const [selected, setSelected] = useState(new Set(options.map((o) => o.value)))
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
      options={options}
      selectedValues={selected}
      onChange={handleChange}
      size={size}
    />
  )
}

export const Default = () => (
  <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', minHeight: 340 }}>
    <Filter />
  </div>
)

export const Sizes = () => (
  <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', minHeight: 340 }}>
    {['sm', 'md', 'lg'].map((s) => <Filter key={s} size={s} />)}
  </div>
)
