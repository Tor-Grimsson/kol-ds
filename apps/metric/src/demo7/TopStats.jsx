/* The numbers row and the chart as one card (8.7), as on plausible.io: six metric tabs, each with its value, change and
 * date range — and the comparison's value and range under it when Compare is on — over the selected metric's chart,
 * with the comparison as a faint second line, the unfinished current period dotted, and a tooltip on hover. */
import { useState } from 'react'
import { TopStats, ChartHead, ChartWithLegend, TrendChart, ChangeBadge, DeltaBadge, formatRange } from '@kolkrabbi/kol-dashboards'
import { umami, useAsync, filterParams, bucketsOf, fmtNum, fmtDuration, comparisonOf, isDevHost } from './data.js'

const TZ = Intl.DateTimeFormat().resolvedOptions().timeZone

export const METRICS = [
  { key: 'visitors', label: 'Unique visitors', of: (s) => s.visitors, fmt: fmtNum },
  { key: 'visits', label: 'Total visits', of: (s) => s.visits, fmt: fmtNum },
  { key: 'pageviews', label: 'Total pageviews', of: (s) => s.pageviews, fmt: fmtNum },
  { key: 'vpv', label: 'Views per visit', of: (s) => (s.visits ? s.pageviews / s.visits : 0), fmt: (v) => `${Math.round(v * 100) / 100}` },
  { key: 'bounce', label: 'Bounce rate', of: (s) => (s.visits ? Math.round((s.bounces / s.visits) * 100) : 0), fmt: (v) => `${v}%`, lowerIsBetter: true },
  { key: 'duration', label: 'Visit duration', of: (s) => (s.visits ? s.totaltime / s.visits : 0), fmt: fmtDuration },
]
const metricOf = (key) => METRICS.find((m) => m.key === key)

/* Umami's series ("2026-10-03 00:00:00" in our zone) onto bucket starts; weeks fold from days */
const toBuckets = (rows, buckets, unit) => {
  const out = buckets.map(() => 0)
  const idx = new Map(buckets.map((b, i) => [b, i]))
  for (const r of rows || []) {
    const t = new Date(r.x.replace(' ', 'T')).getTime()
    let i = idx.get(t)
    if (i == null && unit === 'week') { i = buckets.findLastIndex((b) => b <= t) }
    if (i != null && i >= 0) out[i] += r.y
  }
  return out
}
const nextOf = (buckets, i, end) => (i + 1 < buckets.length ? buckets[i + 1] - 1 : end)

async function pool(tasks, n = 6) {
  const out = []
  let i = 0
  await Promise.all(Array.from({ length: n }, async () => { while (i < tasks.length) { const k = i++; out[k] = await tasks[k]() } }))
  return out
}

/* one series per period: visitors and pageviews from /pageviews; the rest from /stats per bucket */
export async function seriesFor(metric, period, unit, filters, weekStart) {
  const buckets = bucketsOf(period, unit, weekStart)
  const f = filterParams(filters)
  if (metric === 'visitors' || metric === 'pageviews') {
    const j = await umami('/pageviews', { startAt: period.start, endAt: period.end, unit: unit === 'week' ? 'day' : unit, timezone: TZ, ...f })
    return { buckets, values: toBuckets(metric === 'visitors' ? j?.sessions : j?.pageviews, buckets, unit) }
  }
  const m = metric === 'bounces' ? { of: (s) => s.bounces } : metricOf(metric)
  const stats = await pool(buckets.map((b, i) => () => umami('/stats', { startAt: b, endAt: nextOf(buckets, i, period.end), ...f })))
  return { buckets, values: stats.map((s) => (s ? m.of(s) : 0)) }
}

export default function Stats(props) {
  return props.variant === 'colour' ? <ColourStats {...props} /> : <PlausibleStats {...props} />
}

/* /demo-11 (14.3): Visitors · Combined, and a ⋮ that picks Combined's series — counts only, one axis. New / returning
 * are not offered: Umami gives them for no arbitrary range, and they are never borrowed from another (plan 14.3) */
