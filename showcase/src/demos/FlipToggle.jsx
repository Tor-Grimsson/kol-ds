import { useState } from 'react'
import { FlipToggle } from '@kolkrabbi/kol-controls'

export const stage = 'md'
const PLATE = { display: 'flex', alignItems: 'center', gap: 16, padding: 16, borderRadius: 4, background: 'var(--kol-ctl-hw-case)' }

/* Two- and three-position flip switches, vertical and horizontal. */
export default function FlipToggleDemo() {
  const [a, setA] = useState(true)
  const [b, setB] = useState(1)
  return (
    <div style={PLATE}>
      <FlipToggle value={a} onChange={setA} labelA="hi" labelB="lo" />
      <FlipToggle value={b} onChange={setB} positions={3} labelA="a" labelB="b" labelC="c" />
      <FlipToggle value={a} onChange={setA} variant="horizontal" labelA="l" labelB="r" />
      <FlipToggle value={b} onChange={setB} variant="horizontal" positions={3} labelA="1" labelB="2" labelC="3" />
    </div>
  )
}
