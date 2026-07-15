import { useState } from 'react'
import { ToggleBracket } from '@kolkrabbi/kol-component'

export default function ToggleBracketDemo() {
  const [a, setA] = useState(false)
  const [b, setB] = useState(true)
  const [c, setC] = useState(true)
  return (
    <>
      <ToggleBracket label="DEFAULT OFF" value={a} onToggle={setA} />
      <ToggleBracket label="DEFAULT ON" value={b} onToggle={setB} />
      <ToggleBracket label="PLAIN VARIANT" value={c} onToggle={setC} variant="plain" />
    </>
  )
}

/* Index card: one canonical instance. */
export function Card() {
  const [on, setOn] = useState(true)
  return <ToggleBracket label="GRID SNAP" value={on} onToggle={setOn} />
}
