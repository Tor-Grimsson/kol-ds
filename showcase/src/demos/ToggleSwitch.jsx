import { useState } from 'react'
import { ToggleSwitch } from '@kolkrabbi/kol-component'

export default function ToggleSwitchDemo() {
  const [on, setOn] = useState(true)
  return (
    <>
      <ToggleSwitch label="Bare" checked={on} onChange={setOn} />
      <ToggleSwitch label="Primary" checked={on} onChange={setOn} variant="primary" />
      <ToggleSwitch label="Outline" checked={on} onChange={setOn} variant="outline" />
    </>
  )
}

/* Index card: one canonical instance. */
export function Card() {
  const [on, setOn] = useState(true)
  return <ToggleSwitch label="Autosave" checked={on} onChange={setOn} />
}
