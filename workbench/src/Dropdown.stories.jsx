import { useState } from 'react'
import { Dropdown } from '@kolkrabbi/kol-component'

const BLEND_MODES = [
  { value: 'normal', label: 'Normal' },
  { value: 'multiply', label: 'Multiply' },
  { value: 'screen', label: 'Screen' },
  { value: 'overlay', label: 'Overlay' },
  { value: 'darken', label: 'Darken' },
]

export const Default = () => {
  const [value, setValue] = useState('normal')
  return <Dropdown options={BLEND_MODES} value={value} onChange={setValue} />
}

export const Variants = () => {
  const [value, setValue] = useState('normal')
  return (
    <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
      {['default', 'subtle', 'minimal'].map((variant) => (
        <div key={variant} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span className="kol-mono-12">{variant}</span>
          <Dropdown variant={variant} options={BLEND_MODES} value={value} onChange={setValue} />
        </div>
      ))}
    </div>
  )
}

export const Sizes = () => {
  const [value, setValue] = useState('normal')
  return (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      {['sm', 'md', 'lg'].map((size) => (
        <Dropdown key={size} size={size} options={BLEND_MODES} value={value} onChange={setValue} />
      ))}
    </div>
  )
}
