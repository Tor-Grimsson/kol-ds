import { useState } from 'react'
import { IconToggle } from '@kolkrabbi/kol-component'

/* mirror's studio chrome — Frame · Grid · Lock; size rides the toolbar picker */
export const variants = ['default', 'danger']
export const sizes = ['sm', 'md', 'xs']

export default function IconTogglePreview({ variant = 'default', size = 'sm' }) {
  const [frame, setFrame] = useState(true)
  const [grid, setGrid] = useState(false)
  const [lock, setLock] = useState(true)
  return (
    <div className="flex items-center gap-3">
      <IconToggle icon="crop" label="Frame" title="Frame (F)" pressed={frame} onChange={setFrame} size={size} tone={variant} />
      <IconToggle icon="grid" label="Grid" title="Grid (G)" pressed={grid} onChange={setGrid} size={size} tone={variant} />
      <IconToggle icon="unlock" iconOn="lock" label="Lock" title="Lock the view (L)" pressed={lock} onChange={setLock} size={size} tone={variant === 'default' ? 'danger' : variant} />
    </div>
  )
}

/* Index card: one canonical instance. */
export function Card() {
  const [on, setOn] = useState(true)
  return <IconToggle icon="unlock" iconOn="lock" label="Lock" pressed={on} onChange={setOn} tone="danger" />
}
