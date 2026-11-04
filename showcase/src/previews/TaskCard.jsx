import { useState } from 'react'
import { TaskCard } from '@kolkrabbi/kol-dashboards'

export const stage = 'md'

/* lg: the task card, selected · sm: the rows a group card holds (a date, a size chip) */
export const sizes = ['lg', 'sm']

export default function TaskCardPreview({ size = 'lg' }) {
  const [done, setDone] = useState(false)
  const [selected, setSelected] = useState(true)
  if (size === 'sm') {
    return (
      <div className="w-full max-w-[432px] bg-surface-secondary rounded-[var(--kol-float-menu-r)] p-5 flex flex-col gap-2">
        <TaskCard size="sm" title="Design the Tasks tab (Briefs / Todos / Other)" date="2026-07-01" done={done} onToggle={setDone} />
        <TaskCard size="sm" title="Rename a card" chip="S" done={false} onToggle={() => {}} />
      </div>
    )
  }
  return (
    <div className="w-full max-w-[940px] bg-surface-secondary rounded-[var(--kol-float-menu-r)] p-2">
      <TaskCard title="Design the Tasks tab (Briefs / Todos / Other)" group="Brief" date="2026-07-01" done={done} onToggle={setDone} selected={selected} onClick={() => setSelected((s) => !s)} />
    </div>
  )
}
