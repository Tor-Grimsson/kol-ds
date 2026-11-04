import { useState } from 'react'
import { DetailsOverlay } from '@kolkrabbi/kol-dashboards'
import { Button } from '@kolkrabbi/kol-component'

// Inline fixture — every project, sortable by its counts.
const columns = [
  { key: 'label', label: 'Project' },
  { key: 'open', label: 'Open' },
  { key: 'done', label: 'Done' },
  { key: 'hours', label: 'Hours', fmt: (v) => `${v}h` },
]
const rows = [
  { label: 'Website', open: 14, done: 41, hours: 62 },
  { label: 'Record', open: 9, done: 22, hours: 38 },
  { label: 'Type foundry', open: 6, done: 17, hours: 25 },
  { label: 'Print', open: 3, done: 9, hours: 12 },
  { label: 'Brand book', open: 0, done: 30, hours: 9 },
]

export default function DetailsOverlayPreview() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button tone="ghost" size="sm" iconOnly="maximize" aria-label="Expand" onClick={() => setOpen(true)} />
      <DetailsOverlay open={open} onClose={() => setOpen(false)} title="Projects" columns={columns} rows={rows} />
    </>
  )
}
