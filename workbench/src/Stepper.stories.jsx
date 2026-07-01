import { useState } from 'react'
import { Stepper } from '@kolkrabbi/kol-component'

const Row = ({ children }) => (
  <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>{children}</div>
)

export const Sizes = () => {
  const [a, setA] = useState(4)
  const [b, setB] = useState(8)
  const [c, setC] = useState(12)
  return (
    <Row>
      <Stepper size="sm" value={a} onChange={(e) => setA(Number(e.target.value))} style={{ width: 120 }} />
      <Stepper size="md" value={b} onChange={(e) => setB(Number(e.target.value))} style={{ width: 120 }} />
      <Stepper size="lg" value={c} onChange={(e) => setC(Number(e.target.value))} style={{ width: 120 }} />
    </Row>
  )
}

export const Bounded = () => {
  const [n, setN] = useState(50)
  return (
    <Stepper
      value={n}
      min={0}
      max={100}
      step={5}
      onChange={(e) => setN(Number(e.target.value))}
      style={{ width: 120 }}
    />
  )
}
