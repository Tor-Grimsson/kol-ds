import { useState } from 'react'
import { Button, FlipCard, ProgressBar, SortableGrid, StatusChip } from '@kolkrabbi/kol-component'

export const stage = 'full'

/* record's Projects grid on invented VOYAGER projects: each a 240 FlipCard — the front a title, a status that cycles, a
 * progress bar; Details turns it to the tasks, which scroll — reordered by the grip (drag, or arrows on the focused grip) */
const STATUS = [
  { value: 'active', label: 'active', tone: 'success' },
  { value: 'blocked', label: 'blocked', tone: 'warning' },
  { value: 'done', label: 'done' },
  { value: 'idea', label: 'idea', tone: 'info' },
]
const tasks = (n, done) => Array.from({ length: n }, (_, i) => ({ text: `Task ${i + 1}`, done: i < done }))
const SEED = [
  { id: 'manual', title: 'Field Manual 2027', status: 'active', tasks: tasks(14, 5) },
  { id: 'poster', title: 'Season poster', status: 'blocked', tasks: tasks(3, 1) },
  { id: 'press', title: 'Launch press', status: 'done', tasks: tasks(4, 4) },
  { id: 'site', title: 'Booking site', status: 'idea', tasks: [] },
]

function Project({ p, handle, onPatch }) {
  const done = p.tasks.filter((t) => t.done).length
  return (
    <FlipCard
      height={240}
      className="rounded border border-fg-08 bg-surface-secondary"
      front={({ flip }) => (
        <div className="flex h-full flex-col gap-3 p-4">
          <div className="flex items-start gap-2">
            {handle}
            <span className="kol-sans-heading-04 text-emphasis flex-1 min-w-0">{p.title}</span>
            <StatusChip cycle options={STATUS} value={p.status} onChange={(status) => onPatch({ status })} ariaLabel="Status" />
          </div>
          <ProgressBar value={done} max={p.tasks.length} caption={(v, m) => `${v}/${m} done`} />
          <Button variant="nav" size="sm" className="mt-auto self-end" onClick={flip}>Details</Button>
        </div>
      )}
      back={({ flip }) => (
        <div className="flex flex-col gap-2 p-4">
          <Button variant="nav" size="sm" className="self-end" onClick={flip}>Back</Button>
          {p.tasks.length ? p.tasks.map((t, i) => <span key={i} className={`kol-sans-body-03 ${t.done ? 'text-meta line-through' : 'text-body'}`}>{t.text}</span>) : <span className="kol-sans-body-03 text-meta">No tasks.</span>}
        </div>
      )}
    />
  )
}

export default function SortableGridPreview() {
  const [items, setItems] = useState(SEED)
  const reorder = (from, to) => setItems((l) => { const n = [...l]; n.splice(to, 0, n.splice(from, 1)[0]); return n })
  return (
    <div className="w-full">
      <SortableGrid items={items} onReorder={reorder} renderItem={(p, { handle }) => (
        <Project p={p} handle={handle} onPatch={(patch) => setItems((l) => l.map((x) => (x.id === p.id ? { ...x, ...patch } : x)))} />
      )} />
    </div>
  )
}
