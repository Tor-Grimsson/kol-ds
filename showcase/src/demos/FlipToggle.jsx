import { useState } from 'react'
import { FlipToggle } from '@kolkrabbi/kol-hardware'

export const stage = 'md'
const PLATE = { display: 'flex', alignItems: 'center', gap: 16, padding: 16, borderRadius: 4, background: 'var(--kol-ctl-hw-case)' }

/* Two- and three-position flip switches, vertical and horizontal. */
export const variants = ['vertical', 'horizontal']

export default function FlipToggleDemo({ variant = 'vertical' }) {
  const [a, setA] = useState(true)
  const [b, setB] = useState(1)
  return (
    <div style={PLATE}>
      <FlipToggle value={a} onChange={setA} variant={variant} labelA="hi" labelB="lo" />
      <FlipToggle value={b} onChange={setB} variant={variant} positions={3} labelA="a" labelB="b" labelC="c" />
    </div>
  )
}
