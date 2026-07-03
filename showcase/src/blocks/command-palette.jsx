import { useState } from 'react'
import { Button, ShellSearchOverlay } from '@kolkrabbi/kol-component'

export const meta = {
  title: 'Command palette',
  description: 'A ⌘K command palette opened from a button, with grouped fixture results',
  category: 'toolbar',
}
export const stage = 'md'

/* The overlay is content-agnostic: it renders whatever pre-filtered `results`
 * we hand it and emits onSelect(item). We own open + query + a filtered view
 * here; selecting a row records it and the overlay closes itself via onClose. */
const RESULTS = [
  { id: 'new-print', label: 'New print', group: 'Actions', hint: 'Start a catalogue entry' },
  { id: 'upload', label: 'Upload artwork', group: 'Actions', hint: 'Add a high-res master file' },
  { id: 'orders', label: 'View orders', group: 'Navigate', hint: 'Recent purchases and fulfilment' },
  { id: 'editions', label: 'Limited editions', group: 'Navigate', hint: 'Numbered and signed runs' },
  { id: 'theme', label: 'Toggle theme', group: 'Settings', hint: 'Switch light and dark' },
  { id: 'invite', label: 'Invite a collaborator', group: 'Settings', hint: 'Share studio access' },
]

export default function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(null)

  const results = query
    ? RESULTS.filter((item) => item.label.toLowerCase().includes(query.toLowerCase()))
    : RESULTS

  return (
    <div className="flex h-full min-h-0 w-full flex-col items-center justify-center gap-4 bg-surface-primary p-8">
      <Button variant="secondary" iconLeft="search" onClick={() => setOpen(true)}>
        Search commands
      </Button>
      <p className="kol-mono-12 text-fg-48">
        {selected ? `Ran command: ${selected}` : 'Open the palette, then arrow through the results'}
      </p>

      <ShellSearchOverlay
        open={open}
        onClose={() => setOpen(false)}
        results={results}
        query={query}
        onQueryChange={setQuery}
        onSelect={(item) => setSelected(item.label)}
        placeholder="Type a command or search…"
      />
    </div>
  )
}