const COMBINED = [
  { key: 'visitors', label: 'Visitors', color: 'var(--kol-palette-blue)' },
  { key: 'visits', label: 'Visits', color: 'var(--kol-palette-teal)' },
  { key: 'pageviews', label: 'Pageviews', color: 'var(--kol-palette-green)' },
  { key: 'bounces', label: 'Bounces', color: 'var(--kol-palette-red)' },
]
const viewsOf = (title) => [{ id: 'trend', label: title }, { id: 'combined', label: 'Combined' }]
function Combined({ picked, period, unit, filters, weekStart, onPick }) {
  const keys = COMBINED.filter((c) => picked.includes(c.key))
  const data = useAsync(() => Promise.all(keys.map((c) => seriesFor(c.key, period, unit, filters, weekStart))), JSON.stringify([picked, period, unit, filters, weekStart]))
  /* picking a series re-keys the request, but the last result (one series short) is still `data` until the new one
   * lands — a stale result is not drawn, so a pick never reads past its end */
  const multi = data.data?.length === keys.length ? keys.map((c, i) => ({ ...c, buckets: data.data[i].buckets, values: data.data[i].values })) : null
  return (
    <ChartWithLegend items={keys.map((c, i) => ({ ...c, value: multi ? fmtNum(multi[i].values.reduce((a, b) => a + b, 0)) : '' }))}>
      <TrendChart metric={metricOf('visitors')} multi={multi || []} loading={data.loading} unit={unit} period={period} onPick={onPick} height="fill" fit />
    </ChartWithLegend>
  )
}

/* the chart under a head: Combined's several series, or the one metric */
function Body({ view, picked, metric, chartKey, series, color, period, unit, filters, weekStart, comparison, onPickBucket }) {
  return view === 'combined'
    ? <Combined picked={picked} period={period} unit={unit} filters={filters} weekStart={weekStart} onPick={onPickBucket} />
    : <ChartWithLegend><TrendChart metric={metricOf(chartKey)} series={series.data} loading={series.loading} unit={unit} period={period} comparison={comparison} onPick={onPickBucket} color={color} height="fill" fit /></ChartWithLegend>
}

function PlausibleStats({ period, comparison, unit, filters, metric, setMetric, onPickBucket, weekStart }) {
  const [view, setView] = useState('trend')
  const [picked, setPicked] = useState(['visitors', 'pageviews', 'bounces'])
  const f = filterParams(filters)
  const key = JSON.stringify([period, comparison, filters])
  const stats = useAsync(() => Promise.all([
    umami('/stats', { startAt: period.start, endAt: period.end, ...f }),
    comparison ? umami('/stats', { startAt: comparison.start, endAt: comparison.end, ...f }) : null,
  ]), key)
  const series = useAsync(() => Promise.all([
    seriesFor(metric, period, unit, filters, weekStart),
    comparison ? seriesFor(metric, comparison, unit, filters, weekStart) : null,
  ]), JSON.stringify([key, metric, unit, weekStart]))
  const [now, then] = stats.data || []
  const items = METRICS.map((m) => ({
    key: m.key,
    label: m.label,
    value: now ? m.fmt(m.of(now)) : '…',
    change: now && then && <ChangeBadge now={m.of(now)} then={m.of(then)} lowerIsBetter={m.lowerIsBetter} />,
    range: comparison && formatRange(period),
    compare: comparison && { value: then ? m.fmt(m.of(then)) : '…', range: formatRange(comparison) },
    /* plausible.io: the exact count on hover ("2,466,007 vs. 2,082,026 total pageviews") */
    exact: m.fmt === fmtNum && now
      ? `${m.of(now).toLocaleString('en-GB')}${then ? ` vs. ${m.of(then).toLocaleString('en-GB')}` : ''} ${m.label.toLowerCase()}`
      : null,
  }))
  const title = metricOf(metric).label
  return (
    <TopStats items={items} selected={metric} onSelect={setMetric}>
      <ChartHead title={title} view={view} views={viewsOf(title)} onView={setView} seriesOptions={COMBINED} picked={picked} onPicked={setPicked} />
      <Body view={view} picked={picked} chartKey={metric} series={series} period={period} unit={unit} filters={filters} weekStart={weekStart} comparison={comparison} onPickBucket={onPickBucket} />
    </TopStats>
  )
}

