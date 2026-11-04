import { useState } from 'react'
import { Badge, Button, CalendarDay, CalendarMonth, CalendarTimeline, CalendarWeek, EmptyState, InlineAddRow, LinkAddRow, NoticeBanner, SectionText, TabsRow } from '@kolkrabbi/kol-component'
import { FooterStrip } from '@kolkrabbi/kol-shell'
import { CaptureCard, Card, KanbanColumn, LineChart, LinkCard, ProjectCard, RankedList, SourceCard, StatTiles, TaskCard } from '@kolkrabbi/kol-dashboards'

/* The record dashboard, navigated by tabs — kol-float--style 13:5037 (nine 1440 frames: Tasks · Capture · Projects ·
 * Calendar timeline / month / week / day · Metrics · Links), plan-2026-11-04-float-views W3.2. Layout, not function.
 * `bare`: the frame is the whole screen — its own masthead and tab capsule, no app rail, no inspector. The frame's
 * 1328 column is kept at every width (centred), so its boxes land where they are drawn. Text and numbers as drawn. */
export const bare = true

const noop = () => {}

const TABS = [
  { id: 'tasks', label: 'Tasks', icon: 'checklist', count: 5, action: 'New task' },
  { id: 'capture', label: 'Capture', icon: 'inbox', count: 3, action: 'New capture' },
  { id: 'projects', label: 'Projects', icon: 'folder', action: 'New project' },
  { id: 'calendar', label: 'Calendar', icon: 'calendar', action: 'New event' },
  { id: 'metrics', label: 'Metrics', icon: 'bar-chart', action: 'Open Umami', plain: true },
  { id: 'links', label: 'Links', icon: 'link', action: 'New link' },
]

/* the tab's own heading: title + line at the left, its control at the right, the body starting at the frame's y */
function Head({ title, body, top, children }) {
  return (
    <div className="flex items-start justify-between gap-6" style={{ height: top }}>
      <SectionText variant="float" headline={title} body={body} headlineAs="h2" headlineClass="kol-float-section" gap="gap-1" style={{ marginBottom: 0 }} />
      {children}
    </div>
  )
}

/* a group's label: name · count · what it holds (`Briefs 1 New daily items`) */
function Group({ title, count, hint }) {
  return (
    <div className="flex items-center gap-3 h-6 mb-4">
      <span className="kol-float-window text-fg-96">{title}</span>
      <Badge variant="float">{count}</Badge>
      <span className="kol-float-hint text-fg-64 ml-2">{hint}</span>
    </div>
  )
}

/* a sheet holding rows with no head of its own (Briefs, Other) — the float sheet's ground and round */
const sheet = 'bg-surface-secondary rounded-[var(--kol-float-menu-r)] flex flex-col gap-3 px-1 pb-6'

function Tasks() {
  const [status, setStatus] = useState('open')
  return (
    <>
      <Head title="Tasks" body="A little structure. A clearer day." top={89}>
        <TabsRow variant="float" surface="solid" size="sm" value={status} onChange={setStatus} ariaLabel="Task status"
          tabs={[{ id: 'open', label: 'Open', count: 5 }, { id: 'completed', label: 'Completed' }]} />
      </Head>
      <Group title="Briefs" count={1} hint="New daily items" />
      <div className={`${sheet} h-[144px]`}>
        <TaskCard title="Design the Tasks tab (Briefs / Todos / Other)" date="2026-07-01" onToggle={noop} />
        <div className="px-5"><InlineAddRow variant="float" label="New brief" onAdd={noop} /></div>
      </div>
      <div className="mt-8"><Group title="Todos" count={3} hint="Small · Medium · Big" /></div>
      <div className="grid grid-cols-3 gap-4">
        {[['Small', 'Rename a card', 'S'], ['Medium', 'Wire the tab shell', 'M'], ['Big', 'Add gcalcli calendar tab', 'B']].map(([size, task, chip]) => (
          <Card key={size} variant="float" title={size} count="1 open" addLabel={`Add ${size.toLowerCase()}`} onAdd={noop} className="h-[192px]">
            <TaskCard size="sm" title={task} chip={chip} onToggle={noop} />
          </Card>
        ))}
      </div>
      <div className="mt-8"><Group title="Other" count={1} hint="Miscellaneous" /></div>
      <div className={`${sheet} h-[112px] pt-0`}>
        <TaskCard title="Rotate the Umami password" onToggle={noop} className="!py-4" />
        <div className="px-5"><InlineAddRow variant="float" label="Add misc" onAdd={noop} /></div>
      </div>
    </>
  )
}

