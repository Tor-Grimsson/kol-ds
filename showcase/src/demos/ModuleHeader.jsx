import { useState } from 'react'
import { ModuleHeader } from '@kolkrabbi/kol-controls'

export const stage = 'md'
const PLATE = { display: 'flex', alignItems: 'center', gap: 16, padding: 16, borderRadius: 4, background: 'var(--kol-ctl-hw-case)' }

/* Enable dot + module name; edit mode swaps the bypass dot for the yellow
 * remove dot; `powered={false}` shows the dot off whatever `enabled` says. */
export default function ModuleHeaderDemo() {
  const [on, setOn] = useState(true)
  const [byp, setByp] = useState(false)
  return (
    <div style={{ ...PLATE, flexDirection: 'column', alignItems: 'stretch', width: 200, gap: 8 }}>
      <ModuleHeader label="Feedback" enabled={on} onToggle={() => setOn((o) => !o)} bypass={byp} onBypass={() => setByp((b) => !b)} />
      <ModuleHeader label="Keyer" enabled={on} onToggle={() => setOn((o) => !o)} editMode onRemove={() => {}} />
      <ModuleHeader label="Ramp" enabled powered={false} />
    </div>
  )
}
