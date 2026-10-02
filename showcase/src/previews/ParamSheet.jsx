import { useState } from 'react'
import { ParamSheet } from '@kolkrabbi/kol-hardware'
import { Button, RotaryDial } from '@kolkrabbi/kol-component'

export const stage = 'md'
/* no panel behind it (2026-10-01 — user: "the component is not the component + its panel, that would be a module") */
const ROW = { display: 'flex', alignItems: 'center', gap: 16 }

/* The holder opens the sheet: a panel RotaryDial or Slider reports a 500ms touch hold through `onHold`, and
 * whatever holds it renders this — the DS Slider full-width. A button opens it here so a desk can
 * see it too. */
export default function ParamSheetPreview() {
  const [v, setV] = useState(35)
  const [open, setOpen] = useState(false)
  return (
    <div style={ROW}>
      <RotaryDial variant="panel" value={v} onChange={setV} label="gain" size="md" onHold={() => setOpen(true)} />
      <Button tone="grey" size="sm" onClick={() => setOpen(true)}>Open sheet</Button>
      {open && <ParamSheet label="gain" value={v} min={0} max={100} defaultValue={50} onChange={setV} onClose={() => setOpen(false)} />}
    </div>
  )
}
