import { useState } from 'react'
import { IndexRow } from '@kolkrabbi/kol-component'

export const stage = 'lg'

/* a dense index — check · title · group · date · state */
export default function IndexRowPreview() {
  const [done, setDone] = useState({})
  const [sel, setSel] = useState('a')
  const rows = [
    { id: 'a', title: 'Design the Tasks tab (Briefs / Todos / Other)', cells: ['Briefs', { value: '—', mono: true }, 'Open'] },
    { id: 'b', title: 'Wire the capture inbox', cells: ['Todos', { value: '2026-07-04', mono: true }, 'Open'] },
  ]
  return (
    <div className="flex w-full max-w-[940px] flex-col gap-1">
      {rows.map((r) => (
        <IndexRow key={r.id} title={r.title} cells={r.cells} selected={sel === r.id} onClick={() => setSel(r.id)}
          checked={!!done[r.id]} onCheck={(v) => setDone((d) => ({ ...d, [r.id]: v }))} />
      ))}
    </div>
  )
}