function Capture() {
  const failed = (name, what) => (
    <SourceCard code={`#KOL-${name === 'Obsidian' ? 'OB' : 'CAL'}`} title={name} status="Needs attention" message={`Unable to load ${what}.`}
      detail="The source returned an unexpected response (JSON parse error)." action="Retry" onAction={noop} className="h-[260px]" />
  )
  return (
    <>
      <Head title="Capture" body="Collect in one place. Move ideas forward." top={94}>
        <Button variant="float" tone="primary" size="sm" onClick={noop} className="mt-1">Refresh sources</Button>
      </Head>
      <div className="grid grid-cols-[312px_1fr_312px] gap-4">
        {failed('Obsidian', 'captures')}
        <SourceCard code="#KOL-TD" title="Todoist" meta="4 items" className="h-[260px]">
          {['moble consumer labs fullscreen randomise controls', 'tuxedo cli task mgmt',
            'GitHub · Sin-cy/dotfiles: The never ending updates of my dotfiles config https://github.com/Sin-cy/dotfiles', 'documentary',
          ].map((t) => <TaskCard key={t} size="sm" title={t} onToggle={noop} />)}
        </SourceCard>
        {failed('Calendar', 'events')}
      </div>
      <div className="mt-10 mb-6">
        <SectionText variant="float" headline="Board" headlineAs="h3" headlineClass="kol-float-window" body="Drag captures between stages · use arrows to move · archive when done" gap="gap-1" style={{ marginBottom: 0 }} />
      </div>
      <div className="grid grid-cols-4 gap-4 h-[342px]">
        <KanbanColumn title="Lobby" count={1}>
          {/* ponytail: the drawn screenshot isn't shipped with the app — the 5:3 frame shows its well */}
          <CaptureCard image={<span />} title="#kol-ob bingo" meta="124d" onNext={noop} />
        </KanbanColumn>
        <KanbanColumn title="Backlog" count={1}>
          <CaptureCard title="social media command center" meta="TODOIST  ·  124d" onPrev={noop} onNext={noop} />
        </KanbanColumn>
        <KanbanColumn title="Working" count={0}>
          <EmptyState variant="float" title="Ready for your next idea" body="Move a capture here to begin." className="px-4 pt-16" />
        </KanbanColumn>
        <KanbanColumn title="Done" count={1}>
          <CaptureCard title="dashboard" meta="TODOIST" onPrev={noop} action="Archive" onAction={noop} />
        </KanbanColumn>
      </div>
      <Card variant="float" title="Archive" count={2} className="mt-6">
        <div className="flex gap-16 kol-float-body text-fg-64"><span>buy milk</span><span>call dentist</span></div>
      </Card>
    </>
  )
}

function Projects() {
  const [scope, setScope] = useState('active')
  return (
    <>
      <Head title="Projects" body="The work in motion, with progress at a glance." top={100}>
        <TabsRow variant="float" surface="solid" size="sm" value={scope} onChange={setScope} ariaLabel="Project status"
          tabs={[{ id: 'active', label: 'Active', count: 2 }, { id: 'all', label: 'All projects' }]} />
      </Head>
      <div className="grid grid-cols-2 gap-4">
        <ProjectCard eyebrow="REPO" status="Active" title="kol-studio" description="Local-only studio dashboard. Home of this board."
          progress={{ label: 'Completion', pct: 50, note: '1 / 2 done' }} action="Details" onAction={noop} className="h-[386px]" />
        <ProjectCard eyebrow="PROJECT" status="Active" title="Studio Dashboard" description="Living helper: tasks, progress, status, projects, links. Rebuilt fresh, vault plugin as reference."
          progress={{ label: 'Completion', pct: 0, note: '0 / 3 done' }} action="Details" onAction={noop} className="h-[386px]" />
      </div>
      <h3 className="kol-float-window text-fg-96 mt-12 mb-4">Linked resources</h3>
      <LinkAddRow variant="float" title="kol-vault" href="#" onAdd={noop} />
    </>
  )
}

const VIEWS_CAL = [{ id: 'timeline', label: 'Timeline' }, { id: 'month', label: 'Month' }, { id: 'week', label: 'Week' }, { id: 'day', label: 'Day' }]
const RANGE = { timeline: '1 Jan – 31 Dec 2026', month: 'November 2026', week: '2 – 8 November 2026 · Week 45', day: 'Tuesday, 3 November 2026' }
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const last = (m) => new Date(2026, m + 1, 0).getDate()
const PHASES = [{ label: '2026', start: '2026-01-01', end: '2026-12-31', emphasis: true },
  ...MONTHS.map((label, m) => ({ label, start: `2026-${String(m + 1).padStart(2, '0')}-01`, end: `2026-${String(m + 1).padStart(2, '0')}-${last(m)}` }))]
