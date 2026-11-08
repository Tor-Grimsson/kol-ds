import { useState } from 'react'
import { Button, Dropdown, IndexRow, LabeledControl, SectionText, SizeChip, TabsRow, Textarea, ValueField } from '@kolkrabbi/kol-component'
import { Card, TaskCard } from '@kolkrabbi/kol-dashboards'
import { DocumentCapsule, PropertyRail, SelectionMeasure } from '@kolkrabbi/kol-shell'
import { NAV } from './Rails.jsx'

/* The record dashboard on the float frame — "Dashboard · Tasks — Visual editor alternative" (kol-float--style 9:14340),
 * plan-2026-11-04-float-views W3.3. Layout, not function: the tasks canvas in FloatLayout's content slot, the eyebrow
 * in its `eyebrow` line, the filter capsule and the task index in its `bottom` Rail, the task inspector in its inspector slot (so ⇥ hides it and Panels ▾ brings it back).
 * Every part shipped; text and numbers as drawn. The menu is the studio's nav Rail, hidden — RailTrigger opens it — and the
 * bar carries the dashboard's tabs (float-figma-review W3.3). */

const noop = () => {}
const RULER = 'kol-float-ruler text-fg-64 whitespace-pre uppercase'

const TODOS = [
  { size: 'Small', chip: 'S', title: 'Rename a card' },
  { size: 'Medium', chip: 'M', title: 'Wire the tab shell' },
  { size: 'Big', chip: 'B', title: 'Add gcalcli calendar tab' },
]

const FILTERS = [
  { id: 'all', label: 'All tasks', count: 5 },
  { id: 'briefs', label: 'Briefs', count: 1 },
  { id: 'todos', label: 'Todos', count: 3 },
  { id: 'other', label: 'Other', count: 1 },
]

/* the index's columns, at the frame's widths (GROUP 188 · SIZE 162 · STATUS 186) */
const COLS = [{ head: 'Group', width: 188 }, { head: 'Size', width: 162 }, { head: 'Status', width: 186 }]
const INDEX = [
  ['Design the Tasks tab (Briefs / Todos / Other)', 'Briefs', '—'],
  ['Rename a card', 'Todos', 'S'],
  ['Wire the tab shell', 'Todos', 'M'],
  ['Add gcalcli calendar tab', 'Todos', 'B'],
  ['Rotate the Umami password', 'Other', '—'],
]

const GROUPS = ['Briefs', 'Todos', 'Other'].map((g) => ({ value: g, label: g }))

function Group({ label, className = '', children }) {
  return (
    <section className={`flex flex-col gap-[15px] ${className}`.trim()}>
      <span className={RULER}>{label}</span>
      {children}
    </section>
  )
}

export default function RecordFloat() {
  return (
    <div className="flex min-h-full flex-col pl-10 pr-2 max-md:px-0">
      {/* the task canvas — the well under the cards, 12 under the content's top (y 140) */}
      <div className="mt-3 flex flex-col gap-[26px] bg-[var(--kol-float-well)] px-7 pb-[27px] pt-5 max-md:px-4">
        <SectionText variant="float" headline="Tasks, in focus." body="Tasks, projects, links — your living workspace." meta="5 OPEN TASKS" style={{ marginBottom: 0 }} />

        <Group label="BRIEFS  /  NEW DAILY ITEMS">
          <SelectionMeasure className="w-full">
            <TaskCard selected title="Design the Tasks tab (Briefs / Todos / Other)" group="Brief" date="2026-07-01" className="min-h-[106px]" />
          </SelectionMeasure>
        </Group>

        <Group label="TODOS  /  SMALL · MEDIUM · BIG">
          <div className="grid grid-cols-3 gap-3.5 max-md:grid-cols-1">
            {TODOS.map((t) => (
              <Card key={t.chip} variant="float" title={t.size} controls={<SizeChip>{t.chip}</SizeChip>}>
                <TaskCard size="sm" title={t.title} />
              </Card>
            ))}
          </div>
        </Group>

        <Group label="OTHER  /  MISCELLANEOUS" className="mt-1">
          <div className="rounded-[var(--kol-float-list-r)] bg-surface-secondary px-[22px] py-[13px]">
            <TaskCard size="sm" title="Rotate the Umami password" date="Other" />
          </div>
        </Group>
      </div>
    </div>
  )
}

/* the eyebrow — in FloatLayout's 40 under the bar, as the frame draws it (y 113) */
function Eyebrow() {
  return (
    <div className={`flex w-[1116px] max-w-full justify-between gap-6 pl-10 max-md:pl-0 ${RULER}`}>
      <span>WORKSPACE  /  TASKS</span>
      <span className="normal-case">5 tasks  /  3 groups</span>
    </div>
  )
}

