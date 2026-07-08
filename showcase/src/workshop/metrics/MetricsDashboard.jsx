import { useState, useMemo, useEffect } from 'react'
import {
  DashMetricCard,
  DashChartCard,
  DashListCard,
  DashFeaturedCard,
  DashAlertCard,
  DashSlotCard,
  DashTableCard,
  DashStackedBarCard,
  LineChart,
  DonutChart,
  Sparkline,
  Heatmap,
} from '../dashboards/index.js'
import { DEMO_HOST_SUMMARY } from './demo-data.js'
import useMetricsData, {
  RANGES,
  DEPLOY_STATE_COLORS,
  DEPLOY_STATE_LABELS,
  TYPE_COLORS,
  formatB2Size,
  timeAgo,
} from './useMetricsData.js'

// =============================================================================
// Tabs
// =============================================================================

const TABS = [
  { id: 'site', label: 'Site' },
  { id: 'project', label: 'Project' },
  { id: 'infra', label: 'Infrastructure' },
  { id: 'sessions', label: 'Sessions' },
]

// =============================================================================
// Palette
// =============================================================================

const PALETTE = [
  'var(--kol-palette-blue)',
  'var(--kol-palette-green)',
  'var(--kol-palette-orange)',
  'var(--kol-palette-purple)',
  'var(--kol-palette-red)',
  'var(--kol-palette-teal)',
  'var(--kol-palette-yellow)',
]

// =============================================================================
// Data transformers
// =============================================================================

const dailyToSeries = (visits) => [
  { data: visits.map(d => ({ y: d.win })), color: 'var(--kol-palette-green)', fill: true },
  { data: visits.map(d => ({ y: d.draw })), color: 'var(--kol-palette-blue)', fill: true },
  { data: visits.map(d => ({ y: d.loss })), color: 'var(--kol-palette-red)', fill: true },
]

const devicesToSegments = (devices) =>
  devices.map((d, i) => ({ value: d.count, label: d.range, color: PALETTE[i % PALETTE.length] }))

const deploysToRows = (deploys) =>
  deploys.slice(0, 12).map(d => ({
    state: d.state,
    time: timeAgo(d.created),
    duration: d.duration ? `${d.duration}s` : '—',
    source: d.source,
    branch: d.branch,
  }))

const editsToRows = (edits) =>
  edits.map(d => ({
    type: d.type,
    title: d.title,
    updated: new Date(d.updated).toLocaleDateString(),
  }))

const bucketsToItems = (buckets, totalBytes) =>
  buckets.map((bkt, i) => ({
    label: bkt.name,
    value: bkt.bytesFormatted,
    percent: totalBytes > 0 ? Math.round((bkt.bytes / totalBytes) * 100) : 0,
    color: PALETTE[i % PALETTE.length],
  }))

const recentUploadsToRows = (buckets) =>
  buckets
    .flatMap(bkt => (bkt.recentFiles || []).map(f => ({ ...f, bucket: bkt.name })))
    .sort((a, b) => b.uploaded - a.uploaded)
    .slice(0, 12)
    .map(f => ({
      file: f.name.split('/').pop(),
      size: formatB2Size(f.size),
      date: new Date(f.uploaded).toLocaleDateString(),
    }))

// =============================================================================
// Table columns
// =============================================================================

const DEPLOY_COLUMNS = [
  { header: 'Status', accessor: 'state' },
  { header: 'Time', accessor: 'time' },
  { header: 'Duration', accessor: 'duration' },
  { header: 'Source', accessor: 'source' },
  { header: 'Branch', accessor: 'branch' },
]

const EDIT_COLUMNS = [
  { header: 'Type', accessor: 'type' },
  { header: 'Title', accessor: 'title' },
  { header: 'Updated', accessor: 'updated' },
]

const UPLOAD_COLUMNS = [
  { header: 'File', accessor: 'file' },
  { header: 'Size', accessor: 'size' },
  { header: 'Date', accessor: 'date' },
]

// =============================================================================
// Deploy status bar
// =============================================================================