/* ── the colour tile row (/demo-8, an option in the settings rail): the main site and its top subdomain first, then
 * four metrics; a dot in each one's colour, the change against the previous period always shown, the picked tile lit
 * and underlined in its colour, the chart drawn in it ── */
const COLOUR_TILES = [
  { key: 'host:main', color: 'var(--kol-palette-yellow)' },
  { key: 'host:sub', color: 'var(--kol-palette-teal)' },
  { key: 'visitors', label: 'Visitors', color: 'var(--kol-palette-blue)' },
  { key: 'pageviews', label: 'Pageviews', color: 'var(--kol-palette-green)' },
  { key: 'duration', label: 'Avg session', color: 'var(--kol-palette-purple)' },
  { key: 'bounce', label: 'Bounce rate', color: 'var(--kol-palette-orange)' },
]
const MAIN_HOST = 'kolkrabbi.io'

function ColourStats({ period, unit, filters, metric, setMetric, onPickBucket, weekStart }) {
  const [view, setView] = useState('trend')
  const [picked, setPicked] = useState(['visitors', 'pageviews', 'bounces'])
  const prev = comparisonOf('previous', period)
  const f = filterParams(filters)
  const key = JSON.stringify([period, filters])
  const data = useAsync(() => Promise.all([
    umami('/stats', { startAt: period.start, endAt: period.end, ...f }),
    umami('/stats', { startAt: prev.start, endAt: prev.end, ...f }),
    umami('/metrics', { startAt: period.start, endAt: period.end, type: 'hostname', ...f }),
    umami('/metrics', { startAt: prev.start, endAt: prev.end, type: 'hostname', ...f }),
  ]), key)
  const [now, then, hostsNow, hostsThen] = data.data || []
  const hostVal = (list, h) => (Array.isArray(list) ? list.find((r) => r.x === h)?.y ?? 0 : null)
  const sub = (Array.isArray(hostsNow) ? hostsNow : []).map((r) => r.x).find((h) => h && h !== MAIN_HOST && !isDevHost(h) && h.endsWith(`.${MAIN_HOST}`))
  const hostOf = (k) => (k === 'host:main' ? MAIN_HOST : k === 'host:sub' ? sub : null)

  const tiles = COLOUR_TILES.map((t) => {
    const host = hostOf(t.key)
    if (t.key.startsWith('host:')) {
      return { ...t, host, label: host ? (host === MAIN_HOST ? host : host.split('.')[0]) : '…', now: host ? hostVal(hostsNow, host) : null, then: host ? hostVal(hostsThen, host) : null, fmt: fmtNum, dk: 'visitors' }
    }
    const m = metricOf(t.key)
    return { ...t, now: now ? m.of(now) : null, then: then ? m.of(then) : null, fmt: m.fmt, dk: t.key }
  })
  const pick = tiles.find((t) => t.key === metric) || tiles[2]
  const chartKey = pick.host ? 'visitors' : pick.key
  const chartFilters = pick.host ? [...filters, { key: 'hostname', op: 'eq', value: pick.host }] : filters
  const series = useAsync(() => Promise.all([seriesFor(chartKey, period, unit, chartFilters, weekStart), null]),
    JSON.stringify([key, pick.key, pick.host, unit, weekStart]))

  const title = pick.host ? `${pick.host} visitors` : pick.label
  const kindOf = (k) => (k === 'duration' ? 'duration' : k === 'bounce' ? 'rate' : 'count')
  return (
    <TopStats variant="colour" selected={pick.key} onSelect={setMetric}
      items={tiles.map((t) => ({ key: t.key, label: t.label, color: t.color, value: t.now != null ? t.fmt(t.now) : '…', delta: <DeltaBadge kind={kindOf(t.dk)} now={t.now} then={t.then} variant="canvas" /> }))}>
      <ChartHead title={title} view={view} views={viewsOf(title)} onView={setView} seriesOptions={COMBINED} picked={picked} onPicked={setPicked} />
      <Body view={view} picked={picked} chartKey={chartKey} series={series} color={pick.color} period={period} unit={unit} filters={filters} weekStart={weekStart} onPickBucket={onPickBucket} />
    </TopStats>
  )
}
