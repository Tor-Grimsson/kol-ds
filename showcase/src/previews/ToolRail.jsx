import { useState } from 'react'
import { ToolRail } from '@kolkrabbi/kol-shell'

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

export default function ToolRailPreview() {
  const [tool, setTool] = useState('select')
  return (
    <div className="flex flex-wrap items-start gap-8">
      <ToolRail tools={TOOLS} value={tool} onChange={setTool} />
      <ToolRail tools={TOOLS} value={tool} onChange={setTool} surface="glass-dark" />
      <ToolRail tools={TOOLS} value={tool} onChange={setTool} surface="glass-light" />
    </div>
  )
}
