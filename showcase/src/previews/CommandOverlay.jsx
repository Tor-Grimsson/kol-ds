import { useState } from 'react'
import { Button, CommandOverlay } from '@kolkrabbi/kol-component'

export const stage = 'md'
/* drill-in: categories first, a `keepOpen` row swaps the list in place (the ⌘K drill-in) */
export const variants = ['default', 'drill-in']

const INDEX = [
  { id: 'color', label: 'Color tokens', group: 'Theme', hint: 'kol-color.css' },
  { id: 'type', label: 'Typography', group: 'Theme', hint: 'kol-typography.css' },
  { id: 'button', label: 'Button', group: 'Atoms' },
  { id: 'input', label: 'Input', group: 'Atoms' },
  { id: 'search-input', label: 'SearchInput', group: 'Atoms' },
  { id: 'media-card', label: 'MediaCard', group: 'Molecules' },
  { id: 'media-row', label: 'MediaRow', group: 'Molecules' },
]

const CATEGORIES = { Theme: ['Color tokens', 'Typography'], Atoms: ['Button', 'Input', 'SearchInput'], Molecules: ['MediaCard', 'MediaRow'] }

function DrillIn() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [cat, setCat] = useState(null)
  const [picked, setPicked] = useState(null)
  const suggestions = cat
    ? [{ id: 'back', label: '← All categories', keepOpen: true }, ...CATEGORIES[cat].map((label) => ({ id: label, label, group: cat }))]
    : Object.keys(CATEGORIES).map((c) => ({ id: c, label: c, hint: `${CATEGORIES[c].length} items`, keepOpen: true }))
  const results = query ? INDEX.filter((i) => i.label.toLowerCase().includes(query.toLowerCase())) : []
  const close = () => { setOpen(false); setQuery(''); setCat(null) }
  const select = (item) => {
    if (item.id === 'back') setCat(null)
    else if (CATEGORIES[item.id]) setCat(item.id)
    else setPicked(item)
  }
  return (
    <div className="flex items-center gap-4">
      <Button onClick={() => setOpen(true)}>Open search modal</Button>
      <p className="kol-mono-12 text-fg-48">{picked ? `Selected: ${picked.label}` : 'Pick a category — the modal stays open'}</p>
      <CommandOverlay open={open} onClose={close} results={results} suggestions={suggestions} query={query} onQueryChange={setQuery} onSelect={select} />
    </div>
  )
}

export default function CommandOverlayPreview({ variant = 'default' }) {
  if (variant === 'drill-in') return <DrillIn />
  return <Plain />
}

function Plain() {
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
      <Button onClick={() => setOpen(true)}>Open search modal</Button>
      <p className="kol-mono-12 text-fg-48">
        {picked ? `Selected: ${picked.label}` : 'Arrows move · Enter selects · Esc closes'}
      </p>
      <CommandOverlay
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
