import { useState } from 'react'
import { Avatar, Badge, Button, Delta, Divider, Dropdown, MenuDatePicker, NavRail, SectionText, Table, TabsRow } from '@kolkrabbi/kol-component'
import { AccountFooter, Breadcrumb, DataStatus, FooterStrip, StatusStrip } from '@kolkrabbi/kol-shell'
import { Card, LineChart, LiveCard, ProportionBar, StatTiles, WeeklyBars } from '@kolkrabbi/kol-dashboards'

/* Metrics (plan-2026-11-04-float-views W3.7 — kol-float--style 13:6898, the dark frame 9:1550). Layout, not function:
 * the exploration's words and numbers as drawn, every part a shipped float part.
 * `bare` — the frame is the whole screen with its own workspace Rail (216 wide), so the view brings its own chrome
 * instead of FloatLayout's 280 nav + top bar + inspector (which would leave the 1320 content column 270 short). */
export const bare = true

/* ── fixture data, as drawn ─────────────────────────────────────────────────────────────────────────────────────── */
const NAV = [
  { heading: 'OBSERVE' },
  { icon: 'layout', label: 'Overview', path: '/overview' },
  { icon: 'globe', label: 'Website', path: '/website' },
  { icon: 'atomic-molecule-03', label: 'Repositories', path: '/repositories', count: '04' },
  { icon: 'pointer', label: 'Events', path: '/events' },
  { icon: 'radial-hex', label: 'Realtime', path: '/realtime', count: '08' },
  { heading: 'MANAGE' },
  { icon: 'align-vertical-bottom', label: 'Reports', path: '/reports' },
  { icon: 'nav-settings', label: 'Settings', path: '/settings' },
]

const day = (i) => `${String(i + 1).padStart(2, '0')} Oct`
const THIS = [300, 330, 310, 400, 390, 280, 260, 360, 400, 420, 380, 430, 300, 300, 460, 480, 520, 910, 680, 540, 420, 390, 510, 560, 600, 630, 440, 800]
const PREV = [220, 260, 280, 300, 320, 240, 190, 290, 330, 330, 350, 400, 240, 250, 400, 420, 450, 700, 500, 440, 380, 300, 410, 480, 470, 520, 420, 640]
const SERIES = [
  { data: THIS.map((y, i) => ({ x: day(i), y })), fill: true },
  { data: PREV.map((y, i) => ({ x: day(i), y })), dashed: true },
]

const TRAFFIC = [
  { label: 'Unique visitors', value: '12,864', delta: <Delta value="19.8%" from="10,740" />, spark: [5, 6, 5, 7, 6, 8, 7, 9] },
  { label: 'Page views', value: '18,420', delta: <Delta value="16.4%" from="15,825" />, spark: [5, 6, 6, 7, 6, 8, 8, 9] },
  { label: 'Bounce rate', value: '42.8%', delta: <Delta value="3.2 pp" direction="down" from="46.0%" />, spark: [9, 8, 9, 7, 7, 6, 7, 5] },
  { label: 'Avg. visit duration', value: '1m 48s', delta: <Delta value="12.5%" from="1m 36s" />, spark: [5, 5, 6, 7, 6, 7, 8, 9] },
]

const REPO_TILES = [
  { label: 'Repository views', value: '6,180', note: '15–28 OCT · 14 DAYS' },
  { label: 'Git clones', value: '742', note: '15–28 OCT · 14 DAYS' },
  { label: 'Stars gained', value: '+54', note: '01–28 OCT · 28 DAYS' },
  { label: 'Commits pushed', value: '87', note: '01–28 OCT · 28 DAYS' },
]

