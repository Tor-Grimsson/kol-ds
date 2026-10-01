import { useState } from 'react'
import { LED } from '@kolkrabbi/kol-hardware'

export const stage = 'md'
const PLATE = { display: 'flex', alignItems: 'center', gap: 16, padding: 16, borderRadius: 4, background: 'var(--kol-ctl-hw-case)' }

/* The set's own emitters — red · yellow · green · white · blue — sm and md, and
 * one you can click (the hit pad is 5px wider than the lamp on every side). */
export const sizes = ['sm', 'md']

export default function LEDDemo({ size = 'sm' }) {
  const [lit, setLit] = useState(true)
  return (
    <div style={PLATE}>
      {['red', 'yellow', 'green', 'white', 'blue'].map((c) => <LED key={c} color={c} active size={size} />)}
      <LED color="red" active={false} size={size} />
      <LED color="green" active={lit} size={size} onClick={() => setLit((l) => !l)} />
    </div>
  )
}
