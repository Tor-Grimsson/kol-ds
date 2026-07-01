import { useState } from 'react'
import { SegmentedToggle } from '@kolkrabbi/kol-component'

export default function SegmentedToggleDemo() {
  const [v, setV] = useState('grid')
  return (
    <SegmentedToggle
      value={v}
      onChange={setV}
      options={[
        { value: 'grid', label: 'Grid' },
        { value: 'list', label: 'List' },
        { value: 'feed', label: 'Feed' },
      ]}
    />
  )
}
