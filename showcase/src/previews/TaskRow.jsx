import { useState } from 'react'
import { TaskRow, InlineAddRow } from '@kolkrabbi/kol-component'

export const stage = 'lg'

/* a task with its date chip, the panel ending in its inline add */
export default function TaskRowPreview() {
  const [tasks, setTasks] = useState([{ id: 1, title: 'Design the Tasks tab (Briefs / Todos / Other)', date: '2026-07-01', done: false }])
  return (
    <div className="flex w-full max-w-[940px] flex-col gap-3 rounded-[var(--kol-float-menu-r)] bg-surface-secondary p-6">
      {tasks.map((t) => (
        <TaskRow key={t.id} title={t.title} date={t.date} done={t.done} onDone={(v) => setTasks((ts) => ts.map((x) => (x.id === t.id ? { ...x, done: v } : x)))} onDate={() => {}} />
      ))}
      <InlineAddRow variant="float" size="sm" label="New brief" onAdd={(title) => setTasks((ts) => [...ts, { id: Date.now(), title, done: false }])} />
    </div>
  )
}
