import { useState } from 'react'
import { Input } from '@kolkrabbi/kol-component'

export default function InputDemo() {
  const [v, setV] = useState('')
  return <Input placeholder="Type…" value={v} onChange={(e) => setV(e?.target?.value ?? e)} />
}
