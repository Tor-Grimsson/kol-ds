import { useState } from 'react'
import { ToggleSwitch } from '@kolkrabbi/kol-component'

export default function ToggleSwitchDemo() {
  const [on, setOn] = useState(true)
  return <ToggleSwitch label="Enabled" checked={on} onChange={setOn} />
}
