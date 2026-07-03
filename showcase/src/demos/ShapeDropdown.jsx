import { useState } from 'react'
import { ShapeDropdown } from '@kolkrabbi/kol-component'

export const stage = 'hug'

const SHAPES = [
  { id: 'rectangle', label: 'Rectangle', icon: 'rectangle' },
  { id: 'circle', label: 'Circle', icon: 'circle' },
  { id: 'triangle', label: 'Triangle', icon: 'triangle' },
  { id: 'polygon', label: 'Polygon', icon: 'polygon' },
]

export default function ShapeDropdownDemo() {
  const [value, setValue] = useState('rectangle')
  const [action, setAction] = useState(null)
  return (
    <div className="flex flex-col items-start gap-3">
      <ShapeDropdown options={SHAPES} value={value} onChange={setValue} onAction={setAction} />
      <span className="kol-helper-10 text-meta">
        value: {value}{action ? ` · onAction: ${action}` : ''}
      </span>
    </div>
  )
}
