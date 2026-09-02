import { useState } from 'react'
import { RockerSwitch } from '@kolkrabbi/kol-controls'

export const stage = 'md'
const PLATE = { display: 'flex', alignItems: 'center', gap: 16, padding: 16, borderRadius: 4, background: 'var(--kol-ctl-hw-case)' }

/* The I/O rocker — paddle top and lit when on, bottom when off. */
export default function RockerSwitchDemo() {
  const [on, setOn] = useState(true)
  return (
    <div style={PLATE}>
      <RockerSwitch on={on} onToggle={() => setOn((o) => !o)} />
      <RockerSwitch on={!on} onToggle={() => setOn((o) => !o)} />
    </div>
  )
}
