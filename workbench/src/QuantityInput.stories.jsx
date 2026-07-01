import { useState } from 'react'
import { QuantityInput } from '@kolkrabbi/kol-component'

const Demo = ({ min = 1, max = 10, size }) => {
  const [value, setValue] = useState(min)
  return <QuantityInput value={value} onChange={setValue} min={min} max={max} size={size} />
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
    {['sm', 'md', 'lg'].map((s) => <Demo key={s} min={1} max={10} size={s} />)}
  </Row>
)

export const WideRange = () => (
  <Row>
    <Demo min={100} max={4096} size="md" />
  </Row>
)
