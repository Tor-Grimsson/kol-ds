import { useState } from 'react'
import { Input } from '@kolkrabbi/kol-component'

const Row = ({ children }) => (
  <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>{children}</div>
)

export const Variants = () => {
  const [v, setV] = useState('')
  return (
    <Row>
      {['filled', 'ghost', 'outline'].map((variant) => (
        <Input
          key={variant}
          variant={variant}
          placeholder={variant}
          value={v}
          onChange={(e) => setV(e.target.value)}
        />
      ))}
    </Row>
  )
}

export const Sizes = () => {
  const [v, setV] = useState('')
  return (
    <Row>
      {['sm', 'md', 'lg'].map((size) => (
        <Input
          key={size}
          size={size}
          placeholder={`size ${size}`}
          value={v}
          onChange={(e) => setV(e.target.value)}
        />
      ))}
    </Row>
  )
}

export const WithAffordances = () => {
  const [a, setA] = useState('')
  const [b, setB] = useState('')
  const [c, setC] = useState('')
  return (
    <Row>
      <Input iconLeft="search" placeholder="Search…" value={a} onChange={(e) => setA(e.target.value)} />
      <Input prefix="#" chars={6} placeholder="000000" value={b} onChange={(e) => setB(e.target.value)} />
      <Input suffix="%" type="number" chars={4} value={c} onChange={(e) => setC(e.target.value)} />
    </Row>
  )
}

export const States = () => {
  const [v, setV] = useState('')
  return (
    <Row>
      <Input placeholder="Default" value={v} onChange={(e) => setV(e.target.value)} />
      <Input placeholder="Disabled" disabled />
      <Input value="A pre-filled value that runs long" onChange={() => {}} width={200} />
    </Row>
  )
}
