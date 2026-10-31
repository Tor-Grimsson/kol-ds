/* /demo-9 (plan 2026-10-30-metric-style, 11.4, 12.2): what the live page (src/MetricsDashboard.jsx) has that /demo-8 did
 * not — its section switcher's Project · Infrastructure · Sessions (the live tabs themselves, imported), the Site cards
 * /demo-7 never rebuilt, the deploy line, and the weekday × hour visitors grid. The live page's data hook feeds them;
 * nothing here changes the live page. Helpers and DeployBar are copied from it (not exported there). */
import {
  DashChartCard, DashListCard, DashFeaturedCard, DashMetricCard, LineChart, DonutChart, Sparkline,
  DEPLOY_STATE_COLORS, DEPLOY_STATE_LABELS, PALETTE, MILESTONE_COLORS, timeAgo,
} from '@kolkrabbi/kol-dashboards'
import { ProjectTab, InfraTab, SessionsTab } from '../MetricsDashboard.jsx'
import { createContext, useContext, useEffect, useRef, useState } from 'react'
import useMetricsData from '../useMetricsData.js'
import { Heatmap } from '@kolkrabbi/kol-dashboards'
import { ResizeHandle } from '@kolkrabbi/kol-component'
import { Card } from './Report.jsx'
import { useTen } from './nine.js'
import { MILESTONES } from '../milestones.js'
import { umami, useAsync, filterParams, TZ } from './data.js'

export const SECTIONS = [
  { value: 'site', label: 'Site' },
  { value: 'project', label: 'Project' },
  { value: 'infra', label: 'Infrastructure' },
  { value: 'sessions', label: 'Sessions' },
]

export const dailyToSeries = (visits) => [
  { data: visits.map(d => ({ y: d.win })), color: 'var(--kol-palette-green)', fill: true },
  { data: visits.map(d => ({ y: d.draw })), color: 'var(--kol-palette-blue)', fill: true },
  { data: visits.map(d => ({ y: d.loss })), color: 'var(--kol-palette-red)', fill: true },
]

const devicesToSegments = (devices) =>
  devices.map((d, i) => ({ value: d.count, label: d.range, color: PALETTE[i % PALETTE.length] }))

const DeployBar = ({ deploys, milestones = [] }) => {
  if (!deploys || deploys.length === 0) return null

  const latest = deploys[0]
  const color = DEPLOY_STATE_COLORS[latest.state] || 'var(--kol-palette-blue)'
  const label = DEPLOY_STATE_LABELS[latest.state] || latest.state

  /* TWO BLOCKS ON ONE ROW (user 2026-10-10): the deploy status and the milestone ticker each keep
   * their own underline, a vertical rule between them — sharing one underline read as one thing. */
  return (
    <div className="flex items-stretch gap-6 kol-helper-12">
      {/* the left half holds the status; its underline runs only as far as the status does */}
      <div className="flex flex-1 basis-0 min-w-0">
      <div className="flex items-center gap-3 py-1 border-b border-fg-08 min-w-0">
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: color }} />
          <span style={{ color }}>{label}</span>
          <span className="text-fg-48">{timeAgo(latest.created)}</span>
          {latest.duration && <span className="text-fg-32 hidden md:inline">{latest.duration}s build</span>}
        </div>

        <span className="text-fg-24">|</span>
        <span className="text-fg-48 truncate">{latest.source}</span>
        <span className="text-fg-24">|</span>

        <div className="flex items-center gap-1 shrink-0">
          {deploys.slice(0, 8).map((d, i) => (
            <span
              key={d.id || i}
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: DEPLOY_STATE_COLORS[d.state] || 'var(--kol-palette-blue)' }}
              title={`${d.source} — ${d.state} ${timeAgo(d.created)}`}
            />
          ))}
        </div>
      </div>
      </div>

      {milestones.length > 0 && (
        <>
          {/* RUNS OFF THE RIGHT EDGE (user 2026-10-10): the underline stops at the cards' edge, the
            * scroller inside reaches through the page's md:p-6 to the window — clipped on its left,
            * open on its right */}
          <div className="hidden md:flex flex-1 basis-0 min-w-0 border-b border-fg-08">
          <div className="flex flex-1 min-w-0 -mr-6 items-center gap-4 py-1 text-fg-48 overflow-x-auto scrollbar-none">
            {milestones.slice(0, 6).map((m, i) => (
              <span key={i} className="flex items-center gap-1.5 whitespace-nowrap shrink-0">
                <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: MILESTONE_COLORS[m.type] }} />
                <span className="text-fg-32">{m.date.slice(5)}</span>
                <span>{m.text}</span>
              </span>
            ))}
          </div>
          </div>
        </>
      )}
    </div>
  )
}

