import { useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Tile } from '../lib/LandingWall.jsx'
import { useNavigate, Link } from 'react-router-dom'
import { ShellContentWidthContext, ShellNavCollapsedContext, ShellTocCollapsedContext } from '@kolkrabbi/kol-workshop'
import { Button, Pill, SectionHero } from '@kolkrabbi/kol-component'
import { slugify, COMPONENTS } from '../nav/registry.js'
import { labelFromSlug } from '../nav/labels.js'
import PreviewStage from '../lib/PreviewStage.jsx'
import Fit from '../lib/Fit.jsx'
import ErrorBoundary from '../lib/ErrorBoundary.jsx'
import { PREVIEWS } from '../lib/previews-registry.js'
import { BLOCKS } from '../lib/blocks-registry.js'
import useMetricsData, { timeAgo } from '../data/metrics/useMetricsData.js'
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
} from '@kolkrabbi/kol-dashboards'

/**
 * Home — the KOL design-system front door.
 *
 * shadcn-style landing: top nav (no sidebar — BOTH rails shed through the
 * shell's collapse seams, so this is the one page that arrives without the
 * docs furniture), a full-height text hero, then a dense
 * columns-masonry "bento wall" of RICH composed cards — real metrics
 * dashboards (offline mock data), copy-pasteable blocks, and a few atomic
 * component previews for rhythm. Every tile is a live @kolkrabbi render,
 * error-boundaried — the page is the proof.
 */

