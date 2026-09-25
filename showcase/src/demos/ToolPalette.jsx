import { useState } from 'react'
import { ToolPalette } from '@kolkrabbi/kol-component'

export const stage = 'hug'

/* All four cell kinds, and all three kinds of fold: Shape ARMS a tool, Boolean RUNS an action
 * (its trigger re-runs the last-picked op), and Text arms with one row — Kinetic type — that runs
 * instead. What is armed, what runs and what is disabled live in this demo, never in the row. */
export default function ToolPaletteDemo() {
  const [tool, setTool] = useState('select')
  const [selection, setSelection] = useState(2)
  const [log, setLog] = useState('—')
  const items = [
    { kind: 'tool', id: 'select', icon: 'pointer', label: 'Select', shortcut: 'V' },
    { kind: 'split', id: 'text', label: 'Text', variants: [
      { id: 'text', label: 'Text', icon: 'type', shortcut: 'T' },
      { id: 'kinetic', label: 'Kinetic type', icon: 'type-02', action: true },
    ] },
    { kind: 'tool', id: 'pen', icon: 'pen', label: 'Pen', shortcut: 'P' },
    { kind: 'split', id: 'shape', label: 'Shape', variants: [
      { id: 'rect', label: 'Rectangle', icon: 'rectangle', shortcut: 'R' },
      { id: 'ellipse', label: 'Ellipse', icon: 'circle', shortcut: 'O' },
      { id: 'triangle', label: 'Triangle', icon: 'triangle' },
      { id: 'star', label: 'Star', icon: 'star' },
    ] },
    { kind: 'divider' },
    { kind: 'action', id: 'duplicate', icon: 'copy', label: 'Duplicate', shortcut: '⌘D', disabled: selection < 1 },
    { kind: 'action', id: 'image', icon: 'image', label: 'Insert image' },
    { kind: 'divider' },
    { kind: 'split', id: 'boolean', label: 'Boolean', action: true, disabled: selection < 2, variants: [
      { id: 'unite', label: 'Unite', icon: 'plus' },
      { id: 'subtract', label: 'Subtract front', icon: 'minus' },
      { id: 'intersect', label: 'Intersect', icon: 'square' },
    ] },
  ]
  return (
    <div className="flex flex-col items-start gap-3">
      <ToolPalette items={items} activeId={tool} onSelect={setTool} onAction={(id) => setLog(id)} />
      <span className="kol-helper-10 text-meta">
        tool: {tool} · last action: {log} · selected: {selection}{' '}
        <button type="button" className="underline" onClick={() => setSelection((n) => (n + 1) % 3)}>cycle</button>
      </span>
    </div>
  )
}
