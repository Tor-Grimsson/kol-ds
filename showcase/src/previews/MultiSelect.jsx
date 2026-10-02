import { useState } from 'react'
import { MultiSelect } from '@kolkrabbi/kol-component'

const opts = (list) => list.map((v) => ({ value: v, label: v[0].toUpperCase() + v.slice(1) }))
const GROUPS = [
  { id: 'variant', label: 'Variant', options: opts(['primary', 'secondary', 'accent', 'outline', 'ghost']) },
  { id: 'tone', label: 'Tone', options: opts(['default', 'primary', 'secondary', 'inverted', 'sunken']) },
  { id: 'size', label: 'Size', options: opts(['xs', 'sm', 'md', 'lg']) },
]

/* Three settings in one dropdown — a column each. */
export default function MultiSelectPreview() {
  const [value, setValue] = useState({ variant: 'primary', tone: 'default', size: 'md' })
  return <MultiSelect groups={GROUPS} value={value} onChange={(id, v) => setValue((s) => ({ ...s, [id]: v }))} />
}