// ── Metrics transformers (ported from kol-dashboards' MetricsDashboard) ──────
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
      className="mb-5 break-inside-avoid rounded border border-fg-04 p-4"
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
// content (the shell frame) and the viewport edge — only on wide screens, and
// kept SUPER subtle: very faint, fading out fast toward the edge.
// The width MUST track --kol-content-shell: the 2026-07-28 re-cap to 1800 left
// a hardcoded 1600 here, which drove the flank width to ~0 and buried the
// ghosts under the wall — the "disappeared ghost-divs" regression.
function GhostFlank({ side }) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-y-0 hidden overflow-hidden xl:block"
      style={{
        [side]: 0,
        width: 'max(0px, calc((100vw - var(--kol-content-shell)) / 2 - 8px))',
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

// The tile frame is the shared one (lib/LandingWall.jsx) — the same card every kind's wall wears.
// Render a registry block (or preview) through the shared PreviewStage contract so it
// picks up its own stage sizing; centre the capped ones inside the tile.
const MORE_BATCH = 12

const stageNode = (Component, stage) => (
  <div className="flex justify-center">
    <PreviewStage entry={{ Component, stage }} />
  </div>
)

export default function Home() {
  const navigate = useNavigate()
  /* This page spans the main track (workshop 0.24.0): a centred hero and a
   * bento wall want the room the rails leave, not the doc pages' canvas cap
   * left against the nav — inside that cap the hero centred on the cap, so
   * collapsing the TOC moved nothing and collapsing the nav moved everything. */
  const setContentWidth = useContext(ShellContentWidthContext)
  const setNavCollapsed = useContext(ShellNavCollapsedContext)
  const setTocCollapsed = useContext(ShellTocCollapsedContext)
  useLayoutEffect(() => {
    setContentWidth?.('none')
    /* THE FRONT DOOR HAS NO RAILS (user, 2026-09-01: "it just jumps straight
     * into the sidebars"). Both collapse on mount and come back on unmount, so
     * every other route lands with the furniture it had. The header's own
     * toggles still work here — a reader who wants the tree can pull it in. */
    setNavCollapsed?.(true)
    setTocCollapsed?.(true)
    return () => {
      setContentWidth?.('canvas')
      setNavCollapsed?.(false)
      setTocCollapsed?.(false)
    }
  }, [setContentWidth, setNavCollapsed, setTocCollapsed])

  /* FIRST ARRIVAL ONLY. The wall's tiles wear the theme's `.kol-reveal-group`
   * and stagger in as they enter the viewport — the motion sheet's own
   * scroll-entrance family, `.is-visible` stamped by the observer below, which
   * is the whole API. Once per session: on the way back from a component page
   * the wall is already known, so it renders plain. */
  const [revealed] = useState(() => {
    try { return sessionStorage.getItem('kol-home-revealed') === '1' } catch { return false }
  })
  const wallRef = useRef(null)
  useEffect(() => {
    if (revealed || !wallRef.current) return
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target) }
    }, { rootMargin: '0px 0px -10% 0px' })
    wallRef.current.querySelectorAll('.kol-reveal-group').forEach((el) => io.observe(el))
    try { sessionStorage.setItem('kol-home-revealed', '1') } catch { /* private mode — plays every time, fine */ }
    return () => io.disconnect()
  }, [revealed])

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
    return b ? { label: b.title, to: `/modules/${key}`, node: stageNode(b.Component, b.stage) } : null
  }
  const preview = (name) => ({ label: labelFromSlug(name), to: `/components/${slugify(name)}`, node: stageNode(PREVIEWS[name]?.Component, PREVIEWS[name]?.stage) })
  /* Analytics/infra tiles link to the dashboards component they render. */
  const compTo = (name) => `/components/${slugify(name)}`

  const hasDaily = dailyVisits.length > 2

  /* the rest of the library for Load more — previews that fit a tile (a slim Card, or a hug/sm/md stage),
   * skipping what the curated wall already shows (`more`, after `tiles`) */
  const [extra, setExtra] = useState(0)

  // Curated, interleaved wall — short stat cards between tall chart/table cards
  // so the columns-masonry packs with rhythm.
  const tiles = useMemo(() => [
    {
      label: 'Analytics · visitors',
      to: compTo('DashMetricCard'),
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
      to: compTo('DashFeaturedCard'),
      node: (
        <DashFeaturedCard
          badge="Last 30 days"
          title="Site traffic"
          icon="trending-up"
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
    preview('Button'),
    {
      label: 'Analytics · top pages',
      to: compTo('DashListCard'),
      node: (
        <DashListCard
          variant="meter"
          title="Top pages"
          subtitle="By pageviews"
          icon="bookmark"
          items={topPages}
          footer="Last 30 days"
        />
      ),
    },
    block('color-picker'),
    {
      label: 'Analytics · pageviews',
      to: compTo('DashMetricCard'),
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
      to: compTo('DashTableCard'),
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
      to: compTo('DashChartCard'),
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
    preview('SegmentedToggle'),
    {
      label: 'Analytics · traffic mix',
      to: compTo('DashStackedBarCard'),
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
    preview('Badge'),
    {
      label: 'Analytics · avg session',
      to: compTo('DashMetricCard'),
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
      to: compTo('DashAlertCard'),
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
    preview('ViewToggle'),
    {
      label: 'Analytics · top countries',
      to: compTo('DashListCard'),
      node: (
        <DashListCard
          variant="ratings"
          title="Top countries"
          subtitle="By visitors"
          icon="roadmap"
          items={topCountries}
          footer="Geo from headers"
        />
      ),
    },
    block('filter-bar'),
    preview('ColorSwatch'),
    preview('Tag'),
    preview('Stepper'),
  ].filter(Boolean), [
    dailyVisits, visitors, pageviews, session, totalVisitsMonth,
    topPages, topCountries, devices, totalSessions, deploys, b2Data, hasDaily,
  ])
  const more = useMemo(() => {
    const shown = new Set(tiles.map((t) => t.to))
    return COMPONENTS
      .filter((c) => c.preview && (c.preview.Card || ['hug', 'sm', 'md'].includes(c.preview.stage)) && !shown.has(`/components/${c.slug}`))
      .map((c) => ({ label: c.displayName, to: `/components/${c.slug}`, node: <Fit height={false}>{c.preview.Card ? <c.preview.Card /> : <PreviewStage entry={c.preview} />}</Fit> }))
  }, [tiles])

  return (
    <>

      {/* ── Hero — the arrival: one screen, nothing else above the fold ──
        * SectionHero's text-only route (no media → composed text on the
        * surface, no glass). `80` is the tallest rung that fits under the
        * header without arithmetic; `full` is 100dvh and would push the wall
        * a header-height below the fold. Copy verbatim from the old block. */}
      <SectionHero
        /* 60, not 80 (2026-09-30, the names audit: *"we could see this above the fold"*) — the
         * live wall now starts on the first screen */
        /* A MINIMUM ON A PHONE (2026-10-02, the phone pass): `60` is a fixed 50svh there, and five
         * buttons plus the install line stand taller than that — the hero clipped them and the wall
         * sat on the Source button. The same rung from md, where the content fits. */
        height="min-h-[50svh] md:h-[60vh]"
        background="primary"
        panelMaxWidth="max-w-none"
        eyebrow={<Pill variant="subtle">{`Source-available · v${componentPkg.version}`}</Pill>}
        headline="The design system for KOL tools."
        /* the old block was `.kol-prose-display` (80px); `display-01` is that
         * size on the role ladder (80 desktop · 56 below), sentence case kept */
        headlineSize="display-01"
        body="A set of source-available React components — inspectors, color and transparency controls, an icon loader, and an opacity token scale. Installed from npm, rendered live on this page."
        /* the buttons centre with the text (2026-09-30 — they sat left of the headline) */
        slotClass={{ body: 'max-w-[var(--kol-content-measure)]', actions: 'justify-center' }}
        actions={<>
          <Button tone="primary" iconRight="arrow-right" onClick={() => navigate('/components')}>
            Browse components
          </Button>
          <Button tone="primary" onClick={() => navigate('/modules')}>
            Modules
          </Button>
          <Button tone="primary" onClick={() => navigate('/sets')}>
            Sets
          </Button>
          <Button tone="primary" onClick={() => navigate('/apps')}>
            Apps
          </Button>
          <Button tone="outline" iconLeft="code" href="https://github.com/Tor-Grimsson/kol-ds">
            Source
          </Button>
          {/* THE INSTALL LINE LIVES IN THE HERO (showcase refinement 2026-09-28 — user: "theres a
            * rouge dollar sign $"). It sat after the hero with `-mt-10`, pulled up UNDER the
            * hero's painted ground: the command text was covered, and only the `$` showed because
            * its `opacity-50` gave it a stacking context of its own. Here it is part of the call
            * to action, on its own line under the buttons. */}
          <p className="w-full kol-mono-12 text-meta text-center">
            <span className="text-subtle">$</span> npm i @kolkrabbi/kol-component
          </p>
        </>}
        /* the hero's own 24px inset stacks on the page's on a phone (text sat 44px in, where every
         * other page stands on 20) — the page's inset alone there */
        className="text-center max-md:[&>div]:px-0"
      />

      {/* ── Bento wall — full-bleed: capped live content, skeleton edges (shadcn model) ── */}
      <section className="relative overflow-hidden pb-24">
        {/* the "Rendered live from the packages" line went (2026-09-30, the user: "move it below the
          * fold? or just remove it?") — the hero's body already says it */}
        <GhostFlank side="left" />
        <GhostFlank side="right" />
        {/* no x padding here (2026-10-01): the shell pads the page — the wall padding itself again
          * was the landing's double inset. Pages never pad themselves on x. */}
        {/* Column count derives from the wall's OWN width (min card 20rem, cap 4)
          * — viewport breakpoints can't see the rails (05-layout-systems § walls). */}
        <div ref={wallRef} className="relative z-10 mx-auto max-w-[var(--kol-content-shell)] gap-5 [columns:4_20rem]">
          {/* the stagger is a delay per tile, not a rule per tile — the
            * family's `--kol-reveal-delay` seam; 4 beats then repeat, so a
            * row arrives together and the next row follows */}
          {tiles.map((t, i) => (
            <Tile
              key={`${t.label}-${i}`}
              label={t.label}
              to={t.to}
              className={revealed ? '' : 'kol-reveal-group'}
              style={revealed ? undefined : { '--kol-reveal-delay': `${(i % 4) * 90}ms` }}
            >
              {t.node}
            </Tile>
          ))}
        </div>
        {/* LOAD MORE (the showcase review W20, 2026-09-30 — user: "landing page needs load more"): the
          * curated wall, then every other live component preview, most used first, a batch at a time */}
        {/* ONE COLUMN BLOCK PER BATCH: CSS columns fill top-down, so a batch poured into the wall above
          * reshuffled every tile on each click; a batch of its own lands under what is already read */}
        {Array.from({ length: extra / MORE_BATCH }, (_, b) => (
          <div key={b} className="relative z-10 mx-auto max-w-[var(--kol-content-shell)] gap-5 [columns:4_20rem]">
            {more.slice(b * MORE_BATCH, (b + 1) * MORE_BATCH).map((t) => (
              <Tile key={t.to} label={t.label} to={t.to}>{t.node}</Tile>
            ))}
          </div>
        ))}
        {extra < more.length && (
          <div className="relative z-10 mt-4 flex justify-center">
            <Button onClick={() => setExtra((n) => n + MORE_BATCH)}>Load more</Button>
          </div>
        )}
      </section>
    </>
  )
}
