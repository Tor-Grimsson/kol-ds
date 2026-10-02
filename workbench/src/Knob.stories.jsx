import { useState } from 'react'
import { Knob } from '@kolkrabbi/kol-component'

const Row = ({ children }) => (
  <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start' }}>{children}</div>
)

export const Default = () => {
  const [v, setV] = useState(40)
  return <Knob label="A" value={v} onChange={setV} />
}

export const Bare = () => {
  const [v, setV] = useState(70)
  return <Knob value={v} onChange={setV} />
}

export const Sizes = () => {
  const [a, setA] = useState(25)
  const [b, setB] = useState(50)
  const [c, setC] = useState(75)
  return (
    <Row>
      <Knob label="Small" size={48} value={a} onChange={setA} />
      <Knob label="Default" value={b} onChange={setB} />
      <Knob label="Large" size={120} value={c} onChange={setC} />
    </Row>
  )
}

export const RangeAndStep = () => {
  const [coarse, setCoarse] = useState(20)
  const [wide, setWide] = useState(50)
  return (
    <Row>
      <Knob label="Step 10" step={10} value={coarse} onChange={setCoarse} />
      <Knob label="10 to 90" min={10} max={90} value={wide} onChange={setWide} />
    </Row>
  )
}
