import { useState } from 'react'
import { InlineAddRow } from '@kolkrabbi/kol-component'

export const stage = 'md'

export const variants = ['float', 'filled']

/* type and press Enter — the row adds, then clears */
export default function InlineAddRowPreview({ variant = 'float' }) {
  const [added, setAdded] = useState([])
  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      <InlineAddRow variant={variant} label="New brief" onAdd={(t) => setAdded((a) => [...a, t])} />
      {added.length > 0 && <ul className="kol-float-hint text-fg-64 flex flex-col gap-1 px-4">{added.map((t, i) => <li key={i}>{t}</li>)}</ul>}
    </div>
  )
}