const num = (accessor, header) => ({ accessor, header, align: 'right' })
const SOURCES = {
  columns: [{ accessor: 'name', header: 'Referrer' }, num('visitors', 'Visitors'), num('share', 'Share')],
  rows: [
    { name: 'Direct / none', visitors: '5,280', share: '41.0%' },
    { name: 'Google', visitors: '3,410', share: '26.5%' },
    { name: 'github.com', visitors: '2,136', share: '16.6%' },
    { name: 'Are.na', visitors: '1,158', share: '9.0%' },
    { name: 'Other sources', visitors: '880', share: '6.8%' },
  ],
}
const PAGES = {
  columns: [{ accessor: 'name', header: 'Page' }, num('views', 'Views'), num('bounce', 'Bounce')],
  rows: [
    { name: '/ · Home', views: '6,840', bounce: '38.2%' },
    { name: '/work · Selected work', views: '4,128', bounce: '31.6%' },
    { name: '/toolbox · Tools & experiments', views: '3,264', bounce: '48.1%' },
    { name: '/writing · Notes & essays', views: '2,196', bounce: '52.4%' },
    { name: '/about · About', views: '1,992', bounce: '51.8%' },
  ],
}
const GEO = {
  columns: [{ accessor: 'name', header: 'Country' }, num('visitors', 'Visitors'), num('share', 'Share')],
  rows: [
    { name: 'United States', visitors: '3,859', share: '30.0%' },
    { name: 'Germany', visitors: '1,801', share: '14.0%' },
    { name: 'United Kingdom', visitors: '1,415', share: '11.0%' },
    { name: 'Iceland', visitors: '772', share: '6.0%' },
    { name: 'Other countries', visitors: '5,017', share: '39.0%' },
  ],
}
const split = (rows) => ({
  columns: [{ accessor: 'name', header: 'Visitors' }, num('count', 'Count'), num('share', 'Share')],
  rows,
  segments: rows.map((r) => ({ label: r.name, value: parseFloat(r.share) })),
})
const DEVICES = split([
  { name: 'Desktop', count: '9,005', share: '70%' },
  { name: 'Mobile', count: '3,473', share: '27%' },
  { name: 'Tablet', count: '386', share: '3%' },
])
const BROWSERS = split([
  { name: 'Chrome', count: '7,076', share: '55%' },
  { name: 'Safari', count: '3,087', share: '24%' },
  { name: 'Firefox', count: '1,801', share: '14%' },
  { name: 'Other', count: '900', share: '7%' },
])
const REPOS = {
  columns: [{ accessor: 'name', header: 'Repository' }, num('views', 'Views · 14D'), num('clones', 'Clones · 14D'), num('stars', 'Stars · 28D'), num('commits', 'Commits · 28D')],
  rows: [
    { name: 'kolkrabbi.io · Personal website · TypeScript', views: '2,880', clones: '328', stars: '+24', commits: '31' },
    { name: 'toolbox · Creative utilities · TypeScript', views: '1,620', clones: '214', stars: '+16', commits: '26' },
    { name: 'type-lab · Typography experiments · JavaScript', views: '1,040', clones: '132', stars: '+9', commits: '18' },
    { name: 'dotfiles · Development environment · Shell', views: '640', clones: '68', stars: '+5', commits: '12' },
  ],
}
const WEEKS = [
  { label: '01–07', count: 13 },
  { label: '08–14', count: 19 },
  { label: '15–21', count: 24 },
  { label: '22–28', count: 31, current: true },
]

/* ── layout glue ────────────────────────────────────────────────────────────────────────────────────────────────── */
const heading = (headline, meta) => <SectionText variant="float" headline={headline} headlineAs="h2" headlineClass="kol-float-window" meta={meta} style={{ marginBottom: 0 }} />
const foot = (words, label) => (
  <div className="mt-auto flex items-center justify-between gap-4 pt-4">
    <span className="kol-float-hint text-fg-64">{words}</span>
    <Button variant="float" tone="ghost" size="sm" iconRight="arrow-upright">{label}</Button>
  </div>
)
const table = (t) => <Table variant="float" width="column" columns={t.columns} rows={t.rows} />

