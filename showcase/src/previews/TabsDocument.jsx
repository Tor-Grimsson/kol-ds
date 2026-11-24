import { useState } from 'react'
import { TabsDocument } from '@kolkrabbi/kol-component'

export const stage = 'full'
export const variants = ['folio', 'kolbox']

/* the open documents: one unsaved, a new one added by the plus, a closed one gone */
const START = [
  { value: 'notes', label: 'notes.md', icon: 'file-md' },
  { value: 'brief', label: 'Brief for the spring issue', icon: 'file-text', dirty: true },
  { value: 'site', label: 'site.css', icon: 'file-code' },
  { value: 'cover', label: 'cover.svg', icon: 'file-svg' },
]

export default function TabsDocumentPreview({ variant = 'folio' }) {
  const [tabs, setTabs] = useState(START)
  const [value, setValue] = useState('brief')
  const close = (v) => {
    const rest = tabs.filter((t) => t.value !== v)
    setTabs(rest)
    if (v === value) setValue(rest.at(-1)?.value)
  }
  const add = () => {
    const v = `untitled-${tabs.length + 1}`
    setTabs([...tabs, { value: v, label: 'Untitled', icon: 'file' }])
    setValue(v)
  }
  return (
    <div className="w-full">
      <TabsDocument variant={variant} tabs={tabs} value={value} onChange={setValue} onClose={close} onNew={add} />
    </div>
  )
}
