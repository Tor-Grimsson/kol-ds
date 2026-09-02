import { useState } from 'react'
import { Fader } from '@kolkrabbi/kol-controls'

export const stage = 'md'
const PLATE = { display: 'flex', alignItems: 'center', gap: 16, padding: 16, borderRadius: 4, background: 'var(--kol-ctl-hw-case)' }

/* The rack slider — 2px track, 8px thumb. Horizontal takes the row and shows a
 * readout; vertical is a fixed-height fader. Hold 500ms on touch for the sheet. */
export default function FaderDemo() {
  const [h, setH] = useState(64)
  const [v, setV] = useState(40)
  return (
    <div style={{ ...PLATE, width: 320 }}>
      <Fader value={h} onChange={setH} label="mix" />
      <Fader value={v} onChange={setV} label="lvl" direction="vertical" height={72} />
    </div>
  )
}
