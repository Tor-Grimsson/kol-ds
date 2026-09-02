import { useState } from 'react'
import { IconButton } from '@kolkrabbi/kol-controls'

export const stage = 'md'
const PLATE = { display: 'flex', alignItems: 'center', gap: 16, padding: 16, borderRadius: 4, background: 'var(--kol-ctl-hw-case)' }

/* The 1px-bordered icon key: latching, momentary (pulses LED-red for 100ms), disabled. */
export default function IconButtonDemo() {
  const [on, setOn] = useState(false)
  return (
    <div style={PLATE}>
      <IconButton icon="play" active={on} onClick={() => setOn((o) => !o)} title="Play" />
      <IconButton icon="refresh" momentary onClick={() => {}} title="Retrigger" />
      <IconButton icon="x" disabled title="Clear" />
      <IconButton icon="grid" iconSize={14} onClick={() => {}} title="Grid" />
    </div>
  )
}
