import { useState } from 'react'
import { StepList } from '@kolkrabbi/kol-component'

export const stage = 'sm'
/* the two reorder variants ride the toolbar picker; `readOnly` strips every affordance */
export const variants = ['grab', 'arrows']
export const sizes = ['sm', 'md', 'lg', 'xs']

const SEED = [
  { id: 'a', label: 'Scanline' },
  { id: 'b', label: 'Halftone' },
  { id: 'c', label: 'Spaced drift' },
]

/* Rows are consumer-owned (the morph store in fxr): select, remove, move and add write back here. */
export default function StepListPreview({ variant = 'grab', size = 'sm' }) {
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
