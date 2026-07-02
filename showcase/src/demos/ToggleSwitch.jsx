import { useState } from 'react'
import { ToggleSwitch } from '@kolkrabbi/kol-component'

export default function ToggleSwitchDemo() {
  const [on, setOn] = useState(true)
  return (
    <>
      <ToggleSwitch label="Default" checked={on} onChange={setOn} />
      <ToggleSwitch label="Plain" checked={on} onChange={setOn} variant="plain" />
    </>
  )
}