/* the live hook, at the live page's 30 days.
 * ponytail: its range is its own (30d), not the date picker's — wire setRange to the picker if they must move together */
export function useLive() {
  return useMetricsData({ mainHost: 'kolkrabbi.io' })
}

export const DeployLine = ({ live }) => <DeployBar deploys={live.deploys} milestones={MILESTONES} />

/* Project · Infrastructure · Sessions — the live page's own tabs */
export function LiveSection({ section, live }) {
  return (
    <div style={{ containerType: 'inline-size' }}>
      {section === 'project' && <ProjectTab data={live.projectData} sanity={live.sanityData} />}
      {section === 'infra' && <InfraTab deploys={live.deploys} b2={live.b2Data} />}
      {section === 'sessions' && <SessionsTab data={live.projectData} />}
    </div>
  )
}

/* 12.2 — visitors by weekday × hour, Reykjavik time (Umami's /sessions/weekly), as the design canvas drew it */
export function WeekdayGrid({ period, filters }) {
  const ten = useTen()
  const weekly = useAsync(() => umami('/sessions/weekly', { startAt: period.start, endAt: period.end, timezone: TZ, ...filterParams(filters) }), JSON.stringify([period, filters]))
  const grid = Array.isArray(weekly.data)
    ? <Heatmap data={weekly.data} rows={['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']} cols={Array.from({ length: 24 }, (_, i) => `${i}h`)} colTick={3} variant="dots" cellSize={16} />
    : <div className="kol-helper-12 text-fg-48 py-16 text-center">Loading…</div>
  /* /demo-10 (13.8): the page's one card header — the title as a tab on the rule, the note at its right */
  if (ten) return <OneCard title="Visitors" note="weekday × hour · Reykjavik time · bigger dot, more visitors"><div className="pt-4">{grid}</div></OneCard>
  return (
    <DashChartCard className="h-full" title="Visitors" currentValue="weekday × hour · Reykjavik time · bigger dot, more visitors">
      {Array.isArray(weekly.data)
        ? <Heatmap data={weekly.data} rows={['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']} cols={Array.from({ length: 24 }, (_, i) => (i % 3 === 0 ? `${i}h` : ''))} variant="dots" cellSize={16} />
        : <div className="kol-helper-12 text-fg-48 py-16 text-center">Loading…</div>}
    </DashChartCard>
  )
}

/* the live Site tab's cards /demo-7 has no counterpart for: Site Traffic, Visit breakdown, Top hosts, Stack posts,
 * Total visits, Devices — the live page's markup, its data */
