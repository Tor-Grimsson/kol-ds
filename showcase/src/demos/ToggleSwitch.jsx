import { useState } from 'react'
import { ToggleSwitch } from '@kolkrabbi/kol-component'

export const variants = ['bare', 'primary', 'outline']
export const sizes = ['md', 'xs', 'sm', 'lg']

export default function ToggleSwitchDemo({ variant = 'bare', size = 'md' }) {
  const [on, setOn] = useState(true)
  const [off, setOff] = useState(false)
  return (
    <>
      <ToggleSwitch label="On" checked={on} onChange={setOn} variant={variant} size={size} />
      <ToggleSwitch label="Off" checked={off} onChange={setOff} variant={variant} size={size} />
    </>
  )
}

/* Index card: one canonical instance. */
export function Card() {
  const [on, setOn] = useState(true)
  return <ToggleSwitch label="Autosave" checked={on} onChange={setOn} />
}
