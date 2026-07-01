import { useState } from 'react'
import { SegmentedToggle } from '@kolkrabbi/kol-component'

export const Default = () => {
  const [v, setV] = useState('modes')
  return (
    <div style={{ maxWidth: 240 }}>
      <SegmentedToggle
        value={v}
        onChange={setV}
        options={[
          { value: 'modes', label: 'Modes' },
          { value: 'controls', label: 'Controls' },
        ]}
      />
    </div>
  )
}

export const ThreeWay = () => {
  const [v, setV] = useState('solid')
  return (
    <div style={{ maxWidth: 300 }}>
      <SegmentedToggle
        size="sm"
        value={v}
        onChange={setV}
        options={[
          { value: 'solid', label: 'Solid', ariaLabel: 'Solid' },
          { value: 'dashed', label: 'Dashed', ariaLabel: 'Dashed' },
          { value: 'dotted', label: 'Dotted', ariaLabel: 'Dotted' },
        ]}
      />
    </div>
  )
}
