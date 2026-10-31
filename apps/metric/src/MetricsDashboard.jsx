import { useState, useMemo, useEffect } from 'react'
import {
  DashMetricCard,
  DashChartCard,
  DashListCard,
  DashFeaturedCard,
  DashTableCard,
  DashStackedBarCard,
  LineChart,
  DonutChart,
  Sparkline,
  Heatmap,
} from '@kolkrabbi/kol-dashboards'
import { Dropdown, IconFrame, Tooltip, SettingsPanel, SettingsRow, SettingsChoice } from '@kolkrabbi/kol-component'
import {
  RANGES,
  DEPLOY_STATE_COLORS,
  DEPLOY_STATE_LABELS,
  PALETTE,
  MILESTONE_COLORS,
  formatB2Size,
  timeAgo,
} from '@kolkrabbi/kol-dashboards'

/**
 * MetricsDashboard — a full analytics apparatus (site / project / infra /
 * sessions) built on the dashboards primitives.
 *
 * Presentation only: all data is injected via the `data` prop (the consumer
 * owns the fetch/mock adapter). `milestones` and `mainHost` are consumer
 * content. See metrics-constants.js for the view-level tokens.
 *
 * data = {
 *   siteData, allHosts, host, setHost, projectData, sanityData,
 *   deploys, b2Data, error, range, setRange, hostSummaries
 * }
 */

/* LOCAL COPY (kol-website 2026-10-09, user ruling): this composition was copied from
 * @kolkrabbi/kol-dashboards@0.5.0 so the HEADER can be owned here — the cards, charts and
 * constants still come from the package (shared with chess). What changed from the package:
 * the header is media's pattern (display title · section Dropdown on a phone / tabs at
 * desk · gear), range and host moved into a settings drawer, the milestone ticker is desk-only. */

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

// =============================================================================
// Timeline bar — milestones are consumer content (injected)
// =============================================================================


// =============================================================================
// Host summary card — summary object injected (no self-fetch)
// =============================================================================

const HostSummaryCard = ({ host, label, summary, borderColor }) => {
  if (!host) return null
  const visitors = summary?.visitors ?? '—'
  const delta = summary?.visitorsDelta ? `${summary.visitorsDelta} vs prev period` : ''
  return (
    <DashMetricCard
      className="h-full"
      label={`${label} — ${host}`}
      value={visitors}
      delta={delta}
      borderColor={borderColor}
      sparkline={summary?.trend?.length > 2 ? <Sparkline data={summary.trend} height={24} fill color={borderColor} /> : null}
    />
  )
}

// =============================================================================
// Site tab
// =============================================================================

