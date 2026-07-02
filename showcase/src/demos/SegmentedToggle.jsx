import { useState } from 'react'
import { SegmentedToggle } from '@kolkrabbi/kol-component'

const OPTIONS = [
  { value: 'grid', label: 'Grid' },
  { value: 'list', label: 'List' },
  { value: 'feed', label: 'Feed' },
]

export default function SegmentedToggleDemo() {
  const [v, setV] = useState('grid')
  return (
    <div className="flex flex-col items-start gap-4">
      {['sm', 'md', 'lg'].map((size) => (
        <SegmentedToggle key={size} value={v} onChange={setV} options={OPTIONS} size={size} />
      ))}
    </div>
  )
}
