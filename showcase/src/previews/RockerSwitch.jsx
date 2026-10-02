import { useState } from 'react'
import { RockerSwitch } from '@kolkrabbi/kol-hardware'

export const stage = 'md'
/* no panel behind it (2026-10-01 — user: "the component is not the component + its panel, that would be a module") */
const ROW = { display: 'flex', alignItems: 'center', gap: 16 }

/* The I/O rocker — paddle top and lit when on, bottom when off. */
export default function RockerSwitchPreview() {
  const [on, setOn] = useState(true)
  return (
    <div style={ROW}>
      <RockerSwitch on={on} onToggle={() => setOn((o) => !o)} />
      <RockerSwitch on={!on} onToggle={() => setOn((o) => !o)} />
    </div>
  )
}