const DeployBar = ({ deploys }) => {
  if (!deploys || deploys.length === 0) return null

  const latest = deploys[0]
  const color = DEPLOY_STATE_COLORS[latest.state] || 'var(--kol-palette-blue)'
  const label = DEPLOY_STATE_LABELS[latest.state] || latest.state

  return (
    <div className="flex items-center gap-3 py-1 border-b border-fg-08 text-xs">
      <div className="flex items-center gap-1.5 shrink-0">
        <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: color }} />
        <span className="font-medium" style={{ color }}>{label}</span>
        <span className="text-fg-48">{timeAgo(latest.created)}</span>
        {latest.duration && <span className="text-fg-32">{latest.duration}s build</span>}
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
  )
}

// =============================================================================
// Project milestones
// =============================================================================

const MILESTONES = [
  { date: '2026-03-05', type: 'ship', text: 'Metrics dashboard live with Umami' },
  { date: '2026-03-05', type: 'ship', text: 'GSAP prints hero + workshop expand-all' },
  { date: '2026-03-04', type: 'ship', text: 'CodeBlock consolidation to @kol/ui' },
  { date: '2026-03-03', type: 'ship', text: 'GLIF image gen + screen recording skills' },
  { date: '2026-03-01', type: 'ship', text: 'Table consolidation + @apply removal' },
  { date: '2026-02-28', type: 'ship', text: 'ShellLayout extracted to @kol/ui' },
  { date: '2026-02-18', type: 'ship', text: '24-print CDN migration' },
  { date: '2025-11-15', type: 'launch', text: 'kolkrabbi.io launched on Vercel' },
  { date: '2025-11-07', type: 'ship', text: 'Chess analytics — 19 cards, 27k games' },
  { date: '2025-10-16', type: 'ship', text: 'Color system refactor — 69 tokens' },
]

const MILESTONE_COLORS = {
  ship: 'var(--kol-palette-green)',
  launch: 'var(--kol-palette-blue)',
  warn: 'var(--kol-palette-orange)',
  fail: 'var(--kol-palette-red)',
}

// =============================================================================
// Timeline bar
// =============================================================================