export function SiteExtras({ live }) {
  const s = live.siteData
  if (!s) return null
  const { dailyVisits = [], totalVisitsMonth, topHosts = [], blogPosts = [], weeklyTraffic = {}, devices = [], totalSessions } = s
  const sum = (k) => dailyVisits.reduce((n, d) => n + d[k], 0)
  const span2 = { gridColumn: 'span 2' }
  return (
    <div style={{ containerType: 'inline-size' }}><div className="dash-grid">
      <div data-cols="2" style={span2} className="min-h-0">
        <DashFeaturedCard className="h-full" badge="Last 30d" title="Site Traffic" icon="trending-up" description="New visitors, returning visitors, and bounces."
          metricLabel="Total visits" metricValue={totalVisitsMonth}
          chart={dailyVisits.length > 0 ? <LineChart series={dailyToSeries(dailyVisits)} height={200} showArea /> : null}
          legends={[
            { label: 'New', detail: sum('win').toLocaleString(), className: 'chart-color-green' },
            { label: 'Returning', detail: sum('draw').toLocaleString(), className: 'chart-color-blue' },
            { label: 'Bounced', detail: sum('loss').toLocaleString(), className: 'chart-color-red' },
          ]} />
      </div>
      <div data-cols="2" style={span2} className="min-h-0">
        <div className="dash-card h-full flex flex-col">
          <div className="dash-body text-fg-88">Visit breakdown</div>
          <div className="dash-detail text-fg-64">New / returning / bounced</div>
          <div className="flex-1 flex items-center justify-center min-h-0">
            <DonutChart size={120} thickness={20} centerLabel={totalVisitsMonth} segments={dailyVisits.length > 0 ? [
              { value: sum('win'), label: 'New', color: 'var(--kol-palette-green)' },
              { value: sum('draw'), label: 'Returning', color: 'var(--kol-palette-blue)' },
              { value: sum('loss'), label: 'Bounced', color: 'var(--kol-palette-red)' },
            ] : [{ value: 1, label: 'No data', color: 'var(--kol-palette-blue)' }]} />
          </div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 justify-center">
            {[['New', 'green', 'win'], ['Returning', 'blue', 'draw'], ['Bounced', 'red', 'loss']].map(([label, c, k]) => (
              <div key={label} className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: `var(--kol-palette-${c})` }} />
                <span className="dash-caption text-fg-64">{label}</span>
                <span className="dash-caption text-fg-48">{sum(k)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div data-cols="2" style={span2} className="min-h-0">
        <DashListCard className="h-full" variant="meter" title="Top hosts" subtitle="By pageviews" icon="roadmap"
          items={topHosts.length > 0 ? topHosts.map((h) => ({ ...h, detail: h.delta })) : [{ label: 'No data yet', value: '—', percent: 0, color: 'var(--kol-palette-blue)' }]}
          footer="Subdomains — last 30d" />
      </div>
      <div data-cols="2" style={span2} className="min-h-0">
        <DashListCard className="h-full" variant="text" title="Stack posts" subtitle="Most read" icon="book-open" items={blogPosts.length > 0 ? blogPosts : [{ label: 'No data yet', value: '—' }]} footer="/stack/* — last 30d" />
      </div>
      <div data-cols="2" style={span2} className="min-h-0">
        <DashMetricCard className="h-full" label="Total visits (30d)" value={totalVisitsMonth} delta={`${weeklyTraffic.diff ?? ''} vs prev period`} borderColor="var(--kol-palette-teal)"
          sparkline={dailyVisits.length > 2 ? <Sparkline data={dailyVisits.map((d) => d.total)} height={24} fill color="var(--kol-palette-teal)" /> : null} />
      </div>
      <div data-cols="2" style={span2} className="min-h-0">
        <DashChartCard className="h-full" title="Devices" subtitle="Breakdown">
          <div className="flex justify-center py-2">
            <DonutChart segments={devices.length > 0 ? devicesToSegments(devices) : [{ value: 1, label: 'No data', color: 'var(--kol-palette-blue)' }]} size={120} thickness={20} centerLabel={totalSessions} showLegend />
          </div>
        </DashChartCard>
      </div>
    </div></div>
  )
}

/* 12.5 — Edit mode: every card gets a grip on its foot; dragging it sets the card's height, kept per viewer (browser
 * storage — a convenience, never shared). Outside Edit a stored height holds and the grip is gone. */
export const Editing = createContext(false)
const read = (k) => { try { return Number(localStorage.getItem(k)) || null } catch { return null } }
/* /demo-10 (13.8): a card with one title, in the Report card's header — every card on the page wears it */
export const OneCard = ({ title, note, children, className = '' }) => (
  <Card className={className} tabs={[{ key: 't', label: title }]} tab="t" setTab={() => {}}
    menu={note ? <span className="kol-helper-12 text-fg-48 whitespace-nowrap inline-flex items-center" style={{ height: 'var(--kol-ctl-sm)' }}>{note}</span> : null}>
    {children}
  </Card>
)

export function Sized({ id, className = '', children }) {
  const editing = useContext(Editing)
  const ref = useRef(null)
  const base = useRef(null)
  const key = `demo9-card-${id}`
  const [h, setH] = useState(() => read(key))
  /* /demo-10 (13.6): the DS grab gesture on the card's foot (kol/ResizeHandle.jsx), not a hand-made pill — the
   * pre-/demo-10 raw-button pill retired (MetricRebuild 2026-10-31: `ten` is always on in this app) */
  return (
    <div ref={ref} data-card={id}
      className={`relative min-w-0 [&>section]:h-full ${className} ${editing ? 'rounded outline outline-1 outline-dashed outline-[var(--kol-fg-24)]' : ''}`}
      style={{ height: h || undefined, overflow: h ? 'hidden' : undefined }}>
      {children}
      {editing && (
        <ResizeHandle axis="y"
          onDrag={(d) => { if (base.current == null) base.current = ref.current.offsetHeight; setH(Math.max(120, Math.round(base.current + d))) }}
          onEnd={() => { base.current = null; try { localStorage.setItem(key, String(ref.current.offsetHeight)) } catch {} }} />
      )}
    </div>
  )
}
