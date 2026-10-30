import { useState } from 'react'
import { VariantsControl } from '@kolkrabbi/kol-component'

export const stage = 'full'
/* the button pins to its document's top-right corner */
export const frame = 420

/* a page's variants: the round slider button top-right opens labelled segmented rows, one per axis — catalog's, shipped */
const AXES = [
  { key: 'card', label: 'Card', values: ['catalog', 'file', 'app'] },
  { key: 'list', label: 'List', values: ['grid', 'stack'] },
  { key: 'layout', label: 'Layout', options: [{ value: 'site', label: 'SiteLayout' }, { value: 'app', label: 'AppShell' }] },
]

export default function VariantsControlPreview() {
  const [value, setValue] = useState({ card: 'catalog', list: 'grid', layout: 'site' })
  return (
    <div className="p-8 kol-mono-12 text-meta">
      {Object.entries(value).map(([k, v]) => `${k}: ${v}`).join(', ')}
      <VariantsControl axes={AXES} value={value} onChange={(k, v) => setValue((s) => ({ ...s, [k]: v }))} />
    </div>
  )
}
