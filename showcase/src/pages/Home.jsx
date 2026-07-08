import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Pill } from '@kolkrabbi/kol-component'
import TopBar from '../lib/TopBar.jsx'
import DemoStage from '../lib/DemoStage.jsx'
import ErrorBoundary from '../lib/ErrorBoundary.jsx'
import { DEMOS } from '../lib/demos-registry.js'
import { BLOCKS } from '../lib/blocks-registry.js'
import useMetricsData, { timeAgo } from '../workshop/metrics/useMetricsData.js'
/* Workspace-relative on purpose: the component package's exports map doesn't
 * expose package.json, and the badge must track the real installed version
 * instead of a hand-typed string that goes stale (it read v0.1.1 at v0.4.0). */
import componentPkg from '../../../packages/component/package.json'
import {
  DashMetricCard,
  DashChartCard,
  DashListCard,
  DashFeaturedCard,
  DashAlertCard,
  DashTableCard,
  DashStackedBarCard,
  LineChart,
  DonutChart,
  Sparkline,
} from '../workshop/dashboards/index.js'

/**
 * Home — the KOL design-system front door.
 *
 * shadcn-style landing: top nav (no sidebar), centered hero, then a dense
 * columns-masonry "bento wall" of RICH composed cards — real metrics
 * dashboards (offline mock data), copy-pasteable blocks, and a few atomic
 * component demos for rhythm. Every tile is a live @kolkrabbi render,
 * error-boundaried — the page is the proof.
 */

// ── Metrics transformers (ported from workshop/metrics/MetricsDashboard) ──────
const PALETTE = [
  'var(--kol-palette-blue)',
  'var(--kol-palette-green)',
  'var(--kol-palette-orange)',
  'var(--kol-palette-purple)',
  'var(--kol-palette-red)',
  'var(--kol-palette-teal)',
  'var(--kol-palette-yellow)',
]

const dailyToSeries = (visits) => [
  { data: visits.map((d) => ({ y: d.win })), color: 'var(--kol-palette-green)', fill: true },
  { data: visits.map((d) => ({ y: d.draw })), color: 'var(--kol-palette-blue)', fill: true },
  { data: visits.map((d) => ({ y: d.loss })), color: 'var(--kol-palette-red)', fill: true },
]

const devicesToSegments = (devices) =>
  devices.map((d, i) => ({ value: d.count, label: d.range, color: PALETTE[i % PALETTE.length] }))

const deploysToRows = (deploys) =>
  deploys.slice(0, 8).map((d) => ({
    state: d.state,
    time: timeAgo(d.created),
    duration: d.duration ? `${d.duration}s` : '—',
    branch: d.branch,
  }))

const DEPLOY_COLUMNS = [
  { header: 'Status', accessor: 'state' },
  { header: 'Time', accessor: 'time' },
  { header: 'Build', accessor: 'duration' },
  { header: 'Branch', accessor: 'branch' },
]

// ── Skeleton ghost card — fills the edges to full-bleed (shadcn model) ────────
function Ghost({ h }) {
  return (
    <div
      className="mb-5 break-inside-avoid rounded-[var(--kol-radius-md)] border border-fg-04 p-4"
      style={{ height: h }}
    >
      <div className="mb-4 h-2 w-1/3 rounded-full bg-fg-04" />
      <div className="flex flex-col gap-2">
        <div className="h-2 w-full rounded-full bg-fg-02" />
        <div className="h-2 w-5/6 rounded-full bg-fg-02" />
        <div className="h-2 w-2/3 rounded-full bg-fg-02" />
      </div>
    </div>
  )
}

const GHOST_HEIGHTS = [148, 210, 120, 268, 160, 184, 128, 232, 152, 200]

// One flank of abstract skeleton blocks, filling the gutter between the capped
// 1600px content and the viewport edge — only on wide screens, and kept SUPER
// subtle: very faint, fading out fast toward the edge.
function GhostFlank({ side }) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-y-0 hidden overflow-hidden xl:block"
      style={{
        [side]: 0,
        width: 'max(0px, calc((100vw - 1600px) / 2 - 8px))',
        maskImage: `linear-gradient(to ${side}, black 8%, transparent 72%)`,
        WebkitMaskImage: `linear-gradient(to ${side}, black 8%, transparent 72%)`,
      }}
    >
      <div className="columns-1 gap-5 p-4 opacity-40 2xl:columns-2">
        {GHOST_HEIGHTS.map((h, i) => <Ghost key={i} h={h} />)}
      </div>
    </div>
  )
}

