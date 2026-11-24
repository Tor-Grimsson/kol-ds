import { useState } from 'react'
import { ToolRail, ToolRailSlot } from '@kolkrabbi/kol-shell'
import { Button } from '@kolkrabbi/kol-component'

/* the editor's tool column, one per surface (the gap map's row 63 — eight 40 slots, 4 apart, the armed tool lit) */
const TOOLS = [
  { id: 'select', icon: 'pointer', label: 'Select', kbd: 'V' },
  { id: 'move', icon: 'drag-handle', label: 'Move', kbd: 'H' },
  { id: 'rect', icon: 'square', label: 'Rectangle', kbd: 'R' },
  { id: 'ellipse', icon: 'circle', label: 'Ellipse', kbd: 'O' },
  { id: 'text', icon: 'type', label: 'Text', kbd: 'T' },
  { id: 'pen', icon: 'pen', label: 'Pen', kbd: 'P' },
  { id: 'image', icon: 'image', label: 'Image', kbd: 'I' },
  { id: 'effect', icon: 'radial-star', label: 'Effect', kbd: 'E' },
]

export const variants = ['default', 'kolbox', 'folio']

export default function ToolRailPreview({ variant = 'default' }) {
  /* folio (Folio migration batch D): the toolbar row under the menus, the format's tools as children */
  if (variant === 'folio') return (
    <div className="w-full" style={{ background: 'var(--kol-folio-paper)', color: 'var(--kol-folio-ink)' }}>
      <ToolRail variant="folio"><Button variant="folio" iconLeft="image">Image</Button><Button variant="folio" iconLeft="download">Export</Button><Button variant="folio" iconLeft="search" pressed>Find</Button></ToolRail>
    </div>
  )
  /* kolbox (plan-2026-11-18-kolbox-system W31.2 batch 5) */
  if (variant === 'kolbox') return (
    <ToolRail variant="kolbox" value="select" onVariants={() => {}}
      tools={[{ id: 'select', icon: 'pointer', label: 'Select', kbd: 'V', more: [{ id: 'select', icon: 'pointer', label: 'Select' }] }, { id: 'pen', icon: 'pen', label: 'Pen', kbd: 'P' }, { divider: true }, { id: 'hand', icon: 'hand', label: 'Hand', kbd: 'H' }]}
      end={<ToolRailSlot icon="panel-bottom" label="Timeline" lit />} />
  )
  const [tool, setTool] = useState('select')
  return (
    <div className="flex flex-wrap items-start gap-8">
      <ToolRail tools={TOOLS} value={tool} onChange={setTool} />
      <ToolRail tools={TOOLS} value={tool} onChange={setTool} surface="glass-dark" />
      <ToolRail tools={TOOLS} value={tool} onChange={setTool} surface="glass-light" />
    </div>
  )
}
