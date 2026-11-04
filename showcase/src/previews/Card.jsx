import { useState } from 'react'
import { Card, RankedList, TaskCard } from '@kolkrabbi/kol-dashboards'
import { MenuMore } from '@kolkrabbi/kol-component'

export const stage = 'md'

/* the three head forms: one title, a tab row, a tab that opens a menu · float: the float sheet — a group card with its
 * rows and add row, and the same card folded */
export const variants = ['title', 'tabs', 'menu', 'float']

// Inline fixture — open tasks by project and by owner.
const ROWS = {
  project: [{ label: 'Website', value: 14 }, { label: 'Record', value: 9 }, { label: 'Type foundry', value: 6 }, { label: 'Print', value: 3 }],
  owner: [{ label: 'Tor', value: 21 }, { label: 'Studio', value: 8 }, { label: 'Unassigned', value: 3 }],
  week: [{ label: 'Website', value: 5 }, { label: 'Record', value: 2 }],
  month: [{ label: 'Website', value: 11 }, { label: 'Record', value: 7 }, { label: 'Print', value: 2 }],
}

const more = <MenuMore label="Sort" minWidth={200} items={[{ heading: 'Sort by' }, { key: 'count', label: 'Count', checked: true }, { key: 'name', label: 'Name' }]} />

export default function CardPreview({ variant = 'title' }) {
  const [tab, setTab] = useState(variant === 'menu' ? 'week' : 'project')
  const [folded, setFolded] = useState(false)
  const [done, setDone] = useState(false)
  if (variant === 'float') {
    return (
      <div className="w-full max-w-[640px] flex flex-col gap-4">
        <Card variant="float" title="Briefs" count="1 open" controls={more} folded={folded} onFold={() => setFolded((f) => !f)} addLabel="New brief" onAdd={() => {}}>
          <TaskCard size="sm" title="Design the Tasks tab (Briefs / Todos / Other)" date="2026-07-01" done={done} onToggle={setDone} />
          <TaskCard size="sm" title="Rename a card" chip="S" done={false} onToggle={() => {}} />
        </Card>
        <Card variant="float" title="Profiles" folded onFold={() => {}} />
      </div>
    )
  }
  const tabs = variant === 'tabs'
    ? [{ key: 'project', label: 'Projects' }, { key: 'owner', label: 'Owners' }]
    : [{ key: 'project', label: 'Projects' }, { key: 'done', label: 'Done', options: [{ key: 'week', label: 'This week' }, { key: 'month', label: 'This month' }] }]
  return (
    <div className="w-full max-w-[640px]">
      <Card
        {...(variant === 'title' ? { title: 'Open tasks' } : { tabs, tab, onTab: setTab })}
        onExpand={() => {}}
        controls={more}
        footLeft={<span>Updated today</span>}
        footRight={<span className="text-fg-80">32 open</span>}
      >
        <RankedList rows={ROWS[variant === 'title' ? 'project' : tab] ?? ROWS.project} total={32} column="Project" valueLabel="Tasks" />
      </Card>
    </div>
  )
}
