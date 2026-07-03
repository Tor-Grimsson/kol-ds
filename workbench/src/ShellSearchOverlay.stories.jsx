import { useState } from 'react'
import { Button, ShellSearchOverlay } from '@kolkrabbi/kol-component'

const INDEX = [
  { id: 'color', label: 'Color tokens', group: 'Theme', hint: 'kol-color.css' },
  { id: 'type', label: 'Typography', group: 'Theme', hint: 'kol-typography.css' },
  { id: 'opacity', label: 'Opacity ramp', group: 'Theme', hint: 'kol-opacity.css' },
  { id: 'button', label: 'Button', group: 'Atoms' },
  { id: 'input', label: 'Input', group: 'Atoms' },
  { id: 'search-input', label: 'SearchInput', group: 'Atoms' },
  { id: 'divider', label: 'Divider', group: 'Atoms' },
  { id: 'media-card', label: 'MediaCard', group: 'Molecules' },
  { id: 'media-row', label: 'MediaRow', group: 'Molecules' },
  { id: 'dropdown', label: 'Dropdown', group: 'Molecules' },
]

export const Palette = () => {
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
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <Button onClick={() => setOpen(true)}>Open palette</Button>
      <span className="kol-mono-12 text-fg-48">
        {picked ? `Selected: ${picked.label}` : 'Type to filter · arrows move · Enter selects · Esc closes'}
      </span>
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
