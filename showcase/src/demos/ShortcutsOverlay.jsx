import { useState } from 'react'
import { Button, ShortcutsOverlay } from '@kolkrabbi/kol-component'

export const frame = 520

const SHORTCUTS = [
  { section: 'Navigation', items: [{ id: 'search', label: 'Search', combo: '⌘K' }, { id: 'rails', label: 'Hide both rails', combo: '\\' }] },
  { section: 'Page', items: [{ id: 'fm', label: 'Frontmatter', combo: 'F' }, { id: 'fold', label: 'Fold categories', combo: 'C' }] },
]

/* The keyboard-shortcut sheet over its scrim; Esc or a click on the scrim closes it. */
export default function ShortcutsOverlayDemo() {
  const [open, setOpen] = useState(true)
  return (
    <div className="flex min-h-dvh items-center justify-center">
      <Button onClick={() => setOpen(true)}>Show shortcuts</Button>
      {open && <ShortcutsOverlay shortcuts={SHORTCUTS} onClose={() => setOpen(false)} />}
    </div>
  )
}