export default function Metrics() {
  const [view, setView] = useState('overview')
  const [metric, setMetric] = useState('visitors')
  const [range, setRange] = useState('28d')

  return (
    <div className="flex h-dvh overflow-hidden bg-surface-primary">
      {/* the workspace Rail: the float NavRail at the frame's 216 */}
      <div className="w-[216px] shrink-0 p-3 [&>nav]:w-full">
        <NavRail variant="float" items={NAV} currentPath="/overview"
          switcher={(
            <div className="flex flex-col gap-6 px-1 pt-2 pb-4">
              <span className="flex items-center gap-2.5">
                <Avatar initial="k" size="sm" />
                <span className="kol-float-window text-fg-96">kolkrabbi</span>
              </span>
              <span className="flex flex-col gap-2">
                <span className="kol-float-ruler text-fg-64">WORKSPACE</span>
                <Dropdown variant="float" size="sm" className="w-full" options={[{ value: 'personal', label: 'Personal / Kolkrabbi' }]} value="personal" onChange={() => {}} />
              </span>
            </div>
          )}
          footer={(
            <div className="flex flex-col items-start gap-4 px-2.5 pb-2">
              <Divider className="w-full" />
              <StatusStrip label="ALL SYSTEMS OBSERVING" />
              <AccountFooter name="Kolkrabbi" workspace="Personal workspace" initial="K" />
            </div>
          )} />
      </div>

      {/* the analytics workspace: 32 in, the 1320 column, 24 between sections */}
      <main className="min-w-0 flex-1 overflow-y-auto">
        <div className="flex flex-col gap-6 p-8">
          <header className="flex flex-col gap-6">
            <div className="flex items-center justify-between gap-4">
              <Breadcrumb items={['Workspace', 'Analytics', 'Overview']} />
              <DataStatus badge="Demo data" updated="UPDATED 14:32 UTC" />
            </div>
            <SectionText variant="float" headline="A pulse on your corner of the web." body="Website visitors and open-source activity. One considered view."
              actions={<Button variant="float" tone="inverted" size="md" iconLeft="download">Export report</Button>} style={{ marginBottom: 0 }} />
            <TabsRow variant="float" type="mono" value={view} onChange={setView}
              tabs={[{ id: 'overview', label: 'Overview' }, { id: 'website', label: 'Website' }, { id: 'repositories', label: 'Repositories' }, { id: 'audience', label: 'Audience' }]} />
            <div className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-2">
                <Dropdown variant="float" size="md" options={[{ value: 'site', label: 'kolkrabbi.io' }]} value="site" onChange={() => {}} />
                <Dropdown variant="float" size="md" options={[{ value: 'all', label: '4 repositories' }]} value="all" onChange={() => {}} />
                <span className="kol-float-hint text-fg-64 pl-2">All traffic · No filters</span>
              </span>
              <span className="flex items-center gap-3">
                <span className="kol-float-hint text-fg-64">vs. previous 28 days</span>
                <MenuDatePicker variant="float" label="01–28 Oct 2026" value={range} onChange={setRange}
                  groups={[[{ key: '7d', label: 'Last 7 days' }, { key: '28d', label: 'Last 28 days' }, { key: '90d', label: 'Last 90 days' }]]} />
                <Badge variant="secondary" size="sm">Last 28 days</Badge>
              </span>
            </div>
            <Divider />
          </header>

          <section className="flex flex-col gap-4">
            {heading('Website traffic', 'kolkrabbi.io · Umami')}
            <StatTiles variant="float" size="lg" columns="grid-cols-4" items={TRAFFIC} />
            <div className="grid grid-cols-[1fr_284px] gap-4">
              <div className="min-w-0 rounded-[var(--kol-float-menu-r)] bg-surface-secondary p-4">
                <LineChart variant="float" series={SERIES} height={210} peak={17}
                  tabs={[{ key: 'visitors', label: 'Visitors' }, { key: 'views', label: 'Page views' }]} tab={metric} onTab={setMetric}
                  legend={[{ label: 'This period' }, { label: 'Previous period', dashed: true }]} interval="DAILY"
                  yLabels={['0', '250', '500', '750', '1,000']} xLabels={['01 Oct', '05 Oct', '09 Oct', '13 Oct', '17 Oct', '21 Oct', '25 Oct', '28 Oct']} />
              </div>
              <LiveCard label="Right now" value="8" unit="active visitors" peak="18 OCT · TRAFFIC PEAK"
                insight="910 visitors after the toolbox release." note="2.0× the daily average of 459 visitors." />
            </div>
          </section>

          <section className="grid grid-cols-2 gap-4">
            <Card variant="float" title="Where visitors arrive from">
              {table(SOURCES)}
              {foot('First-touch attribution · Direct includes untagged visits', 'Sources')}
            </Card>
            <Card variant="float" title="What gets explored">
              {table(PAGES)}
              {foot('18,420 total views · Query strings excluded', 'All pages')}
            </Card>
          </section>

          <section className="flex flex-col gap-4">
            {heading('Audience signals', 'Unique visitors · Website only')}
            <div className="grid grid-cols-3 gap-4">
              <Card variant="float" title="Geography" value="64 COUNTRIES">{table(GEO)}</Card>
              {[['Devices', DEVICES], ['Browsers', BROWSERS]].map(([title, t]) => (
                <Card key={title} variant="float" title={title}>
                  <ProportionBar segments={t.segments} className="mb-2" />
                  {table(t)}
                </Card>
              ))}
            </div>
          </section>

          <section className="flex flex-col gap-4">
            {heading('In the repositories', 'GitHub · 4 public repositories')}
            <StatTiles variant="float" size="sm" columns="grid-cols-4" items={REPO_TILES} />
            <div className="grid grid-cols-[952px_1fr] gap-4">
              <Table variant="float" width="column" framed columns={REPOS.columns} rows={REPOS.rows} />
              <Card variant="float" title="Shipping rhythm" value="COMMITS">
                <WeeklyBars weeks={WEEKS} height={70} className="mt-auto" />
                <p className="kol-float-hint text-fg-64 pt-4">31 commits this week. A little more shipped, a little less left in drafts.</p>
              </Card>
            </div>
            <p className="kol-float-hint text-fg-64">Repository views and clones use GitHub’s 14-day window; stars and commits follow the selected 28 days. Repository views are not website page views.</p>
            <Divider />
            <FooterStrip start="KOLKRABBI / METRICS — PERSONAL OBSERVATORY" end="Illustrative data · UTC · Privacy-friendly, cookie-free analytics" />
          </section>
        </div>
      </main>
    </div>
  )
}
