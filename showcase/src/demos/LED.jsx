import { useState } from 'react'
import { LED } from '@kolkrabbi/kol-hardware'

export const stage = 'md'
/* no panel behind it (2026-10-01 — user: "the component is not the component + its panel, that would be a module") */
const ROW = { display: 'flex', alignItems: 'center', gap: 16 }

/* The set's own emitters — red · yellow · green · white · blue — sm and md, and
 * one you can click (the hit pad is 5px wider than the lamp on every side). */
export const sizes = ['sm', 'md']

export default function LEDDemo({ size = 'sm' }) {
  const [lit, setLit] = useState(true)
  return (
    <div style={ROW}>
      {['red', 'yellow', 'green', 'white', 'blue'].map((c) => <LED key={c} color={c} active size={size} />)}
      <LED color="red" active={false} size={size} />
      <LED color="green" active={lit} size={size} onClick={() => setLit((l) => !l)} />
    </div>
  )
}
