import { useState } from 'react'
import { ParamSheet, Knob } from '@kolkrabbi/kol-hardware'
import { Button } from '@kolkrabbi/kol-component'

export const stage = 'md'
/* no panel behind it (2026-10-01 — user: "the component is not the component + its panel, that would be a module") */
const ROW = { display: 'flex', alignItems: 'center', gap: 16 }

/* On a phone, hold a Knob or Fader 500ms and this sheet opens with the DS Slider
 * full-width; here a button opens it so a desk can see it too. */
export default function ParamSheetDemo() {
  const [v, setV] = useState(35)
  const [open, setOpen] = useState(false)
  return (
    <div style={ROW}>
      <Knob value={v} onChange={setV} label="gain" size="md" />
      <Button variant="grey" size="sm" onClick={() => setOpen(true)}>Open sheet</Button>
      {open && <ParamSheet label="gain" value={v} min={0} max={100} defaultValue={50} onChange={setV} onClose={() => setOpen(false)} />}
    </div>
  )
}
