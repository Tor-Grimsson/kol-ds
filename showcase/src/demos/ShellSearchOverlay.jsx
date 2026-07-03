import { useState } from 'react'
import { Button, ShellSearchOverlay } from '@kolkrabbi/kol-component'

export const stage = 'md'

const INDEX = [
  { id: 'color', label: 'Color tokens', group: 'Theme', hint: 'kol-color.css' },
  { id: 'type', label: 'Typography', group: 'Theme', hint: 'kol-typography.css' },
  { id: 'button', label: 'Button', group: 'Atoms' },
  { id: 'input', label: 'Input', group: 'Atoms' },
  { id: 'search-input', label: 'SearchInput', group: 'Atoms' },
  { id: 'media-card', label: 'MediaCard', group: 'Molecules' },
  { id: 'media-row', label: 'MediaRow', group: 'Molecules' },
]

export default function ShellSearchOverlayDemo() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [picked, setPicked] = useState(null)
  const results = query
    ? INDEX.filter((i) => i.label.toLowerCase().includes(query.toLowerCase()))
    : []
  const close = () => {
    setOpen(false)
    setQuery('')
  }
  return (
    <div className="flex items-center gap-4">
      <Button onClick={() => setOpen(true)}>Open palette</Button>
      <p className="kol-mono-12 text-fg-48">
        {picked ? `Selected: ${picked.label}` : 'Arrows move · Enter selects · Esc closes'}
      </p>
      <ShellSearchOverlay
        open={open}
        onClose={close}
        results={results}
        query={query}
        onQueryChange={setQuery}
        onSelect={setPicked}
      />
    </div>
  )
}
