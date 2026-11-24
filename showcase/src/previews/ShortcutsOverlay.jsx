import { useState } from 'react'
import { Button, ShortcutsOverlay } from '@kolkrabbi/kol-component'

export const frame = 520

export const variants = ['overlay', 'folio', 'kolbox']

const SHORTCUTS = [
  { section: 'Navigation', items: [{ id: 'search', label: 'Search', combo: '⌘K' }, { id: 'rails', label: 'Hide both rails', combo: '\\' }] },
  { section: 'Page', items: [{ id: 'fm', label: 'Frontmatter', combo: 'F' }, { id: 'fold', label: 'Fold categories', combo: 'C' }] },
]

/* The keyboard-shortcut sheet over its scrim; Esc or a click on the scrim closes it. */
export default function ShortcutsOverlayPreview({ variant = 'overlay' }) {
  const [open, setOpen] = useState(true)
  /* kolbox (Folio on kolbox, 2026-11-22): kolbox's S sheet, CommandOverlay kolbox mode shortcuts, the sections as folds */
  if (variant === 'kolbox') return (
    <div className="flex min-h-dvh items-center justify-center">
      <Button variant="kolbox" onClick={() => setOpen(true)}>Show shortcuts</Button>
      {open && <ShortcutsOverlay variant="kolbox" shortcuts={SHORTCUTS} onClose={() => setOpen(false)} />}
    </div>
  )
  /* folio (Folio batch B): Folio's flat list on its dim, in a box here so it stays in the preview */
  if (variant === 'folio') return (
    <div data-folio-theme="light" className="relative flex h-[420px] w-full items-center justify-center bg-(--kol-folio-paper) font-(family-name:--kol-font-family-float) leading-[1.21] text-(--kol-folio-ink)" style={{ transform: 'translateZ(0)' }}>
      <Button onClick={() => setOpen(true)}>Show shortcuts</Button>
      {open && <ShortcutsOverlay variant="folio" shortcuts={SHORTCUTS.flatMap((s) => s.items)} onClose={() => setOpen(false)} />}
    </div>
  )
  return (
    <div className="flex min-h-dvh items-center justify-center">
      <Button onClick={() => setOpen(true)}>Show shortcuts</Button>
      {open && <ShortcutsOverlay shortcuts={SHORTCUTS} onClose={() => setOpen(false)} />}
    </div>
  )
}