/* the bottom Rail — the filter capsule and the Task index dock, under the canvas AND the inspector (9:14432 · 9:14446) */
function Dock() {
  const [filter, setFilter] = useState('all')
  return (
    <div className="flex flex-col gap-6 pb-2 pl-10 pr-1 max-md:px-0">
      <TabsRow variant="float" size="sm" surface="solid" tabs={FILTERS} value={filter} onChange={setFilter} ariaLabel="Task filters"
        trailing={<Button variant="float" tone="ghost" size="sm">Open only</Button>} className="self-center max-w-full" />

      <Card variant="float" title="Task index" count="5 tasks" value="1 selected">
        <div className={`-mt-3 flex gap-3 pb-2 pl-10 pr-2.5 ${RULER}`}>
          <span className="flex-1">Task</span>
          {COLS.map((c) => <span key={c.head} style={{ width: c.width }} className="shrink-0">{c.head}</span>)}
        </div>
        <div className="flex flex-col gap-[5px]">
          {INDEX.map(([title, group, size], i) => (
            <IndexRow key={title} title={title} selected={i === 0} onCheck={noop} onClick={noop}
              cells={[{ value: group, width: COLS[0].width }, { value: size, mono: true, width: COLS[1].width }, { value: 'Open', width: COLS[2].width }]} />
          ))}
        </div>
      </Card>
    </div>
  )
}

/* the task inspector — PropertyRail at the frame's 340, its fields kol-component's float controls */
function TaskInspector({ hide }) {
  const [tab, setTab] = useState('details')
  const [group, setGroup] = useState('Briefs')
  return (
    <PropertyRail title="Task details" onCollapse={hide} width={340}
      tabs={[{ value: 'details', label: 'Details' }, { value: 'notes', label: 'Notes' }]} tab={tab} onTab={setTab}
      sections={[{ rows: [
        { id: 'brief', render: () => (
          <LabeledControl variant="float" label="SELECTED BRIEF">
            <span className="kol-float-window text-fg-emphasis">Design the Tasks tab<br />(Briefs / Todos / Other)</span>
          </LabeledControl>
        ) },
        { id: 'status', render: () => (
          <div className="grid grid-cols-2 gap-3.5">
            <LabeledControl variant="float" label="STATUS"><ValueField icon="circle" className="w-full">Open</ValueField></LabeledControl>
            <LabeledControl variant="float" label="GROUP"><Dropdown variant="float" size="md" options={GROUPS} value={group} onChange={setGroup} aria-label="Group" className="w-full" /></LabeledControl>
          </div>
        ) },
        { id: 'date', render: () => <LabeledControl variant="float" label="DATE"><ValueField icon="calendar" className="w-full">2026-07-01</ValueField></LabeledControl> },
        { id: 'notes', render: () => <LabeledControl variant="float" label="NOTES"><Textarea variant="float" rows={3} placeholder="Add a note…" aria-label="Notes" /></LabeledControl> },
        { id: 'done', render: () => <Button variant="float" tone="inverted" size="md" iconLeft="check" className="w-full justify-center">Mark complete</Button> },
      ] }]} />
  )
}

export const inspector = ({ hide }) => <TaskInspector hide={hide} />

/* the dashboard's six tabs, the dashboard's own TabsRow (13:5037), then the More circle (9:14346 + 9:14365). The frame
 * draws them as a stacked mode pill; AppFloatNav's pill holds five slots at most (the phone's tab bar), so six stay a
 * TabsRow, one tab look across the dashboard views */
const PAGES = [
  { id: 'tasks', label: 'Tasks', icon: 'checklist', count: 5 },
  { id: 'capture', label: 'Capture', icon: 'inbox', count: 3 },
  { id: 'projects', label: 'Projects', icon: 'folder' },
  { id: 'calendar', label: 'Calendar', icon: 'calendar' },
  { id: 'metrics', label: 'Metrics', icon: 'bar-chart' },
  { id: 'links', label: 'Links', icon: 'link' },
]

/* the nav Rail hidden (its trigger in the corner), the eyebrow under the bar, the dock under the canvas and the inspector */
export const layout = {
  nav: NAV, currentPath: '/dashboard/tasks', onNavigate: noop, onSearch: noop, title: 'Studio', defaultExpanded: ['/dashboard'],
  defaultRail: 'hidden',
  eyebrow: <Eyebrow />, bottom: <Dock />,
  bar: {
    start: <DocumentCapsule name="Studio / Dashboard" onBack={noop} onMenu={noop} className="w-[280px]" />,
    center: (
      <>
        <TabsRow variant="float" surface="solid" size="lg" tabs={PAGES} value="tasks" onChange={noop} ariaLabel="Dashboard" className="max-md:hidden" />
        <Button variant="float" tone="primary" size="lg" iconOnly="more" aria-label="More" onClick={noop} className="max-md:hidden" />
      </>
    ),
    action: { label: 'New task', onPress: noop },
  },
}