const TimelineBar = ({ range, onRangeChange }) => {
  return (
    <div className="flex items-center gap-3 py-1.5 border-b border-fg-08">
      <div className="flex gap-0.5 shrink-0">
        {RANGES.map(r => (
          <button
            key={r.id}
            onClick={() => onRangeChange(r.id)}
            className={`px-2 py-0.5 text-xs rounded transition-colors ${
              range === r.id
                ? 'bg-accent-primary text-surface-primary font-medium'
                : 'text-fg-48 hover:text-fg-64'
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="flex gap-4 text-xs text-fg-48 overflow-x-auto scrollbar-none">
          {MILESTONES.slice(0, 6).map((m, i) => (
            <span key={i} className="flex items-center gap-1.5 whitespace-nowrap shrink-0">
              <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: MILESTONE_COLORS[m.type] }} />
              <span className="text-fg-32">{m.date.slice(5)}</span>
              <span>{m.text}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

// =============================================================================
// Host summary card (pinned + dynamic)
// =============================================================================

const useHostSummary = (host, range) => {
  /* Showcase adaptation: serve the demo summary — no /api/metrics-summary here. */
  const [data, setData] = useState(() => DEMO_HOST_SUMMARY[host] ?? null)
  useEffect(() => {
    if (DEMO_HOST_SUMMARY[host]) { setData(DEMO_HOST_SUMMARY[host]); return }
    if (!host) { setData(null); return }
    const rangeMs = RANGES.find(r => r.id === range)?.ms ?? 30 * 86400000
    fetch(`/api/metrics-summary?host=${encodeURIComponent(host)}&range=${rangeMs}`)
      .then(r => r.ok ? r.json() : null)
      .then(setData)
      .catch(() => setData(null))
  }, [host, range])
  return data
}

const HostSummaryCard = ({ host, label, range, borderColor }) => {
  const data = useHostSummary(host, range)
  if (!host) return null
  const visitors = data?.visitors ?? '—'
  const delta = data?.visitorsDelta ? `${data.visitorsDelta} vs prev period` : ''
  return (
    <DashMetricCard
      className="h-full"
      label={`${label} — ${host}`}
      value={visitors}
      delta={delta}
      borderColor={borderColor}
      sparkline={data?.trend?.length > 2 ? <Sparkline data={data.trend} height={24} fill color={borderColor} /> : null}
    />
  )
}

// =============================================================================
// Host filter pills
// =============================================================================

const HostFilterPills = ({ host, setHost, allHosts }) => {
  if (!allHosts || allHosts.length <= 1) return null
  return (
    <div className="flex items-center gap-1.5 pb-2 overflow-x-auto scrollbar-none">
      <span className="dash-caption text-fg-48 shrink-0">Host</span>
      <button
        onClick={() => setHost(null)}
        className={`px-2 py-0.5 text-xs rounded transition-colors shrink-0 ${
          host === null
            ? 'bg-accent-primary text-surface-primary font-medium'
            : 'text-fg-48 hover:text-fg-64'
        }`}
      >
        All
      </button>
      {allHosts.map(h => (
        <button
          key={h.label}
          onClick={() => setHost(h.label)}
          className={`px-2 py-0.5 text-xs rounded transition-colors shrink-0 ${
            host === h.label
              ? 'bg-accent-primary text-surface-primary font-medium'
              : 'text-fg-48 hover:text-fg-64'
          }`}
        >
          {h.label}
        </button>
      ))}
    </div>
  )
}

// =============================================================================
// Site tab
// =============================================================================

const MAIN_HOST = 'kolkrabbi.io'

const SiteTab = ({ data, range, host, setHost, allHosts }) => {
  const { visitors, pageviews, session, bounce, dailyVisits, totalVisitsMonth, topPages, topCountries, topHosts, blogPosts, referrers, weeklyTraffic, devices, totalSessions } = data
  const rangeLabel = RANGES.find(r => r.id === range)?.label ?? range
  const visitorsLabel = range === 'today' ? 'Visitors today' : `Visitors (${rangeLabel})`
  const isFiltered = Boolean(host)

  // Right summary card: when a non-main host is filtered, show that host.
  // Otherwise, show the top-traffic non-main subdomain for comparison.
  const topCompareHost = allHosts.find(h => h.label !== MAIN_HOST)?.label
  const rightHost = isFiltered && host !== MAIN_HOST ? host : topCompareHost
  const rightLabel = isFiltered && host !== MAIN_HOST ? 'Viewing' : 'Top subdomain'

  return (
    <>
      <HostFilterPills host={host} setHost={setHost} allHosts={allHosts} />
      <div style={{ containerType: 'inline-size' }}><div className="dash-grid">
        <div data-cols="2" style={{ gridColumn: 'span 2' }} className="min-h-0">
          <HostSummaryCard host={MAIN_HOST} label="Main site" range={range} borderColor="var(--kol-palette-yellow)" />
        </div>
        {rightHost && (
          <div data-cols="2" style={{ gridColumn: 'span 2' }} className="min-h-0">
            <HostSummaryCard host={rightHost} label={rightLabel} range={range} borderColor="var(--kol-palette-teal)" />
          </div>
        )}
      <DashMetricCard label={visitorsLabel} value={visitors.today} delta={visitors.delta} borderColor="var(--kol-palette-blue)"
        sparkline={dailyVisits.length > 2 ? <Sparkline data={dailyVisits.map(d => d.win + d.draw + d.loss)} height={24} fill color="var(--kol-palette-blue)" /> : null} />
      <DashMetricCard label="Pageviews" value={pageviews.today} delta={pageviews.delta} borderColor="var(--kol-palette-green)"
        sparkline={dailyVisits.length > 2 ? <Sparkline data={dailyVisits.map(d => d.win + d.draw)} height={24} fill color="var(--kol-palette-green)" /> : null} />
      <DashMetricCard label="Avg session" value={session.avg} delta={session.delta} borderColor="var(--kol-palette-purple)" />
      <DashMetricCard label="Bounce rate" value={bounce.rate} delta={bounce.delta} borderColor="var(--kol-palette-orange)"
        sparkline={dailyVisits.length > 2 ? <Sparkline data={dailyVisits.map(d => d.loss)} height={24} fill color="var(--kol-palette-orange)" /> : null} />

      <div data-cols="2" style={{ gridColumn: 'span 2' }} className="min-h-0">
        <DashFeaturedCard
          className="h-full"
          badge={`Last ${rangeLabel}`}
          title="Site Traffic"
          icon="trending"
          description="New visitors, returning visitors, and bounces."
          metricLabel="Total visits"
          metricValue={totalVisitsMonth}
          chart={dailyVisits.length > 0 ? <LineChart series={dailyToSeries(dailyVisits)} height={200} showArea /> : null}
          legends={[
            { label: 'New', detail: dailyVisits.reduce((s, d) => s + d.win, 0).toLocaleString(), className: 'chart-color-green' },
            { label: 'Returning', detail: dailyVisits.reduce((s, d) => s + d.draw, 0).toLocaleString(), className: 'chart-color-blue' },
            { label: 'Bounced', detail: dailyVisits.reduce((s, d) => s + d.loss, 0).toLocaleString(), className: 'chart-color-red' },
          ]}
        />
      </div>
      <div data-cols="2" style={{ gridColumn: 'span 2' }} className="min-h-0">
        <div className="dash-card h-full flex flex-col">
          <div className="dash-body text-fg-88">Visit breakdown</div>
          <div className="dash-detail text-fg-64">New / returning / bounced</div>
          <div className="flex-1 flex items-center justify-center min-h-0">
            {(() => {
              const segments = dailyVisits.length > 0 ? [
                { value: dailyVisits.reduce((s, d) => s + d.win, 0), label: 'New', color: 'var(--kol-palette-green)' },
                { value: dailyVisits.reduce((s, d) => s + d.draw, 0), label: 'Returning', color: 'var(--kol-palette-blue)' },
                { value: dailyVisits.reduce((s, d) => s + d.loss, 0), label: 'Bounced', color: 'var(--kol-palette-red)' },
              ] : [{ value: 1, label: 'No data', color: 'var(--kol-palette-blue)' }]
              return <DonutChart segments={segments} size={120} thickness={20} centerLabel={totalVisitsMonth} />
            })()}
          </div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 justify-center">
            {[
              { label: 'New', color: 'var(--kol-palette-green)', value: dailyVisits.reduce((s, d) => s + d.win, 0) },
              { label: 'Returning', color: 'var(--kol-palette-blue)', value: dailyVisits.reduce((s, d) => s + d.draw, 0) },
              { label: 'Bounced', color: 'var(--kol-palette-red)', value: dailyVisits.reduce((s, d) => s + d.loss, 0) },
            ].map((seg, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: seg.color }} />
                <span className="dash-caption text-fg-64">{seg.label}</span>
                <span className="dash-caption text-fg-48">{seg.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div data-cols="2" style={{ gridColumn: 'span 2' }} className="min-h-0">
        <DashListCard className="h-full" variant="meter" title="Top pages" subtitle="By pageviews" icon="dashboard-bookmark" items={topPages.length > 0 ? topPages : [{ label: 'No data yet', value: '—', percent: 0, color: 'var(--kol-palette-blue)' }]} footer={`Last ${rangeLabel}`} />
      </div>
      <div data-cols="2" style={{ gridColumn: 'span 2' }} className="min-h-0">
        <DashListCard className="h-full" variant="ratings" title="Top countries" subtitle="By visitors" icon="dashboard-roadmap" items={topCountries.length > 0 ? topCountries : [{ label: 'No data yet', value: '—', detail: '', color: 'var(--kol-palette-blue)' }]} footer="Geo from headers" />
      </div>

      {!isFiltered && (
        <div data-cols="2" style={{ gridColumn: 'span 2' }} className="min-h-0">
          <DashListCard
            className="h-full"
            variant="meter"
            title="Top hosts"
            subtitle="By pageviews"
            icon="dashboard-roadmap"
            items={(topHosts || []).length > 0
              ? topHosts.map(h => ({ ...h, detail: h.delta }))
              : [{ label: 'No data yet', value: '—', percent: 0, color: 'var(--kol-palette-blue)' }]}
            footer={`Subdomains — last ${rangeLabel}`}
          />
        </div>
      )}

      <div data-cols="2" style={{ gridColumn: 'span 2' }} className="min-h-0">
        <DashListCard className="h-full" variant="text" title="Stack posts" subtitle="Most read" icon="dashboard-book-open" items={blogPosts.length > 0 ? blogPosts : [{ label: 'No data yet', value: '—' }]} footer={`/stack/* — last ${rangeLabel}`} />
      </div>
      <div data-cols="2" style={{ gridColumn: 'span 2' }} className="min-h-0">
        <DashListCard className="h-full" variant="meter" title="Referrers" subtitle="Traffic sources" icon="stat-chart-a" items={referrers.length > 0 ? referrers : [{ label: 'No data yet', value: '—', percent: 0, color: 'var(--kol-palette-blue)' }]} footer="Excl. direct" />
      </div>

      <div data-cols="2" style={{ gridColumn: 'span 2' }} className="min-h-0">
        <DashMetricCard className="h-full" label={`Total visits (${rangeLabel})`} value={totalVisitsMonth} delta={`${weeklyTraffic.diff} vs prev period`} borderColor="var(--kol-palette-teal)"
          sparkline={dailyVisits.length > 2 ? <Sparkline data={dailyVisits.map(d => d.total)} height={24} fill color="var(--kol-palette-teal)" /> : null} />
      </div>
      <div data-cols="2" style={{ gridColumn: 'span 2' }} className="min-h-0">
        <DashChartCard className="h-full" title="Devices" subtitle="Breakdown">
          <div className="flex justify-center py-2">
            <DonutChart
              segments={devices.length > 0 ? devicesToSegments(devices) : [{ value: 1, label: 'No data', color: 'var(--kol-palette-blue)' }]}
              size={120}
              thickness={20}
              centerLabel={totalSessions}
              showLegend
            />
          </div>
        </DashChartCard>
      </div>
      </div></div>
    </>
  )
}

// =============================================================================
// Project tab
// =============================================================================

const ProjectTab = ({ data, sanity }) => {
  const t = sanity.types

  return (
    <div style={{ containerType: 'inline-size' }}><div className="dash-grid">
      <DashMetricCard label="Components" value={data.components} delta="packages/ui" borderColor="var(--kol-palette-blue)" />
      <DashMetricCard label="Routes" value={data.routes} delta="app pages" borderColor="var(--kol-palette-green)" />
      <DashMetricCard label="Lines of code" value={data.linesOfCode} delta="jsx + js + css" borderColor="var(--kol-palette-purple)" />
      <DashMetricCard label="Commits" value={data.commits} delta="git history" borderColor="var(--kol-palette-orange)" />

      <DashMetricCard label="Atoms" value={data.atoms} delta="@kol/ui" borderColor="var(--kol-palette-blue)" />
      <DashMetricCard label="Molecules" value={data.molecules} delta="@kol/ui" borderColor="var(--kol-palette-green)" />
      <DashMetricCard label="Session logs" value={data.sessionLogs} delta="LLM sessions" borderColor="var(--kol-palette-purple)" />
      <DashMetricCard label="Docs files" value={data.docsFiles} delta="documentation" borderColor="var(--kol-palette-orange)" />

      <DashMetricCard label="CMS documents" value={String(sanity.totalDocuments)} delta="Sanity dataset" borderColor="var(--kol-palette-teal)" />
      <DashMetricCard label="Blog posts" value={String(t.blog)} delta="published" borderColor="var(--kol-palette-blue)" />
      <DashMetricCard label="Projects" value={String(t.project)} delta="portfolio" borderColor="var(--kol-palette-green)" />
      <DashMetricCard label="Categories + Tags" value={String(t.category + t.tag)} delta="taxonomy" borderColor="var(--kol-palette-orange)" />

      <div data-cols="2" style={{ gridColumn: 'span 2' }} className="min-h-0">
        <DashTableCard
          className="h-full"
          title="Recent CMS edits"
          subtitle="Sanity dataset"
          columns={EDIT_COLUMNS}
          rows={editsToRows(sanity.recentEdits)}
          footer="Live from Sanity API"
        />
      </div>
      <DashMetricCard label="Packages" value={data.packages} delta="workspaces" borderColor="var(--kol-palette-teal)" />
      <DashMetricCard label="Fonts" value={data.fonts} delta="typeface files" borderColor="var(--kol-palette-red)" />
    </div></div>
  )
}

// =============================================================================
// Infrastructure tab
// =============================================================================

const InfraTab = ({ deploys, b2 }) => {
  const totalDeploys = deploys.length
  const failedDeploys = deploys.filter(d => d.state === 'ERROR').length
  const buildDurations = deploys.filter(d => d.duration).map(d => d.duration)
  const avgBuild = buildDurations.length > 0
    ? Math.round(buildDurations.reduce((s, d) => s + d, 0) / buildDurations.length)
    : 0
  const latest = deploys[0]
  const latestState = latest ? (DEPLOY_STATE_LABELS[latest.state] || latest.state) : '—'
  const latestColor = latest ? (DEPLOY_STATE_COLORS[latest.state] || 'var(--kol-palette-blue)') : 'var(--kol-palette-blue)'

  const deploysByWeek = useMemo(() => {
    if (deploys.length === 0) return []
    const weeks = {}
    for (const d of deploys) {
      const date = new Date(d.created)
      const weekStart = new Date(date)
      weekStart.setDate(date.getDate() - date.getDay())
      const key = weekStart.toISOString().slice(0, 10)
      if (!weeks[key]) weeks[key] = { win: 0, draw: 0, loss: 0, total: 0 }
      weeks[key].total++
      if (d.state === 'READY') weeks[key].win++
      else if (d.state === 'ERROR') weeks[key].loss++
      else weeks[key].draw++
    }
    return Object.entries(weeks).sort(([a], [b]) => a.localeCompare(b)).map(([, v]) => v).slice(-12)
  }, [deploys])

  const deployHeatmap = useMemo(() => {
    const grid = Array.from({ length: 7 }, () => Array(24).fill(0))
    for (const d of deploys) {
      const date = new Date(d.created)
      grid[date.getDay()][date.getHours()]++
    }
    return grid
  }, [deploys])

  return (
    <div style={{ containerType: 'inline-size' }}><div className="dash-grid">
      <DashMetricCard className="h-full" label="Latest deploy" value={latestState} delta={latest ? timeAgo(latest.created) : '—'} borderColor={latestColor} />
      <DashMetricCard className="h-full" label="Avg build time" value={`${avgBuild}s`} delta={`last ${totalDeploys} deploys`} borderColor="var(--kol-palette-purple)"
        sparkline={buildDurations.length > 2 ? <Sparkline data={buildDurations.slice(0, 20).reverse()} height={24} fill color="var(--kol-palette-purple)" /> : null} />
      <DashMetricCard className="h-full" label="Failed deploys" value={String(failedDeploys)} delta={`of ${totalDeploys} total`} borderColor={failedDeploys > 0 ? 'var(--kol-palette-red)' : 'var(--kol-palette-green)'} />
      <DashMetricCard className="h-full" label="Success rate" value={totalDeploys > 0 ? `${Math.round(((totalDeploys - failedDeploys) / totalDeploys) * 100)}%` : '—'} delta="all deploys" borderColor="var(--kol-palette-green)" />

      <div data-cols="4" style={{ gridColumn: 'span 4' }} className="min-h-0">
        <DashTableCard
          className="h-full"
          title="Recent deploys"
          subtitle="Vercel deployment history"
          columns={DEPLOY_COLUMNS}
          rows={deploysToRows(deploys)}
          footer={`${totalDeploys} total deploys`}
        />
      </div>

      <DashMetricCard className="h-full" label="B2 storage" value={b2.totalFormatted} delta={`${b2.totalFiles.toLocaleString()} objects`} borderColor="var(--kol-palette-blue)" />
      <DashMetricCard className="h-full" label="B2 buckets" value={String(b2.bucketCount)} delta="total buckets" borderColor="var(--kol-palette-orange)" />
      <DashStackedBarCard className="h-full" title="Deploy health" value={`${totalDeploys} deploys`} data={deploysByWeek} footerLeft="Per week" footerRight={`${failedDeploys} failed`} />
      <DashChartCard className="h-full" title="Deploy activity" subtitle="Day × hour">
        <Heatmap data={deployHeatmap} rows={['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']} cols={Array.from({ length: 24 }, (_, i) => i % 6 === 0 ? `${i}h` : '')} fill />
      </DashChartCard>

      <div data-cols="2" style={{ gridColumn: 'span 2' }} className="min-h-0">
        <DashListCard
          className="h-full"
          variant="meter"
          title="Bucket breakdown"
          subtitle="Storage per bucket"
          items={bucketsToItems(b2.buckets, b2.totalBytes)}
          footer={`${b2.totalFormatted} total`}
        />
      </div>
      <div data-cols="2" style={{ gridColumn: 'span 2' }} className="min-h-0">
        <DashTableCard
          className="h-full"
          title="Recent uploads"
          subtitle="Across all buckets"
          columns={UPLOAD_COLUMNS}
          rows={recentUploadsToRows(b2.buckets)}
          footer="Sorted by upload date"
        />
      </div>
    </div></div>
  )
}

// =============================================================================
// Sessions tab
// =============================================================================

const SessionsTab = ({ data }) => {
  return (
    <div style={{ containerType: 'inline-size' }}><div className="dash-grid">
      <DashMetricCard className="h-full" label="Session logs" value={data.sessionLogs} delta="total logged" borderColor="var(--kol-palette-blue)" />
      <DashMetricCard className="h-full" label="Docs files" value={data.docsFiles} delta="documentation" borderColor="var(--kol-palette-green)" />
      <DashMetricCard className="h-full" label="Commits" value={data.commits} delta="git history" borderColor="var(--kol-palette-purple)" />
      <DashMetricCard className="h-full" label="Components" value={data.components} delta="total built" borderColor="var(--kol-palette-orange)" />
    </div></div>
  )
}

// =============================================================================
// Main
// =============================================================================

const Metrics = () => {
  const [tab, setTab] = useState('site')
  const {
    siteData,
    allHosts,
    host,
    setHost,
    projectData,
    sanityData,
    deploys,
    b2Data,
    error,
    range,
    setRange,
  } = useMetricsData()

  useEffect(() => {
    const link = document.querySelector('link[rel="icon"]')
    if (!link) return
    const prev = link.href
    link.href = '/favicons/favicon-metrics.svg'
    return () => { link.href = prev }
  }, [])

  return (
    <div className="min-h-screen bg-surface-primary text-fg-88 p-3 flex flex-col">
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2">
        <div className="flex items-baseline gap-3">
          <h1 className="dash-label text-fg-88">kolkrabbi.io / metrics</h1>
          <span className="dash-detail text-fg-48">
            {error ? `error: ${error}` : 'live'}
          </span>
        </div>
        <div className="flex gap-1">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                tab === t.id
                  ? 'bg-surface-secondary text-fg-88'
                  : 'text-fg-48 hover:text-fg-64'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <TimelineBar range={range} onRangeChange={setRange} />
      <DeployBar deploys={deploys} />

      <div className="flex-1 min-h-0 pt-3" style={{ containerType: 'inline-size' }}>
        {tab === 'site' && <SiteTab data={siteData} range={range} host={host} setHost={setHost} allHosts={allHosts} />}
        {tab === 'project' && <ProjectTab data={projectData} sanity={sanityData} />}
        {tab === 'infra' && <InfraTab deploys={deploys} b2={b2Data} />}
        {tab === 'sessions' && <SessionsTab data={projectData} />}
      </div>
    </div>
  )
}

export default Metrics