const SiteTab = ({ data, range, host, setHost, allHosts, hostSummaries, mainHost }) => {
  const { visitors, pageviews, session, bounce, dailyVisits, totalVisitsMonth, topPages, topCountries, topHosts, blogPosts, referrers, weeklyTraffic, devices, totalSessions } = data
  const rangeLabel = RANGES.find(r => r.id === range)?.label ?? range
  const visitorsLabel = range === 'today' ? 'Visitors today' : `Visitors (${rangeLabel})`
  const isFiltered = Boolean(host)

  // Right summary card: when a non-main host is filtered, show that host.
  // Otherwise, show the top-traffic non-main subdomain for comparison.
  const topCompareHost = allHosts.find(h => h.label !== mainHost)?.label
  const rightHost = isFiltered && host !== mainHost ? host : topCompareHost
  const rightLabel = isFiltered && host !== mainHost ? 'Viewing' : 'Top subdomain'

  return (
    <>
      <div style={{ containerType: 'inline-size' }}><div className="dash-grid">
        <div data-cols="2" style={{ gridColumn: 'span 2' }} className="min-h-0">
          <HostSummaryCard host={mainHost} label="Main site" summary={hostSummaries?.[mainHost]} borderColor="var(--kol-palette-yellow)" />
        </div>
        {rightHost && (
          <div data-cols="2" style={{ gridColumn: 'span 2' }} className="min-h-0">
            <HostSummaryCard host={rightHost} label={rightLabel} summary={hostSummaries?.[rightHost]} borderColor="var(--kol-palette-teal)" />
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
          icon="trending-up"
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
        <DashListCard className="h-full" variant="meter" title="Top pages" subtitle="By pageviews" icon="bookmark" items={topPages.length > 0 ? topPages : [{ label: 'No data yet', value: '—', percent: 0, color: 'var(--kol-palette-blue)' }]} footer={`Last ${rangeLabel}`} />
      </div>
      <div data-cols="2" style={{ gridColumn: 'span 2' }} className="min-h-0">
        <DashListCard className="h-full" variant="ratings" title="Top countries" subtitle="By visitors" icon="roadmap" items={topCountries.length > 0 ? topCountries : [{ label: 'No data yet', value: '—', detail: '', color: 'var(--kol-palette-blue)' }]} footer="Geo from headers" />
      </div>

      {!isFiltered && (
        <div data-cols="2" style={{ gridColumn: 'span 2' }} className="min-h-0">
          <DashListCard
            className="h-full"
            variant="meter"
            title="Top hosts"
            subtitle="By pageviews"
            icon="roadmap"
            items={(topHosts || []).length > 0
              ? topHosts.map(h => ({ ...h, detail: h.delta }))
              : [{ label: 'No data yet', value: '—', percent: 0, color: 'var(--kol-palette-blue)' }]}
            footer={`Subdomains — last ${rangeLabel}`}
          />
        </div>
      )}

      <div data-cols="2" style={{ gridColumn: 'span 2' }} className="min-h-0">
        <DashListCard className="h-full" variant="text" title="Stack posts" subtitle="Most read" icon="book-open" items={blogPosts.length > 0 ? blogPosts : [{ label: 'No data yet', value: '—' }]} footer={`/stack/* — last ${rangeLabel}`} />
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

export const ProjectTab = ({ data, sanity }) => {
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

export const InfraTab = ({ deploys, b2 }) => {
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

export const SessionsTab = ({ data }) => {
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

export default function MetricsDashboard({ data, milestones = [], mainHost }) {
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
    hostSummaries,
  } = data

  const resolvedMainHost = mainHost ?? allHosts?.[0]?.label

  const [settingsOpen, setSettingsOpen] = useState(false)
  const tabOptions = TABS.map(t => ({ value: t.id, label: t.label }))

  /* SHORTCUTS (user 2026-10-13: "shortcuts are missing, or command , for settings"): ⌘, / Ctrl+,
   * opens the drawer, Esc closes it, 1–4 switch the section. Nothing fires while a field has
   * focus. Media's `App.jsx` keydown listener is the pattern. */
  useEffect(() => {
    const onKey = (e) => {
      const t = e.target
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT' || t.isContentEditable)) return
      if ((e.metaKey || e.ctrlKey) && e.key === ',') { e.preventDefault(); setSettingsOpen(true); return }
      if (e.metaKey || e.ctrlKey || e.altKey) return
      if (e.key === 'Escape') { setSettingsOpen(false); return }
      const n = Number(e.key)
      if (n >= 1 && n <= TABS.length) setTab(TABS[n - 1].id)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])
  const hostOptions = [{ value: '__all__', label: 'All hosts' }, ...(allHosts ?? []).map(h => ({ value: h.label, label: h.label }))]
  const rangeLabel = RANGES.find(r => r.id === range)?.label ?? range
  return (
    <div className="min-h-screen bg-surface-primary text-fg-88 p-3 md:p-6 flex flex-col gap-3">
      {/* THE HEADER — media's pattern (MediaLibrary's LibraryHeader): the app's display title on the
        * left; on the right the one choice that changes the page (the section) and the gear. */}
      <header className="flex items-center justify-between gap-4">
        <h1 className="flex items-baseline gap-3 min-w-0">
          {/* the title goes home (user 2026-10-13: "metrics should go to home") */}
          <a href="https://kolkrabbi.io" className="kol-sans-display-03 text-auto truncate no-underline hover:opacity-80 transition-opacity">METRICS</a>
          {error && <span className="kol-helper-12 text-ui-error truncate">error</span>}
        </h1>
        <div className="flex items-center gap-2 min-w-0">
          {/* the section is a Dropdown at every width (user 2026-10-13: "can this be a dropdown instead?") — the desk tabs are gone */}
          <Dropdown className="min-w-0 max-w-[45vw]" value={tab} onChange={setTab} options={tabOptions} aria-label="Dashboard section" />
          <Tooltip label="Range and host">
            <IconFrame name="settings-01" variant="primary" size="sm" onClick={() => setSettingsOpen(true)} aria-label="Range and host" />
          </Tooltip>
        </div>
      </header>
      {/* the meta line — what is showing, then the deploy status */}
      <p className="kol-helper-12 text-fg-48 -mb-1">
        {resolvedMainHost} · {rangeLabel} · {host ?? 'all hosts'}
      </p>
      <DeployBar deploys={deploys} milestones={milestones} />

      <div className="flex-1 min-h-0" style={{ containerType: 'inline-size' }}>
        {tab === 'site' && <SiteTab data={siteData} range={range} host={host} setHost={setHost} allHosts={allHosts} hostSummaries={hostSummaries} mainHost={resolvedMainHost} />}
        {tab === 'project' && <ProjectTab data={projectData} sanity={sanityData} />}
        {tab === 'infra' && <InfraTab deploys={deploys} b2={b2Data} />}
        {tab === 'sessions' && <SessionsTab data={projectData} />}
      </div>
      {settingsOpen && (
        <SettingsPanel variant="drawer" title="Range and host" onClose={() => setSettingsOpen(false)}>
          <div className="flex flex-col gap-4">
            <SettingsRow label="Range" align="fill">
              <SettingsChoice ariaLabel="Time range" value={range} onChange={setRange} options={RANGES.map(r => ({ value: r.id, label: r.label }))} />
            </SettingsRow>
            {allHosts?.length > 1 && (
              <SettingsRow label="Host" align="fill">
                <SettingsChoice ariaLabel="Host" value={host ?? '__all__'} onChange={(v) => setHost(v === '__all__' ? null : v)} options={hostOptions} />
              </SettingsRow>
            )}
          </div>
        </SettingsPanel>
      )}
    </div>
  )
}
