import { useState } from 'react'
import { RotaryDial } from '@kolkrabbi/kol-component'

export const stage = 'sm'

/* Bare knob first, then labeled (label gates the label + % readout rows),
 * then a smaller coarse-stepped one. Drag vertically, or focus + arrow keys. */
export default function RotaryDialDemo() {
  const [a, setA] = useState(40)
  const [b, setB] = useState(65)
  const [c, setC] = useState(20)
  return (
    <div className="flex items-start gap-8">
      <RotaryDial value={a} onChange={setA} />
      <RotaryDial label="A" value={b} onChange={setB} />
      <RotaryDial label="Drive" value={c} onChange={setC} step={5} size={64} />
    </div>
  )
}
