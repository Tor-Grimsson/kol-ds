import { useState } from 'react'
import { Button, InlineAddRow, MenuMore, SearchInput, SectionText, SizeChip, TabsRow, ValueField } from '@kolkrabbi/kol-component'
import { DocumentCapsule, PropertyRail } from '@kolkrabbi/kol-shell'
import { Card, FoldedHead, KanbanColumn, SectionHead, TaskCard } from '@kolkrabbi/kol-dashboards'
import { NAV } from './Rails.jsx'

/* W3.5 — Float · Adaptive workspace (kol-float--style 9:15449, rules 9:15179) — the dashboard on FloatLayout
 * (float-figma-review W3.2): the studio's nav Rail at 72, the dashboard's tabs in the bar, the Tasks page on the float
 * well, the shared inspector, the Task index folded to its pill in the bottom Rail. Layout, not function — text and
 * numbers as drawn; every box a shipped part. */

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
    /* the content is the dashboard's canvas: the float well under it, 128 to 952 as drawn */
    <div className="relative flex min-h-full flex-col bg-[var(--kol-float-well)] px-8 max-md:px-4">
      <SectionText variant="float" eyebrow="DASHBOARD  /  TASKS" headline="Tasks, in focus." body="Tasks, projects, links — your living workspace." />
      <span className="kol-float-ruler absolute right-[58px] top-[11px] text-fg-64 max-md:hidden">5 OPEN  /  3 GROUPS</span>

      <div className="mt-1.5 flex items-center justify-between gap-4 max-md:flex-col max-md:items-stretch">
        {/* the dashboard's status toggle (13:5037), at this frame's 276 */}
        <TabsRow variant="float" surface="solid" size="sm" value={status} onChange={setStatus} ariaLabel="Task status"
          tabs={[{ id: 'open', label: 'Open', count: 5 }, { id: 'completed', label: 'Completed' }]}
          className="w-[276px] [&_.kol-tabs-scroll]:flex-1 [&_[role=tablist]]:w-full [&_[role=tab]]:flex-1 [&_[role=tab]]:justify-between" />
        <SearchInput variant="float" size="md" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search tasks…" shortcutHint="⌘F" className="w-[280px] max-md:w-full" />
      </div>

      <div className="mt-7 flex flex-col gap-[26px]">
        <Card variant="float" title="Briefs" count={1} controls={more('Briefs options')} folded={fold.briefs} onFold={flip('briefs')} addLabel="New brief">
          <TaskCard title="Design the Tasks tab (Briefs / Todos / Other)" date="2026-07-01" className="px-0! py-2.5!" />
        </Card>

        <Card variant="float" title="Todos" count={3} controls={more('Todo options')} folded={fold.todos} onFold={flip('todos')}>
          <div className="mt-1.5 grid grid-cols-3 gap-4 max-md:grid-cols-1">
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

      <span className="kol-float-ruler mt-[58px] pb-6 text-fg-64">5 open tasks</span>
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

/* the frame's bar (9:15506): the Studio / Dashboard capsule with the dashboard's six tabs beside it (not centred), search
 * at the right, then FloatLayout's Panels (while a Rail is hidden) and New task. Layout, not function: Tasks stays lit */
const noop = () => {}
const PAGES = [
  { value: 'tasks', label: 'Tasks', count: 5 },
  { value: 'capture', label: 'Capture', count: 3 },
  { value: 'projects', label: 'Projects' },
  { value: 'calendar', label: 'Calendar' },
  { value: 'metrics', label: 'Metrics' },
  { value: 'links', label: 'Links' },
]

/* the folded task index — a bottom Rail folded to its pill (y 1008), centred under the content, not the inspector */
const TaskIndexPill = () => (
  <div className="flex justify-center pb-1 pr-[364px] pt-8 max-md:p-0">
    <Button variant="float" tone="grey" size="lg" iconLeft="table" iconRight="chevron-up" className="w-[256px]">
      Task index <span className="kol-float-timecode text-fg-64 ml-6">5</span>
    </Button>
  </div>
)

/* the dashboard on FloatLayout: the studio's nav Rail at 72 (as drawn), its tabs in the bar */
export const layout = {
  nav: NAV, currentPath: '/dashboard/tasks', onNavigate: noop, onSearch: noop, title: 'Studio', defaultExpanded: ['/dashboard'],
  defaultRail: 'collapsed',
  bottom: <TaskIndexPill />,
  bar: {
    start: (
      <>
        <DocumentCapsule name="Studio / Dashboard" onMenu={noop} className="w-[280px]" />
        <TabsRow variant="float" surface="solid" tabs={PAGES} value="tasks" onChange={noop} ariaLabel="Dashboard" className="ml-2" />
      </>
    ),
    center: <Button variant="float" tone="primary" size="lg" iconOnly="search" aria-label="Search" onClick={noop} className="ml-auto" />,
    action: { label: 'New task', onPress: noop },
  },
}
