import { useState } from 'react'
import { Button, InlineAddRow, MenuMore, SearchInput, SectionText, SegmentedToggle, SizeChip, ValueField } from '@kolkrabbi/kol-component'
import { PropertyRail } from '@kolkrabbi/kol-shell'
import { Card, FoldedHead, KanbanColumn, SectionHead, TaskCard } from '@kolkrabbi/kol-dashboards'

/* W3.5 — Float · Adaptive workspace (kol-float--style 9:15449, rules 9:15179): the Tasks content (Briefs · Todos ·
 * Other) and the shared inspector. Layout, not function — text and numbers as drawn; every box a shipped part. */

const MORE = [{ key: 'rename', label: 'Rename' }, { key: 'hide', label: 'Hide group' }]
const more = (label) => <MenuMore variant="float" label={label} items={MORE} />

const TODOS = [
  { size: 'Small', chip: 'S', task: 'Rename a card', add: 'Add small', selected: true },
  { size: 'Medium', chip: 'M', task: 'Wire the tab shell', add: 'Add medium' },
  { size: 'Big', chip: 'B', task: 'Add gcalcli calendar tab', add: 'Add big' },
]

export default function Workspace() {
  const [status, setStatus] = useState('open')
  const [query, setQuery] = useState('')
  const [fold, setFold] = useState({ briefs: false, todos: false })
  const flip = (k) => () => setFold((f) => ({ ...f, [k]: !f[k] }))

  return (
    <div className="relative flex min-h-full flex-col px-8">
      <SectionText variant="float" eyebrow="DASHBOARD  /  TASKS" headline="Tasks, in focus." body="Tasks, projects, links — your living workspace." meta="5 OPEN / 3 GROUPS" />

      <div className="mt-1.5 flex items-center justify-between gap-4">
        <SegmentedToggle variant="float" size="sm" ariaLabel="Task status" className="w-[276px]" value={status} onChange={setStatus}
          options={[{ value: 'open', label: 'Open', count: 5 }, { value: 'completed', label: 'Completed' }]} />
        <SearchInput variant="float" size="md" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search tasks…" shortcutHint="⌘F" className="w-[280px]" />
      </div>

      <div className="mt-7 flex flex-col gap-[26px]">
        <Card variant="float" title="Briefs" count={1} controls={more('Briefs options')} folded={fold.briefs} onFold={flip('briefs')} addLabel="New brief">
          <TaskCard title="Design the Tasks tab (Briefs / Todos / Other)" date="2026-07-01" className="px-0! py-2.5!" />
        </Card>

        <Card variant="float" title="Todos" count={3} controls={more('Todo options')} folded={fold.todos} onFold={flip('todos')}>
          <div className="mt-1.5 grid grid-cols-3 gap-4">
            {TODOS.map((t) => (
              <KanbanColumn key={t.size} title={t.size} count={<SizeChip>{t.chip}</SizeChip>} className="min-h-[154px]">
                <TaskCard size="sm" title={t.task} selected={t.selected} />
                <InlineAddRow variant="float" size="sm" label={t.add} kbd={false} />
              </KanbanColumn>
            ))}
          </div>
        </Card>

        <FoldedHead title="Other" count={1} className="mt-2.5 w-[196px]" />
      </div>

      <span className="kol-float-ruler mt-[58px] pb-24 text-fg-64">5 open tasks</span>

      {/* the folded task index — a bottom Rail folded to its pill, centred under the content */}
      <Button variant="float" tone="grey" size="lg" iconLeft="table" iconRight="chevron-up"
        className="absolute bottom-1 left-1/2 w-[256px] -translate-x-1/2">
        Task index <span className="kol-float-timecode text-fg-64 ml-6">5</span>
      </Button>
    </div>
  )
}

/* the shared inspector in Properties mode, its fields following the selected todo */
function WorkspaceInspector({ hide }) {
  const [tab, setTab] = useState('properties')
  const [open, setOpen] = useState(true)
  const label = (t) => <span className="kol-float-ruler text-fg-64">{t}</span>
  return (
    <PropertyRail title="Inspector" width={340} onCollapse={hide}
      tabs={[{ value: 'layers', label: 'Layers' }, { value: 'properties', label: 'Properties' }]} tab={tab} onTab={setTab}
      sections={[{ rows: [
        { id: 'selected', render: () => (
          <div className="flex flex-col gap-3 pt-2">
            {label('SELECTED TODO')}
            <span className="kol-float-section text-fg-96">Rename a card</span>
          </div>
        ) },
        { id: 'task', render: () => <SectionHead title="Task" folded={!open} onFold={() => setOpen(!open)} className="pt-4" /> },
        ...(open ? [
          { id: 'status', render: () => (
            <div className="grid grid-cols-2 gap-5">
              <div className="flex flex-col gap-2">{label('STATUS')}<ValueField>Open</ValueField></div>
              <div className="flex flex-col gap-2">{label('GROUP')}<ValueField>Todos</ValueField></div>
            </div>
          ) },
          { id: 'size', render: () => (
            <div className="flex flex-col gap-2">
              {label('SIZE')}
              <ValueField>Small<span className="kol-float-timecode text-fg-64 ml-auto">S</span></ValueField>
            </div>
          ) },
        ] : []),
        { id: 'notes', render: () => <FoldedHead title="Notes" className="w-full bg-[var(--kol-float-well)]!" /> },
        { id: 'complete', render: () => <Button variant="float" tone="inverted" size="md" iconLeft="check" className="mt-[92px] w-full justify-center">Mark complete</Button> },
        { id: 'path', render: () => <span className="kol-float-timecode pb-2.5 text-fg-64">Todos / Small</span> },
      ] }]} />
  )
}

export const inspector = ({ hide }) => <WorkspaceInspector hide={hide} />

/* the frame's bar (9:15506): the Studio / Dashboard crumb, the six page tabs, search and New task — through `layout.bar`.
 * Layout, not function: the other pages are not this view, so Tasks stays lit */
const noop = () => {}
const PAGES = [
  { value: 'tasks', label: 'Tasks', count: 5 },
  { value: 'capture', label: 'Capture', count: 3 },
  { value: 'projects', label: 'Projects' },
  { value: 'calendar', label: 'Calendar' },
  { value: 'metrics', label: 'Metrics' },
  { value: 'links', label: 'Links' },
]

/* the frame draws the nav Rail at 72 */
export const layout = {
  defaultRail: 'collapsed',
  bar: { document: { name: 'Studio / Dashboard', onMenu: noop }, tabs: PAGES, tab: 'tasks', onTab: noop, onSearch: noop, action: { label: 'New task', onPress: noop } },
}