const TODAY = '2026-11-03'

function Calendar({ view, setView }) {
  return (
    <>
      <Head title="Calendar" body="A little perspective on what’s ahead." top={84} />
      <NoticeBanner title="Calendar needs attention" body="Unexpected response from gcalcli. Authenticate on this machine to sync events." action="Reconnect" onAction={noop} className="h-14" />
      <InlineAddRow variant="float" label="Quick add — e.g. “Lunch with Ada Friday 12pm”" onAdd={noop} className="mt-[18px]" />
      <div className="flex items-center gap-4 mt-[30px]">
        <TabsRow variant="float" surface="solid" size="sm" value={view} onChange={setView} tabs={VIEWS_CAL} ariaLabel="Calendar view" />
        <Button variant="float" tone="primary" size="md" iconOnly="chevron-left" aria-label="Previous period" onClick={noop} className="ml-3" />
        <span className="kol-float-body text-fg-96 flex-1 ml-2">{RANGE[view]}</span>
        <Button variant="float" tone="primary" size="md" iconOnly="chevron-right" aria-label="Next period" onClick={noop} />
        <Button variant="float" tone="primary" size="md" onClick={noop} className="w-[112px] -ml-1">Today</Button>
      </div>
      <p className="kol-float-label text-fg-64 whitespace-pre mt-[22px] mb-[18px]">▬ 2026     ◆ Checkpoint     ○ To confirm     ▪ Break     | Today</p>
      <div className="h-[400px] [&>*]:h-full">
        {view === 'timeline' && <CalendarTimeline year={2026} rows={PHASES} today={TODAY} />}
        {view === 'month' && <CalendarMonth month="2026-11" today={TODAY}
          events={[{ start: '2026-10-01', end: '2026-10-31', label: 'October' }, { start: '2026-11-01', end: '2026-11-30', label: 'November' }, { start: '2026-12-01', end: '2026-12-31', label: 'December' }]} />}
        {view === 'week' && <CalendarWeek week={TODAY} today={TODAY} empty="No timed events shown while calendar sync needs attention."
          running={[{ label: 'November', meta: 'Day 1 of 21', range: '1 – 30 Nov' }]} runningLabel="RUNNING THIS WEEK" />}
        {view === 'day' && <CalendarDay allDay={[{ label: 'November' }]} from={7} to={19} now="17:00" />}
      </div>
    </>
  )
}

/* the traffic as drawn: thirty days, the stat sparklines and the trend */
const TREND = [30, 32, 35, 34, 34, 31, 28, 33, 36, 31, 51, 44, 48, 62, 44, 37, 38, 47, 48, 65, 46, 40, 39, 41, 41, 43, 48, 50, 37, 60]
const SPARK_A = [8, 9, 9, 8, 10, 7, 9, 14, 11, 15, 8, 9, 12, 16, 10, 9, 9, 10, 9, 14]
const SPARK_B = [12, 14, 11, 14, 12, 13, 10, 12, 11, 10, 12, 11, 13, 11, 12, 16, 10, 9, 12, 12]

function Metrics() {
  const [range, setRange] = useState('30d')
  return (
    <>
      <Head title="Metrics" body="A clear view of your studio’s traffic." top={100}>
        <TabsRow variant="float" surface="solid" size="sm" value={range} onChange={setRange} ariaLabel="Date range"
          tabs={[{ id: '7d', label: '7d' }, { id: '30d', label: '30d' }, { id: '90d', label: '90d' }]} />
      </Head>
      <StatTiles variant="float" size="lg" columns="grid-cols-3 gap-4"
        items={[{ label: 'Pageviews', value: '1,036', note: 'Last 30 days', spark: SPARK_A }, { label: 'Visitors', value: '137', note: 'Last 30 days', spark: SPARK_B }, { label: 'Visits', value: '282', note: 'Last 30 days' }]} />
      <Card variant="float" title="Pageviews" meta="Last 30 days" value="1,036" className="mt-[29px]">
        <LineChart variant="float" data={TREND.map((y) => ({ y }))} height={130} rules={4} xLabels={['30 days ago', 'Today']} />
      </Card>
      <div className="grid grid-cols-2 gap-4 mt-7">
        <Card variant="float" title="Top pages" meta="By pageviews"><RankedList variant="float" rows={[{ label: '/', value: 104 }]} column="" valueLabel="" /></Card>
        <Card variant="float" title="Referrers" meta="Traffic sources"><RankedList variant="float" rows={[{ label: 'facebook.com', value: 4 }]} column="" valueLabel="" /></Card>
      </div>
    </>
  )
}

