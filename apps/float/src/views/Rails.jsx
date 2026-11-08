import { useState } from 'react'
import { FloatLayout, Breadcrumb, DocumentCapsule, SelectionMeasure } from '@kolkrabbi/kol-shell'
import { Button, IndexRow, SearchInput, SectionText, SizeChip, TabsRow } from '@kolkrabbi/kol-component'
import { Card, TaskCard } from '@kolkrabbi/kol-dashboards'

/* Rails — kol-float--style 9:14486 "Float · Expanded sidebar in context" (plan-2026-11-04-float-views W3.4). The frame is a
 * whole page with its own nav, so the view is `bare` and brings its own FloatLayout: the nav Rail expanded (Collapse ·
 * Hide in its foot reach the 72 Rail with its hover flyout and the hidden Rail with RailTrigger), the 64 bar, the
 * canvas, the floating filter capsule and the Task index as the bottom Rail. Layout, not function; text as drawn. */
export const bare = true

const BASE = import.meta.env.BASE_URL.replace(/\/$/, '')

/* ponytail: the collapsed sections carry one row each so their chevrons draw; the frame never opens them */
const more = (path) => [{ icon: 'file-text', label: 'All', path: `${path}/all` }]
/* the studio's nav — Workspace and Record float draw the same Rail (9:15449 at 72, 9:14340 hidden) */
export const NAV = [
  { heading: 'WORKSPACE' },
  { icon: 'home-01', label: 'Home', path: '/home' },
  {
    icon: 'grid', label: 'Dashboard', path: '/dashboard', sub: [
      { icon: 'checklist', label: 'Tasks', path: '/dashboard/tasks', count: 5 },
      { icon: 'inbox', label: 'Capture', path: '/dashboard/capture', count: 3 },
      { icon: 'folder', label: 'Projects', path: '/dashboard/projects' },
      { icon: 'calendar', label: 'Calendar', path: '/dashboard/calendar' },
      { icon: 'bar-chart', label: 'Metrics', path: '/dashboard/metrics' },
      { icon: 'link', label: 'Links', path: '/dashboard/links' },
    ],
  },
  { icon: 'file-text', label: 'Documents', path: '/documents', sub: more('/documents') },
  { icon: 'bar-chart', label: 'Founder', path: '/founder', sub: more('/founder') },
  { icon: 'bin-lid', label: 'Bucket', path: '/bucket', sub: more('/bucket') },
  { icon: 'book-open', label: 'Resume', path: '/resume' },
  { heading: 'STUDIO & LIBRARY' },
  { icon: 'folder', label: 'Studio', path: '/studio', sub: more('/studio') },
  { icon: 'image', label: 'Prints', path: '/prints', sub: more('/prints') },
  { icon: 'disc', label: 'Records', path: '/records', sub: more('/records') },
  { icon: 'diamond', label: 'Brand', path: '/brand', sub: more('/brand') },
  { icon: 'layout', label: 'Assets', path: '/assets', sub: more('/assets') },
  { icon: 'bookmark', label: 'Guide', path: '/guide', sub: more('/guide') },
  { icon: 'presentation', label: 'Slide deck', path: '/slides', sub: more('/slides') },
  { icon: 'film-strip', label: 'Media', path: '/media', sub: more('/media') },
  { icon: 'pencil', label: 'Notes', path: '/notes' },
]

const TODOS = [['Small', 'S', 'Rename a card'], ['Medium', 'M', 'Wire the tab shell'], ['Big', 'B', 'Add gcalcli calendar tab']]
const FILTERS = [{ id: 'all', label: 'All tasks', count: 5 }, { id: 'briefs', label: 'Briefs', count: 1 }, { id: 'todos', label: 'Todos', count: 3 }, { id: 'other', label: 'Other', count: 1 }]
const INDEX = [
  ['Design the Tasks tab (Briefs / Todos / Other)', 'Briefs', '—'],
  ['Rename a card', 'Todos', 'S'],
  ['Wire the tab shell', 'Todos', 'M'],
  ['Add gcalcli calendar tab', 'Todos', 'B'],
  ['Rotate the Umami password', 'Other', '—'],
]
/* the index's three columns, measured off the frame (GROUP 776 · SIZE 944 · STATUS 1096 in a 1224 row) */
const COLS = [156, 140, 116]

