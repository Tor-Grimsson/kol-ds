import { useState } from 'react'
import { ParamSheet, Knob } from '@kolkrabbi/kol-controls'
import { Button } from '@kolkrabbi/kol-component'

export const stage = 'md'
const PLATE = { display: 'flex', alignItems: 'center', gap: 16, padding: 16, borderRadius: 4, background: 'var(--kol-ctl-hw-case)' }

/* On a phone, hold a Knob or Fader 500ms and this sheet opens with the DS Slider
 * full-width; here a button opens it so a desk can see it too. */
export default function ParamSheetDemo() {
  const [v, setV] = useState(35)
  const [open, setOpen] = useState(false)
  return (
    <div style={PLATE}>
      <Knob value={v} onChange={setV} label="gain" size="md" />
      <Button variant="grey" size="sm" onClick={() => setOpen(true)}>Open sheet</Button>
      {open && <ParamSheet label="gain" value={v} min={0} max={100} defaultValue={50} onChange={setV} onClose={() => setOpen(false)} />}
    </div>
  )
}
