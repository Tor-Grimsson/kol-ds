import { useState } from 'react'
import { RotaryDial } from '@kolkrabbi/kol-component'

const Row = ({ children }) => (
  <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start' }}>{children}</div>
)

export const Default = () => {
  const [v, setV] = useState(40)
  return <RotaryDial label="A" value={v} onChange={setV} />
}

export const Bare = () => {
  const [v, setV] = useState(70)
  return <RotaryDial value={v} onChange={setV} />
}

export const Sizes = () => {
  const [a, setA] = useState(25)
  const [b, setB] = useState(50)
  const [c, setC] = useState(75)
  return (
    <Row>
      <RotaryDial label="Small" size={48} value={a} onChange={setA} />
      <RotaryDial label="Default" value={b} onChange={setB} />
      <RotaryDial label="Large" size={120} value={c} onChange={setC} />
    </Row>
  )
}

export const RangeAndStep = () => {
  const [coarse, setCoarse] = useState(20)
  const [wide, setWide] = useState(50)
  return (
    <Row>
      <RotaryDial label="Step 10" step={10} value={coarse} onChange={setCoarse} />
      <RotaryDial label="10 to 90" min={10} max={90} value={wide} onChange={setWide} />
    </Row>
  )
}
