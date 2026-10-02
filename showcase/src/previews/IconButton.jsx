import { useState } from 'react'
import { IconButton } from '@kolkrabbi/kol-hardware'

export const stage = 'md'
/* no panel behind it (2026-10-01 — user: "the component is not the component + its panel, that would be a module") */
const ROW = { display: 'flex', alignItems: 'center', gap: 16 }

/* The 1px-bordered icon key: latching, momentary (pulses LED-red for 100ms), disabled. */
export default function IconButtonPreview() {
  const [on, setOn] = useState(false)
  return (
    <div style={ROW}>
      <IconButton icon="play" active={on} onClick={() => setOn((o) => !o)} title="Play" />
      <IconButton icon="refresh" momentary onClick={() => {}} title="Retrigger" />
      <IconButton icon="x" disabled title="Clear" />
      <IconButton icon="grid" iconSize={14} onClick={() => {}} title="Grid" />
    </div>
  )
}
