import { useState } from 'react'
import { PropertyInput } from '@kolkrabbi/kol-component'

export const stage = 'md'

export default function PropertyInputDemo() {
  const [x, setX] = useState(707)
  const [y, setY] = useState(499)
  return (
    <div className="grid grid-cols-2 gap-4 max-w-xs">
      <PropertyInput label="X" type="number" value={x} onChange={(e) => setX(Number(e.target.value))} step={5} />
      <PropertyInput label="Y" type="number" value={y} onChange={(e) => setY(Number(e.target.value))} step={5} />
    </div>
  )
}
