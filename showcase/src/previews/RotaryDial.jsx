import { useState } from 'react'
import { RotaryDial } from '@kolkrabbi/kol-component'

export const stage = 'sm'

/* `panel` is the rack knob (was kol-hardware `Knob`): four sizes by name, the bipolar legend and
 * the label placements; ⌥-click resets, a 500ms touch hold reports `onHold`. */
export const variants = ['dial', 'panel']
export const sizes = ['md', 'sm', 'lg', 'xl']

/* Bare knob first, then labeled (label gates the label + % readout rows),
 * then a smaller coarse-stepped one. Drag vertically, or focus + arrow keys. */
export default function RotaryDialPreview({ variant = 'dial', size = 'md' }) {
  const [a, setA] = useState(40)
  const [b, setB] = useState(65)
  const [c, setC] = useState(20)
  const [pan, setPan] = useState(-20)
  if (variant === 'panel') {
    return (
      <div className="flex items-center gap-4">
        <RotaryDial variant="panel" value={a} onChange={setA} label="gain" size={size} />
        <RotaryDial variant="panel" value={pan} onChange={setPan} label="pan" bipolar size={size} />
        <RotaryDial variant="panel" value={c} onChange={setC} label="rate" labelPlacement="row-right" labelMinWidth={28} size={size} />
      </div>
    )
  }
  return (
    <div className="flex items-start gap-8">
      <RotaryDial value={a} onChange={setA} />
      <RotaryDial label="A" value={b} onChange={setB} />
      <RotaryDial label="Drive" value={c} onChange={setC} step={5} size={64} />
    </div>
  )
}
