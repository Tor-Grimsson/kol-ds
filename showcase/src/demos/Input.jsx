import { useState } from 'react'
import { Input } from '@kolkrabbi/kol-component'

export const stage = 'md'

/* Variants ramp inline; size rides the toolbar picker. */
export const sizes = ['sm', 'md', 'lg']

export default function InputDemo({ size = 'md' }) {
  const [v, setV] = useState('')
  const onChange = (e) => setV(e?.target?.value ?? e)
  return (
    <>
      <Input variant="filled" size={size} placeholder="filled" value={v} onChange={onChange} />
      <Input variant="outline" size={size} placeholder="outline" value={v} onChange={onChange} />
    </>
  )
}

/* Index card: one canonical instance. */
export function Card() {
  const [v, setV] = useState('')
  return (
    <div className="w-full max-w-xs">
      <Input variant="filled" placeholder="Input" value={v} onChange={(e) => setV(e?.target?.value ?? e)} />
    </div>
  )
}
