import { useState } from 'react'
import { PropertyInput } from '@kolkrabbi/kol-component'

const Grid = ({ children }) => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, maxWidth: 320 }}>
    {children}
  </div>
)

export const Types = () => {
  const [w, setW] = useState(120)
  const [name, setName] = useState('Sample Object')
  return (
    <Grid>
      <PropertyInput
        label="Width"
        type="number"
        value={w}
        onChange={(e) => setW(Number(e.target.value))}
        min={0}
        max={500}
        step={5}
      />
      <PropertyInput
        label="Name"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
    </Grid>
  )
}

export const Coordinates = () => {
  const [x, setX] = useState(0)
  const [y, setY] = useState(0)
  return (
    <Grid>
      <PropertyInput label="X" type="number" value={x} onChange={(e) => setX(Number(e.target.value))} step={5} />
      <PropertyInput label="Y" type="number" value={y} onChange={(e) => setY(Number(e.target.value))} step={5} />
    </Grid>
  )
}
