import { useState } from 'react'
import { Textarea } from '@kolkrabbi/kol-component'

const Column = ({ children }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 320 }}>{children}</div>
)

export const Default = () => {
  const [v, setV] = useState('')
  return (
    <Column>
      <Textarea placeholder="Start writing..." value={v} onChange={(e) => setV(e.target.value)} />
    </Column>
  )
}

export const Variants = () => {
  const [a, setA] = useState('')
  const [b, setB] = useState('')
  const [c, setC] = useState('')
  return (
    <Column>
      <Textarea variant="filled" placeholder="filled" value={a} onChange={(e) => setA(e.target.value)} />
      <Textarea variant="ghost" placeholder="ghost" value={b} onChange={(e) => setB(e.target.value)} />
      <Textarea variant="outline" placeholder="outline" value={c} onChange={(e) => setC(e.target.value)} />
    </Column>
  )
}

export const States = () => {
  const [v, setV] = useState(
    'A short note that wraps across a couple of lines to show the multi-line behaviour of the control.'
  )
  return (
    <Column>
      <Textarea size="sm" rows={6} placeholder="<svg>…</svg>" value={v} onChange={(e) => setV(e.target.value)} />
      <Textarea placeholder="Disabled" disabled />
    </Column>
  )
}