// ── Tile frame — uniform labeled specimen, error-boundaried ───────────────────
function Tile({ label, children }) {
  return (
    <div className="mb-5 break-inside-avoid overflow-hidden rounded-[var(--kol-radius-md)] border border-fg-08 bg-surface-primary p-4">
      <p className="kol-helper-10 text-meta uppercase mb-3">{label}</p>
      <ErrorBoundary>{children}</ErrorBoundary>
    </div>
  )
}

// Render a registry block (or demo) through the shared DemoStage contract so it
// picks up its own stage sizing; centre the capped ones inside the tile.
const stageNode = (Component, stage) => (
  <div className="flex justify-center">
    <DemoStage entry={{ Component, stage }} />
  </div>
)

export default function Home() {
  const navigate = useNavigate()

  // Offline/mock metrics (useMetricsData short-circuits every fetch via MOCK).
  const { siteData, deploys, b2Data } = useMetricsData()
  const {
    dailyVisits = [],
    visitors,
    pageviews,
    session,
    totalVisitsMonth,
    topPages = [],
    topCountries = [],
    devices = [],
    totalSessions,
  } = siteData

  const block = (key) => {
    const b = BLOCKS.find((x) => x.key === key)
    return b ? { label: b.title, node: stageNode(b.Component, b.stage) } : null
  }
  const demo = (name) => ({ label: name, node: stageNode(DEMOS[name]?.Component, DEMOS[name]?.stage) })

  const hasDaily = dailyVisits.length > 2

  // Curated, interleaved wall — short stat cards between tall chart/table cards
  // so the columns-masonry packs with rhythm.
  const tiles = useMemo(() => [
    {
      label: 'Analytics · visitors',
      node: (
        <DashMetricCard
          label="Visitors (30d)"
          value={visitors?.today}
          delta={visitors?.delta}
          borderColor="var(--kol-palette-blue)"
          sparkline={hasDaily ? <Sparkline data={dailyVisits.map((d) => d.total)} height={24} fill color="var(--kol-palette-blue)" /> : null}
        />
      ),
    },
    block('inspector-panel'),
    {
      label: 'Analytics · site traffic',
      node: (
        <DashFeaturedCard
          badge="Last 30 days"
          title="Site traffic"
          icon="trending"
          description="New visitors, returning visitors, and bounces."
          metricLabel="Total visits"
          metricValue={totalVisitsMonth}
          chart={hasDaily ? <LineChart series={dailyToSeries(dailyVisits)} height={180} showArea /> : null}
          legends={[
            { label: 'New', detail: dailyVisits.reduce((s, d) => s + d.win, 0).toLocaleString(), className: 'chart-color-green' },
            { label: 'Returning', detail: dailyVisits.reduce((s, d) => s + d.draw, 0).toLocaleString(), className: 'chart-color-blue' },
            { label: 'Bounced', detail: dailyVisits.reduce((s, d) => s + d.loss, 0).toLocaleString(), className: 'chart-color-red' },
          ]}
        />
      ),
    },
    demo('Button'),
    {
      label: 'Analytics · top pages',
      node: (
        <DashListCard
          variant="meter"
          title="Top pages"
          subtitle="By pageviews"
          icon="dashboard-bookmark"
          items={topPages}
          footer="Last 30 days"
        />
      ),
    },
    block('color-picker'),
    {
      label: 'Analytics · pageviews',
      node: (
        <DashMetricCard
          label="Pageviews (30d)"
          value={pageviews?.today}
          delta={pageviews?.delta}
          borderColor="var(--kol-palette-green)"
          sparkline={hasDaily ? <Sparkline data={dailyVisits.map((d) => d.win + d.draw)} height={24} fill color="var(--kol-palette-green)" /> : null}
        />
      ),
    },
    {
      label: 'Infra · recent deploys',
      node: (
        <DashTableCard
          title="Recent deploys"
          subtitle="Vercel deployment history"
          columns={DEPLOY_COLUMNS}
          rows={deploysToRows(deploys)}
          footer={`${deploys.length} deploys`}
        />
      ),
    },
    block('settings-form'),
    {
      label: 'Analytics · devices',
      node: (
        <DashChartCard title="Devices" subtitle="Sessions by device">
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
      ),
    },
    demo('SegmentedToggle'),
    {
      label: 'Analytics · traffic mix',
      node: (
        <DashStackedBarCard
          title="Traffic mix"
          value={totalVisitsMonth}
          data={dailyVisits.slice(-14)}
          footerLeft="Per day"
          footerRight="new / returning / bounced"
        />
      ),
    },
    demo('Badge'),
    {
      label: 'Analytics · avg session',
      node: (
        <DashMetricCard
          label="Avg session"
          value={session?.avg}
          delta={session?.delta}
          borderColor="var(--kol-palette-purple)"
        />
      ),
    },
    block('color-tools'),
    {
      label: 'Infra · storage',
      node: (
        <DashAlertCard
          label="B2 storage"
          value={b2Data.totalFormatted}
          trend="up"
          trendValue={`${b2Data.totalFiles.toLocaleString()} objects`}
          alerts={(b2Data.buckets || []).slice(0, 3).map((bkt) => ({
            title: bkt.name,
            description: `${bkt.bytesFormatted} · ${(bkt.recentFiles || []).length} recent uploads`,
          }))}
          footer={`${b2Data.bucketCount} buckets`}
        />
      ),
    },
    demo('ViewToggle'),
    {
      label: 'Analytics · top countries',
      node: (
        <DashListCard
          variant="ratings"
          title="Top countries"
          subtitle="By visitors"
          icon="dashboard-roadmap"
          items={topCountries}
          footer="Geo from headers"
        />
      ),
    },
    block('filter-bar'),
    demo('ColorSwatch'),
    demo('Tag'),
    demo('Stepper'),
  ].filter(Boolean), [
    dailyVisits, visitors, pageviews, session, totalVisitsMonth,
    topPages, topCountries, devices, totalSessions, deploys, b2Data, hasDaily,
  ])

  return (
    <>
      <TopBar />

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="text-center px-5 pt-20 md:pt-28 pb-16">
        <div className="mb-6 flex justify-center">
          <Pill variant="subtle">{`Source-available · v${componentPkg.version}`}</Pill>
        </div>
        {/* Headline: full-width centred block → one line on desktop, wraps
            only when the viewport is narrower than the text. */}
        <h1 className="kol-prose-display">The design system for KOL tools.</h1>
        {/* Lede: max-w on the element (so `ch` is measured in its 24px font);
            centre via flex since the kol-prose-* `margin` clobbers mx-auto. */}
        <div className="flex justify-center">
          <p className="kol-prose-lede max-w-[65ch]">
            A set of source-available React components — inspectors, colour and
            transparency controls, an icon loader, and an opacity token scale.
            Installed from npm, rendered live on this page.
          </p>
        </div>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <Button variant="primary" iconRight="arrow-right" onClick={() => navigate('/components')}>
            Browse components
          </Button>
          <Button variant="primary" onClick={() => navigate('/blocks')}>
            Blocks
          </Button>
          <Button variant="primary" onClick={() => navigate('/sets')}>
            Sets
          </Button>
          <Button variant="outline" iconLeft="code" href="https://github.com/Tor-Grimsson/kol-ds">
            Source
          </Button>
        </div>
        <p className="kol-mono-12 text-meta mt-8">
          <span className="opacity-50">$</span> npm i @kolkrabbi/kol-component
        </p>
      </section>

      {/* ── Bento wall — full-bleed: capped live content, skeleton edges (shadcn model) ── */}
      <section className="relative overflow-hidden pb-24">
        <p className="kol-helper-12 text-meta uppercase mb-6 text-center">
          Rendered live from the packages — dashboards, blocks, and components
        </p>
        <GhostFlank side="left" />
        <GhostFlank side="right" />
        <div className="relative z-10 mx-auto max-w-[1400px] gap-5 columns-1 px-5 sm:columns-2 md:px-8 lg:columns-3 xl:columns-4">
          {tiles.map((t, i) => (
            <Tile key={`${t.label}-${i}`} label={t.label}>
              {t.node}
            </Tile>
          ))}
        </div>
      </section>
    </>
  )
}
