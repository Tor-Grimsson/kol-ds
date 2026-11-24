import { useState } from 'react'
import { Button, CommandOverlay } from '@kolkrabbi/kol-component'

export const stage = 'md'
/* drill-in: categories first, a `keepOpen` row swaps the list in place (the ⌘K drill-in) */
export const variants = ['default', 'float', 'drill-in', 'kolbox', 'folio']

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
  /* kolbox (plan-2026-11-18-kolbox-system W31.2 batch 5) */
  if (variant === 'kolbox') return (
    <div className="flex gap-2"><KolboxSearch /><KolboxCommands /></div>
  )
  if (variant === 'drill-in') return <DrillIn />
  if (variant === 'folio') return <FolioSearch />
  return <Plain variant={variant} />
}

function Plain({ variant }) {
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
        variant={variant}
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

/* kolbox: presentational, the host keeps the query and the lit row */
/* folio (Folio batch B): the search modal (mode search) and the command list (mode commands), presentational; in a box
 * here so they stay in the preview */
const FOLIO_ROWS = INDEX.map((r) => ({ ...r, label: r.label, group: r.group, hint: r.hint ? `in ${r.hint}` : null }))
function FolioSearch() {
  const [mode, setMode] = useState('search')
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const rows = FOLIO_ROWS.filter((r) => r.label.toLowerCase().includes(query.toLowerCase()))
  return (
    <div data-folio-theme="light" className="relative flex h-[420px] w-full items-center justify-center bg-(--kol-folio-paper) font-(family-name:--kol-font-family-float) leading-[1.21] text-(--kol-folio-ink)" style={{ transform: 'translateZ(0)' }}>
      <div className="flex gap-2"><Button onClick={() => setMode('search')}>Search modal</Button><Button onClick={() => setMode('commands')}>Command list</Button></div>
      <CommandOverlay variant="folio" mode={mode} open={!!mode} onClose={() => setMode(null)} aria-label={mode === 'commands' ? 'Commands' : 'Search the library'}
        placeholder={mode === 'commands' ? 'Type a command' : 'Search every document'} query={query} onQueryChange={(v) => { setQuery(v); setActive(0) }}
        results={mode === 'commands' ? rows.map((r) => ({ id: r.id, label: `${r.group}: ${r.label}`, hint: '⌘K' })) : rows} active={active} onActive={setActive}
        onSelect={() => setMode(null)} empty={query && !rows.length ? 'Nothing matches.' : null} />
    </div>
  )
}

/* kolbox from `results` (Folio on kolbox, 2026-11-22): the command list, `mode="commands"`, its keys as caps */
const KOLBOX_COMMANDS = [{ label: 'File: Save', hint: '⌘S' }, { label: 'Edit: Undo', hint: '⌘Z' }, { label: 'Edit: Find & replace', hint: '⌘F' }, { label: 'File: Export .md' }]
function KolboxCommands() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const list = KOLBOX_COMMANDS.filter((c) => c.label.toLowerCase().includes(query.toLowerCase()))
  return (
    <>
      <Button variant="kolbox" onClick={() => setOpen(true)}>Command list</Button>
      <CommandOverlay variant="kolbox" mode="commands" open={open} onClose={() => setOpen(false)} aria-label="Commands" placeholder="Type a command" query={query} onQueryChange={(v) => { setQuery(v); setActive(0) }} results={list} active={active} onActive={setActive} onSelect={() => setOpen(false)} empty={!list.length ? 'No command matches.' : null} />
    </>
  )
}

function KolboxSearch() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const groups = [{ title: 'Tools', rows: [{ id: 'pen', icon: 'pen', label: 'Pen', hint: 'P', kbd: true }, { id: 'hand', icon: 'hand', label: 'Hand', hint: 'H', kbd: true }] }, { title: 'Pages', rows: [{ id: 'home', icon: 'home-01', label: 'Home' }] }]
  return (
    <>
      <Button variant="kolbox" onClick={() => setOpen(true)}>Search</Button>
      <CommandOverlay variant="kolbox" open={open} onClose={() => setOpen(false)} query={query} onQueryChange={setQuery} groups={groups} active={active} onActive={setActive} onSelect={() => setOpen(false)} />
    </>
  )
}
