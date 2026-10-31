import { useState } from 'react'
import { StepList, Slider } from '@kolkrabbi/kol-component'

export const stage = 'sm'
/* the two reorder variants ride the toolbar picker; `readOnly` strips every affordance */
export const variants = ['grab', 'arrows', 'layers']
export const sizes = ['sm', 'md', 'lg', 'xs']

const SEED = [
  { id: 'a', label: 'Scanline' },
  { id: 'b', label: 'Halftone' },
  { id: 'c', label: 'Spaced drift' },
]

const ROLES = [
  { id: 'p', label: 'Primary', swatch: '#E74C3C', shown: true, o: 100 },
  { id: 's', label: 'Secondary', swatch: '#3C8CE7', shown: true, o: 60 },
  { id: 'b', label: 'Background', swatch: '#1E1E1E', shown: false, o: 100 },
]

/* `layers`: fxr's Layers sections (lobby ItemList) — swatch, eye, an inline opacity slider, up / down actions
 * (the edge one hidden, its slot kept) */
function LayersPreview({ size }) {
  const [rows, setRows] = useState(ROLES)
  const [active, setActive] = useState(0)
  const move = (from, to) => setRows((list) => { const next = [...list]; const [row] = next.splice(from, 1); next.splice(to, 0, row); return next })
  const set = (i, patch) => setRows((list) => list.map((r, j) => (j === i ? { ...r, ...patch } : r)))
  return (
    <StepList
      size={size}
      activeIndex={active}
      onSelect={setActive}
      onMove={move}
      onToggleShown={(i) => set(i, { shown: !rows[i].shown })}
      items={rows.map((r, i) => ({
        ...r,
        control: <Slider min={0} max={100} value={r.o} onChange={(o) => set(i, { o })} />,
        actions: [
          { icon: 'chevron-up', label: 'Move up', hidden: i === 0, onClick: () => move(i, i - 1) },
          { icon: 'chevron-down', label: 'Move down', hidden: i === rows.length - 1, onClick: () => move(i, i + 1) },
        ],
      }))}
    />
  )
}

/* Rows are consumer-owned (the morph store in fxr): select, remove, move and add write back here. */
export default function StepListPreview({ variant = 'grab', size = 'sm' }) {
  if (variant === 'layers') return <LayersPreview size={size} />
  const [items, setItems] = useState(SEED)
  const [active, setActive] = useState(0)
  const move = (from, to) => setItems((list) => { const next = [...list]; const [row] = next.splice(from, 1); next.splice(to, 0, row); return next })
  return (
    <StepList
      items={items}
      activeIndex={active}
      reorder={variant}
      size={size}
      onSelect={setActive}
      onRemove={(i) => setItems((list) => list.filter((_, j) => j !== i))}
      onMove={move}
      onAdd={() => setItems((list) => [...list, { id: `s${Date.now()}`, label: `Step ${list.length + 1}` }])}
    />
  )
}

/* Index card: one canonical instance. */
export function Card() {
  return <StepList items={SEED} activeIndex={1} onSelect={() => {}} onRemove={() => {}} onMove={() => {}} onAdd={() => {}} />
}
