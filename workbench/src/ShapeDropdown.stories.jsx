import { useState } from 'react'
import { ShapeDropdown } from '@kolkrabbi/kol-component'

const SHAPES = [
  { id: 'rectangle', label: 'Rectangle', icon: 'rectangle' },
  { id: 'circle', label: 'Circle', icon: 'circle' },
  { id: 'triangle', label: 'Triangle', icon: 'triangle' },
  { id: 'polygon', label: 'Polygon', icon: 'polygon' },
]

export const Default = () => {
  const [value, setValue] = useState('rectangle')
  return (
    <ShapeDropdown
      options={SHAPES}
      value={value}
      onChange={setValue}
      onAction={(id) => console.log('onAction:', id)}
    />
  )
}

export const LabelsOnly = () => {
  const [value, setValue] = useState('normal')
  return (
    <ShapeDropdown
      options={[
        { id: 'normal', label: 'Normal' },
        { id: 'multiply', label: 'Multiply' },
        { id: 'screen', label: 'Screen' },
      ]}
      value={value}
      onChange={setValue}
    />
  )
}
