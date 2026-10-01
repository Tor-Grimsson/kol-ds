import { useState } from 'react'
import { ToggleBracket } from '@kolkrabbi/kol-component'

export const variants = ['default', 'plain']

export default function ToggleBracketDemo({ variant = 'default' }) {
  const [a, setA] = useState(false)
  const [b, setB] = useState(true)
  return (
    <>
      <ToggleBracket label="DEFAULT OFF" value={a} onToggle={setA} variant={variant} />
      <ToggleBracket label="DEFAULT ON" value={b} onToggle={setB} variant={variant} />
    </>
  )
}

/* Index card: one canonical instance. */
export function Card() {
  const [on, setOn] = useState(true)
  return <ToggleBracket label="GRID SNAP" value={on} onToggle={setOn} />
}
