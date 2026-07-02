import { useState } from 'react'
import { ToggleBracket } from '@kolkrabbi/kol-component'

export default function ToggleBracketDemo() {
  const [a, setA] = useState(false)
  const [b, setB] = useState(true)
  const [c, setC] = useState(true)
  return (
    <>
      <ToggleBracket label="Default off" value={a} onToggle={setA} />
      <ToggleBracket label="Default on" value={b} onToggle={setB} />
      <ToggleBracket label="Plain variant" value={c} onToggle={setC} variant="plain" />
    </>
  )
}
