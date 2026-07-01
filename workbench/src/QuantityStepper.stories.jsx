import { useState } from 'react'
import { QuantityStepper } from '@kolkrabbi/kol-component'

const Demo = ({ min = 1, max = 10, size }) => {
  const [value, setValue] = useState(min)
  return <QuantityStepper value={value} onChange={setValue} min={min} max={max} size={size} />
}

const Row = ({ children }) => (
  <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>{children}</div>
)

export const Default = () => (
  <Row>
    <Demo min={1} max={10} />
  </Row>
)

export const Sizes = () => (
  <Row>
    {['sm', 'md', 'lg'].map((s) => <Demo key={s} size={s} />)}
  </Row>
)

export const Bounds = () => (
  <Row>
    <Demo min={2} max={20} size="sm" />
  </Row>
)
