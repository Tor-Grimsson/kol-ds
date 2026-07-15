import { useState } from 'react'
import { Input } from '@kolkrabbi/kol-component'

export const stage = 'md'

export default function InputDemo() {
  const [v, setV] = useState('')
  const onChange = (e) => setV(e?.target?.value ?? e)
  return (
    <>
      <Input variant="filled" placeholder="filled" value={v} onChange={onChange} />
      <Input variant="outline" placeholder="outline" value={v} onChange={onChange} />
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
