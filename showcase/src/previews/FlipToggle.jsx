import { useState } from 'react'
import { FlipToggle } from '@kolkrabbi/kol-hardware'

export const stage = 'md'
/* no panel behind it (2026-10-01 — user: "the component is not the component + its panel, that would be a module") */
const ROW = { display: 'flex', alignItems: 'center', gap: 16 }

/* Two- and three-position flip switches, vertical and horizontal. */
export const variants = ['vertical', 'horizontal']

export default function FlipTogglePreview({ variant = 'vertical' }) {
  const [a, setA] = useState(true)
  const [b, setB] = useState(1)
  return (
    <div style={ROW}>
      <FlipToggle value={a} onChange={setA} variant={variant} labelA="hi" labelB="lo" />
      <FlipToggle value={b} onChange={setB} variant={variant} positions={3} labelA="a" labelB="b" labelC="c" />
    </div>
  )
}
