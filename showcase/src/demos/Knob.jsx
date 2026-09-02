import { useState } from 'react'
import { Knob } from '@kolkrabbi/kol-controls'

export const stage = 'md'
const PLATE = { display: 'flex', alignItems: 'center', gap: 16, padding: 16, borderRadius: 4, background: 'var(--kol-ctl-hw-case)' }

/* Drag up/down (200px = the range); ⌥-click resets; on touch hold 500ms for the
 * big ParamSheet. Four sizes, the bipolar legend, the row variants. */
export default function KnobDemo() {
  const [v, setV] = useState(35)
  const [b, setB] = useState(-20)
  return (
    <div style={PLATE}>
      <Knob value={v} onChange={setV} label="gain" size="sm" />
      <Knob value={v} onChange={setV} label="gain" size="md" />
      <Knob value={v} onChange={setV} label="gain" size="lg" />
      <Knob value={v} onChange={setV} label="gain" size="xl" />
      <Knob value={b} onChange={setB} label="pan" bipolar size="md" />
      <Knob value={v} onChange={setV} label="rate" variant="row-right" labelMinWidth={28} size="sm" />
    </div>
  )
}