const SITES = [['kolkrabbi.io', 'Studio site'], ['Type foundry', 'kolkrabbi.io/foundry'], ['GitHub', 'github.com/Tor-Grimsson']]
const SOCIALS = [['Instagram · @kolkrabbi_', 'www.instagram.com/kolkrabbi_'], ['Instagram · @tortor', 'www.instagram.com/tortor'],
  ['YouTube · @kolkrabbi-io', 'www.youtube.com/@kolkrabbi-io'], ['TikTok · @kolkrabbi_', 'www.tiktok.com/@kolkrabbi_'],
  ['GitHub · Tor-Grimsson', 'github.com/Tor-Grimsson'], ['Behance · grimsson', 'www.behance.net/grimsson'],
  ['Bandcamp · konsulata', 'konsulata.bandcamp.com'], ['Bandcamp · twostephorror', 'twostephorror.bandcamp.com']]
const links = (rows) => <div className="flex flex-col gap-2">{rows.map(([t, m]) => <LinkCard key={t} title={t} meta={m} href="#" />)}</div>

function Links() {
  const [open, setOpen] = useState({})
  const fold = (k) => () => setOpen((o) => ({ ...o, [k]: !o[k] }))
  return (
    <>
      <Head title="Links" body="Sites, socials, profiles, and the services that run the studio." top={100} />
      <div className="grid grid-cols-[432px_1fr] gap-4 items-start">
        <div className="flex flex-col gap-4">
          <Card variant="float" title="Sites" count={3} className="h-[300px]">{links(SITES)}</Card>
          <Card variant="float" title="Profiles" className="mt-2" folded={!open.profiles} onFold={fold('profiles')} />
          <Card variant="float" title="Services & infra" folded={!open.services} onFold={fold('services')} />
        </div>
        <Card variant="float" title="Socials" count={8} className="h-[664px]">{links(SOCIALS)}</Card>
      </div>
    </>
  )
}

const FOOT = {
  tasks: ['5 open tasks', 'Briefs  /  Todos  /  Other'],
  capture: ['3 captures  /  2 archived'],
  projects: ['2 active projects'],
  calendar: (v) => [`${VIEWS_CAL.find((x) => x.id === v).label} view  /  2026`, 'Calendar sync requires authentication'],
  metrics: ['Source: Umami  /  Last 30 days'],
  links: ['Sites  /  Socials  /  Profiles  /  Services & infra'],
}

export default function RecordTabs() {
  const [tab, setTab] = useState('tasks')
  const [calView, setCalView] = useState('timeline')
  const current = TABS.find((t) => t.id === tab)
  const foot = typeof FOOT[tab] === 'function' ? FOOT[tab](calView) : FOOT[tab]
  return (
    <div className="min-h-screen bg-surface-primary flex flex-col px-4">
      <div className="w-full max-w-[1328px] mx-auto flex flex-col flex-1 pt-11">
        <SectionText variant="float" eyebrow="STUDIO  /  WORKSPACE" headline="Dashboard" body="Tasks, projects, links — your living workspace." style={{ marginBottom: 34 }} />
        <div className="flex flex-wrap items-center gap-[18px] mb-10">
          <TabsRow variant="float" surface="solid" size="lg" value={tab} onChange={setTab} ariaLabel="Dashboard" tabs={TABS.map(({ id, label, icon, count }) => ({ id, label, icon, count }))} />
          <Button variant="float" tone="primary" size="lg" iconOnly="search" aria-label="Search" onClick={noop} />
          <Button variant="float" tone="inverted" size="lg" iconLeft={current.plain ? undefined : 'plus'} onClick={noop} className="ml-auto">{current.action}</Button>
        </div>
        <main className="flex flex-col">
          {tab === 'tasks' && <Tasks />}
          {tab === 'capture' && <Capture />}
          {tab === 'projects' && <Projects />}
          {tab === 'calendar' && <Calendar view={calView} setView={setCalView} />}
          {tab === 'metrics' && <Metrics />}
          {tab === 'links' && <Links />}
        </main>
        <FooterStrip start={foot[0]} end={foot[1]} className="mt-auto pt-11 pb-8" />
      </div>
    </div>
  )
}
