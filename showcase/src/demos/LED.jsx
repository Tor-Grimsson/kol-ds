import { useState } from 'react'
import { LED } from '@kolkrabbi/kol-controls'

export const stage = 'md'
const PLATE = { display: 'flex', alignItems: 'center', gap: 16, padding: 16, borderRadius: 4, background: 'var(--kol-ctl-hw-case)' }

/* The set's own emitters — red · yellow · green · white · blue — sm and md, and
 * one you can click (the hit pad is 5px wider than the lamp on every side). */
export default function LEDDemo() {
  const [lit, setLit] = useState(true)
  return (
    <div style={PLATE}>
      {['red', 'yellow', 'green', 'white', 'blue'].map((c) => <LED key={c} color={c} active />)}
      {['red', 'yellow', 'green', 'white', 'blue'].map((c) => <LED key={c + 'md'} color={c} active size="md" />)}
      <LED color="red" active={false} size="md" />
      <LED color="green" active={lit} size="md" onClick={() => setLit((l) => !l)} />
    </div>
  )
}
