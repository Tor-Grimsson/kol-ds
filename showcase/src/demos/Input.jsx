import { useState } from 'react'
import { Input } from '@kolkrabbi/kol-component'

export const stage = 'md'

export default function InputDemo() {
  const [v, setV] = useState('')
  const onChange = (e) => setV(e?.target?.value ?? e)
  return (
    <>
      <Input variant="filled" placeholder="filled" value={v} onChange={onChange} />
      <Input variant="ghost" placeholder="ghost" value={v} onChange={onChange} />
      <Input variant="outline" placeholder="outline" value={v} onChange={onChange} />
    </>
  )
}
