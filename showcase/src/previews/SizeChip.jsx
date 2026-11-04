import { useState } from 'react'
import { SizeChip } from '@kolkrabbi/kol-component'

export const stage = 'hug'

/* a task's size — three chips as a pick, and one that only reads */
export default function SizeChipPreview() {
  const [size, setSize] = useState('S')
  return (
    <div className="flex items-center gap-6">
      <div className="flex items-center gap-1">
        {['S', 'M', 'B'].map((s) => <SizeChip key={s} active={size === s} onClick={() => setSize(s)}>{s}</SizeChip>)}
      </div>
      <SizeChip>M</SizeChip>
    </div>
  )
}
