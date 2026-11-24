import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import Icon from '../ui/Icon.jsx'
import { Button, ModalShell } from '@kolkrabbi/kol-component'

/* The Labs start picker (round 4, W9): the real LabsCatalogCard in kolbox's kit. Labs opens on it while the stage is
   empty: titled "Labs", the catalog's sections as rows (Color, Effects, Generative, Morph, Vector, Composition), each
   with its icon at both ends; a section with groups opens its second level (titled with the section) ending in Back;
   a pick runs the row and the card goes. Effects works on media, so on a stage with none it asks for the media first
   (onNeedMedia) and the card comes back on Effects once the media lands (`initialOpen`). No close button, as the
   real card has none: a press on the dim or Escape closes it. Its dim covers the window (the top rail it once stopped
   under is retired, plan-2026-11-20 W1.2).
   rows: the Labs catalog (labs/useCatalog.js: { key, icon, label, run, sub }). */
const MEDIA_DOORS = new Set(['sec:effects'])

const Row = ({ icon, label, tone = 'secondary', onClick }) => (
  <Button variant="kolbox" tone={tone} className="w-full justify-between!" iconLeft={icon} onClick={onClick}>
    {label}
    <Icon name={icon} />
  </Button>
)

export default function LabsStartPicker({ rows, initialOpen = null, hasMedia = true, onNeedMedia, onPicked, onClose }) {
  const [open, setOpen] = useState(initialOpen)
  const section = rows.find((r) => r.key === open) ?? null
  const list = section ? section.sub : rows
  const ref = useRef(null)
  const close = useRef(onClose); close.current = onClose
  useEffect(() => {
    const key = (e) => {
      const all = document.querySelectorAll('[data-kolbox-overlay]')
      if (e.key === 'Escape' && all[all.length - 1] === ref.current) close.current?.()
    }
    document.addEventListener('keydown', key)
    return () => document.removeEventListener('keydown', key)
  }, [])
  return createPortal(
    <div ref={ref} data-kolbox-overlay="modal" className="fixed inset-0 z-50 flex items-center justify-center bg-dim" onClick={(e) => e.target === e.currentTarget && onClose?.()}>
      <ModalShell variant="kolbox" title={section ? section.label : 'Labs'} width="var(--spacing-modal)" aria-modal="true" data-labs-start-picker="">
        <div className="flex flex-col gap-2 px-4 pb-4">
          {list.map((row) => (
            <Row
              key={row.key}
              icon={row.icon}
              label={row.label}
              onClick={() => {
                if (!section && MEDIA_DOORS.has(row.key) && !hasMedia && onNeedMedia) { onNeedMedia(row.key); return }
                if (!section && row.sub?.length) { setOpen(row.key); return }
                row.run?.()
                onPicked?.()
              }}
            />
          ))}
          {section && <Row icon="arrow-left" label="Back" tone="ghost" onClick={() => setOpen(null)} />}
        </div>
      </ModalShell>
    </div>,
    document.body,
  )
}