const Label = ({ children }) => <span className="kol-float-ruler whitespace-pre text-fg-64">{children}</span>

export default function Rails() {
  const [path, setPath] = useState('/dashboard/tasks')
  const [filter, setFilter] = useState('all')
  const [picked, setPicked] = useState(0)

  return (
    <FloatLayout
      nav={NAV} currentPath={path} onNavigate={setPath}
      title="Studio" onSwitch={() => { window.location.href = `${BASE}/` }} onSearch={() => {}}
      breadcrumb={['Dashboard', 'Tasks']} defaultExpanded={['/dashboard']}
      bar={{
        /* the frame's bar is not centred: the capsule 274, the search 407 in */
        start: (
          <>
            <DocumentCapsule name={<>Dashboard<span className="mx-6 text-oq-48">/</span>Tasks</>} className="w-[274px]" />
            <SearchInput variant="float" size="lg" placeholder="Search tasks…" shortcutHint="⌘F" className="ml-[117px] w-96 max-w-full" />
          </>
        ),
        center: null,
        end: <Button variant="float" tone="inverted" size="md" iconLeft="plus">New task</Button>,
      }}
      /* the bottom Rail at the frame's size (9:14486): the filter capsule 16 over the Task index, 44 off the page foot as drawn */
      bottom={(
        <div className="flex flex-col gap-4 pb-5">
          {/* the floating filter capsule, centred over the index */}
          <TabsRow variant="float" surface="solid" size="sm" tabs={FILTERS} value={filter} onChange={setFilter}
            trailing={<Button variant="float" tone="ghost" size="sm">Open only</Button>} className="self-center [&_[role=tab]]:min-w-[132px] [&_[role=tab]]:justify-between" />

          {/* the bottom Rail — the Task index */}
          <Card variant="float" title="Task index" count="5 tasks" value="1 selected">
            <div className="-mx-2 flex flex-col gap-[7px]">
              <div className="flex h-7 items-center gap-3 pl-[44px] pr-2.5">
                <span className="flex-1"><Label>TASK</Label></span>
                {['GROUP', 'SIZE', 'STATUS'].map((h, i) => <span key={h} className="shrink-0" style={{ width: COLS[i] }}><Label>{h}</Label></span>)}
              </div>
              {INDEX.map(([title, group, size], i) => (
                <IndexRow key={title} title={title} selected={i === picked} onClick={() => setPicked(i)} onCheck={() => {}}
                  cells={[{ value: group, width: COLS[0] }, { value: size, mono: true, width: COLS[1] }, { value: 'Open', width: COLS[2] }]} />
              ))}
            </div>
          </Card>
        </div>
      )}
    >
      <div className="flex flex-col">
        {/* the workspace — 664 tall, the canvas 54 in */}
        <section className="flex flex-col gap-8 px-[54px] pt-3">
          <div className="flex items-baseline justify-between pr-8">
            <Breadcrumb items={['DASHBOARD', 'TASKS']} className="kol-float-ruler" />
            <Label>5 tasks  /  3 groups</Label>
          </div>
          <div className="flex flex-col gap-4 bg-[var(--kol-surface-sunken)] px-7 pb-5 pt-6">
            <SectionText variant="float" headline="Tasks, in focus." body="Tasks, projects, links — your living workspace." meta="5 OPEN TASKS" />
            <span className="-mt-5"><Label>BRIEFS  /  NEW DAILY ITEMS</Label></span>
            <SelectionMeasure className="block">
              <TaskCard title="Design the Tasks tab (Briefs / Todos / Other)" group="Brief" date="2026-07-01" selected className="min-h-[106px]" />
            </SelectionMeasure>
            <span><Label>TODOS  /  SMALL · MEDIUM · BIG</Label></span>
            <div className="grid grid-cols-3 gap-3.5">
              {TODOS.map(([size, chip, title]) => (
                <Card key={size} variant="float" title={size} controls={<SizeChip>{chip}</SizeChip>}>
                  <TaskCard size="sm" title={title} />
                </Card>
              ))}
            </div>
            <span className="pt-3"><Label>OTHER  /  MISCELLANEOUS</Label></span>
            <Card variant="float" title="Rotate the Umami password" value="Other" />
          </div>
        </section>

      </div>
    </FloatLayout>
  )
}
