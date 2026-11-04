/* The numbers row and the chart as one card (8.7), as on plausible.io: six metric tabs, each with its value, change and
 * date range — and the comparison's value and range under it when Compare is on — over the selected metric's chart,
 * with the comparison as a faint second line, the unfinished current period dotted, and a tooltip on hover. */
import { useEffect, useRef, useState } from 'react'
import { Icon } from '@kolkrabbi/kol-icons'
import { Button, Tooltip, SegmentedToggle, TabsRow, MenuMore } from '@kolkrabbi/kol-component'
import { LineChart, Card, StatTiles } from '@kolkrabbi/kol-dashboards'
import { useNine, useTen, useEleven } from './nine.js'
import { dailyToSeries } from './Sections.jsx'
import { umami, useAsync, filterParams, bucketsOf, fmtNum, fmtDuration, fmtRange, fmtBucket, fmtTick, comparisonOf, isDevHost } from './data.js'

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

export function Change({ now, then, lowerIsBetter }) {
  if (then == null) return null
  if (!then && !now) return <span className="kol-helper-12 text-fg-48">0%</span>
  const pct = then ? Math.round(((now - then) / then) * 100) : 100
  const up = pct >= 0
  const good = lowerIsBetter ? !up : up
  return (
    <span className="inline-flex items-center gap-0.5 kol-helper-12" style={{ color: pct === 0 ? undefined : good ? 'var(--ui-success)' : 'var(--ui-error)' }}>
      {pct !== 0 && <Icon name={up ? 'arrow-upright' : 'arrow-downright'} size={12} />}
      {Math.abs(pct)}%
    </span>
  )
}

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

const niceMax = (v) => {
  if (v <= 0) return 4
  const p = 10 ** Math.floor(Math.log10(v))
  for (const s of [1, 2, 2.5, 5, 10]) if (s * p * 4 >= v) return s * p * 4
  return v
}

export default function TopStats(props) {
  return props.variant === 'colour' ? <ColourStats {...props} /> : <PlausibleStats {...props} />
}

/* /demo-9 (12.7): the chart says what it plots — the picked tile, and over which dates */
/* /demo-11 (14.3): Visitors · Combined, and a ⋮ that picks Combined's series — counts only, one axis. New / returning
 * are not offered: Umami gives them for no arbitrary range, and they are never borrowed from another (plan 14.3) */
const COMBINED = [
  { key: 'visitors', label: 'Visitors', color: 'var(--kol-palette-blue)' },
  { key: 'visits', label: 'Visits', color: 'var(--kol-palette-teal)' },
  { key: 'pageviews', label: 'Pageviews', color: 'var(--kol-palette-green)' },
  { key: 'bounces', label: 'Bounces', color: 'var(--kol-palette-red)' },
]
const ChartTitle11 = ({ title, view, setView, picked, setPicked }) => (
  /* the chips centred between the tile row's line and this header's rule: the card's 24 above, 24 under them (pb-6) */
  <div className="pb-4">
    <Card.Head title={view === 'combined' ? 'Combined' : title} rightPad="pb-6" right={<div className="flex items-center gap-1">
      <TabsRow variant="chip" size="sm" value={view} onChange={setView} ariaLabel="Chart" tabs={[{ id: 'trend', label: title }, { id: 'combined', label: 'Combined' }]} />
      <MenuMore label="Series" minWidth={200}
        items={COMBINED.map((c) => {
          const on = picked.includes(c.key)
          return { key: c.key, label: c.label, checked: on, icon: <span className="w-2 h-2 rounded-full" style={{ background: c.color }} />, onClick: () => setPicked((p) => (on ? p.filter((k) => k !== c.key) : [...p, c.key])) }
        })} />
    </div>} />
  </div>
)
/* /demo-11: the single-series chart keeps Combined's legend row, empty — switching views never changes the card's height */
const WithFoot = ({ children }) => (
  <div className="flex flex-col gap-5 flex-1 min-h-0">
    {children}
    <div className="flex flex-wrap gap-x-4 gap-y-1 invisible" aria-hidden><span className="flex items-center gap-1.5 kol-helper-12">&nbsp;</span></div>
  </div>
)
function Combined({ picked, period, unit, filters, weekStart, onPick }) {
  const keys = COMBINED.filter((c) => picked.includes(c.key))
  const data = useAsync(() => Promise.all(keys.map((c) => seriesFor(c.key, period, unit, filters, weekStart))), JSON.stringify([picked, period, unit, filters, weekStart]))
  /* picking a series re-keys the request, but the last result (one series short) is still `data` until the new one
   * lands — a stale result is not drawn, so a pick never reads past its end */
  const multi = data.data?.length === keys.length ? keys.map((c, i) => ({ ...c, buckets: data.data[i].buckets, values: data.data[i].values })) : null
  return (
    <div className="flex flex-col gap-5 flex-1 min-h-0">
      {/* gap-5: with the axis labels' own 4px under them, 24 from the dates to the legend */}
      <Chart metric={metricOf('visitors')} multi={multi || []} loading={data.loading} unit={unit} period={period} onPick={onPick} height="fill" fit />
      <div className="flex flex-wrap gap-x-4 gap-y-1">
        {keys.map((c, i) => (
          <span key={c.key} className="flex items-center gap-1.5 kol-helper-12 text-fg-64">
            <span className="w-2 h-2 rounded-full shrink-0" style={{ background: c.color }} />{c.label} {multi ? fmtNum(multi[i].values.reduce((a, b) => a + b, 0)) : ''}
          </span>
        ))}
      </div>
    </div>
  )
}

const ChartTitle = ({ title, period, view, setView }) => setView ? (
  /* /demo-10: the same header as every other card */
  <div className="pb-4">
    <Card.Head title={view === 'split' ? 'New / returning / bounced' : title} right={<>
      <TabsRow variant="chip" size="sm" value={view} onChange={setView} ariaLabel="Chart" tabs={[{ id: 'trend', label: title }, { id: 'split', label: 'New / returning / bounced' }]} />
      <span className="kol-helper-12 text-fg-48">{view === 'split' ? 'Last 30d' : fmtRange(period)}</span>
    </>} />
  </div>
) : (
  <div className="flex items-center justify-between gap-4 pt-6 pb-2">
    <span className="kol-helper-14 text-fg-96">{view === 'split' ? 'New / returning / bounced' : title}</span>
    <span className="flex items-center gap-4">
      {/* /demo-10 (13.4): the live page's Site Traffic split lives here, not as its own card */}
      {setView && <SegmentedToggle size="sm" value={view} onChange={setView} ariaLabel="Chart" options={[{ value: 'trend', label: title }, { value: 'split', label: 'New / returning / bounced' }]} />}
      <span className="kol-helper-12 text-fg-48">{view === 'split' ? 'Last 30d' : fmtRange(period)}</span>
    </span>
  </div>
)

/* the split: the live page's new / returning / bounced series (its data hook, its 30 days)
 * ponytail: the live hook's range is its own 30d, not the picker's — wire it if they must move together */
const SPLIT_LEGEND = [['New', 'green', 'win'], ['Returning', 'blue', 'draw'], ['Bounced', 'red', 'loss']]
const Split = ({ traffic }) => !traffic?.length ? <div className="kol-helper-12 text-fg-48 py-16 text-center">Loading…</div> : (
  <div className="flex flex-col gap-3">
    <LineChart series={dailyToSeries(traffic)} height={420} showArea />
    <div className="flex flex-wrap gap-x-4 gap-y-1">
      {SPLIT_LEGEND.map(([label, c, k]) => (
        <span key={k} className="flex items-center gap-1.5 kol-helper-12 text-fg-64">
          <span className="w-2 h-2 rounded-full shrink-0" style={{ background: `var(--kol-palette-${c})` }} />{label} {traffic.reduce((n, d) => n + d[k], 0)}
        </span>
      ))}
    </div>
  </div>
)

function PlausibleStats({ period, comparison, unit, filters, metric, setMetric, onPickBucket, weekStart, traffic }) {
  const nine = useNine()
  const ten = useTen()
  const eleven = useEleven()
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

  return (
    <section className={`${eleven ? 'bg-surface-secondary flex flex-col' : 'bg-surface-secondary'} rounded`} style={{ padding: 'var(--kol-pad-card-lg)' }}>
      <div className="overflow-hidden">
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 w-[calc(100%+1px)]">
        {METRICS.map((m) => {
          const sel = m.key === metric
          /* plausible.io: a hairline between tiles, and the exact count on hover ("2,466,007 vs. 2,082,026 total pageviews") */
          const exact = m.fmt === fmtNum && now
            ? `${m.of(now).toLocaleString('en-GB')}${then ? ` vs. ${m.of(then).toLocaleString('en-GB')}` : ''} ${m.label.toLowerCase()}`
            : null
          const tile = (
            <Button
              variant="bare"
              key={m.key}
              onClick={() => setMetric(m.key)}
              className={`w-full h-full text-left rounded px-3 py-3 transition-colors ${sel ? 'bg-fg-08' : 'hover:bg-fg-04'}`}
            >
              <div className={`kol-helper-12 uppercase tracking-wide ${sel ? 'text-fg-96' : 'text-fg-56'}`}>{m.label}</div>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="kol-mono-20 text-fg-96">{now ? m.fmt(m.of(now)) : '…'}</span>
                {now && then && <Change now={m.of(now)} then={m.of(then)} lowerIsBetter={m.lowerIsBetter} />}
              </div>
              {comparison && <div className="kol-helper-10 text-fg-48 mt-0.5">{fmtRange(period)}</div>}
              {comparison && (
                <>
                  <div className="kol-mono-16 text-fg-48 mt-2">{then ? m.fmt(m.of(then)) : '…'}</div>
                  <div className="kol-helper-10 text-fg-40 mt-0.5">{fmtRange(comparison)}</div>
                </>
              )}
            </Button>
          )
          return (
            <div key={m.key} className="px-1 border-r border-fg-08">
              {exact ? <Tooltip label={exact} placement="top" triggerClassName="block w-full h-full">{tile}</Tooltip> : tile}
            </div>
          )
        })}
      </div>
      </div>
      {eleven ? <ChartTitle11 title={metricOf(metric).label} view={view} setView={setView} picked={picked} setPicked={setPicked} />
        : nine && <ChartTitle title={metricOf(metric).label} period={period} view={view} setView={ten ? setView : null} />}
      {eleven && view === 'combined' ? <Combined picked={picked} period={period} unit={unit} filters={filters} weekStart={weekStart} onPick={onPickBucket} />
        : ten && view === 'split' ? <Split traffic={traffic} /> : eleven ? <WithFoot><Chart metric={metricOf(metric)} series={series.data} loading={series.loading} unit={unit} period={period} comparison={comparison} onPick={onPickBucket} {...(nine ? { height: eleven ? 'fill' : 420, fit: true } : {})} /></WithFoot> : <Chart metric={metricOf(metric)} series={series.data} loading={series.loading} unit={unit} period={period} comparison={comparison} onPick={onPickBucket} {...(nine ? { height: eleven ? 'fill' : 420, fit: true } : {})} />}
    </section>
  )
}

const H = 300
/* /demo-9 (12.7): the axis fits the data — the top tick is the smallest of 4 even steps that holds the peak, the steps
 * from a finer ladder, so the peak reaches ≥75% of the plot from ~8 up (a peak of 11 drew on 0–40) */
const FIT = [1, 1.2, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10]
const fitMax = (v) => {
  if (v <= 4) return 4
  const q = v / 4
  const p = 10 ** Math.floor(Math.log10(q))
  return FIT.find((s) => s * p >= q) * p * 4
}
const PAD = { top: 12, bottom: 28 }
const LABEL_W = 48 /* fixed y-label column (P8): the plot never moves with the label length */

/* `multi` (/demo-11, 14.3 Combined): several count series on the one axis — `[{ key, label, color, values }]` over the
 * first series' buckets; each a line in its colour, the tooltip a row per series. Unset, the chart is as it was. */
export function Chart({ metric, series, loading, unit, period, onPick, color = 'var(--kol-palette-blue)', height: heightProp = H, fit = false, multi }) {
  const wrap = useRef(null)
  const [w, setW] = useState(800)
  /* `height="fill"` (/demo-11, 15.6): the plot takes the height its card gives it, 420 at least */
  const filling = heightProp === 'fill'
  const [boxH, setBoxH] = useState(420)
  const height = filling ? boxH : heightProp
  const [hover, setHover] = useState(null)
  const [pinned, setPinned] = useState(null)
  useEffect(() => {
    const ro = new ResizeObserver(([e]) => { setW(e.contentRect.width); if (filling) setBoxH(Math.max(420, Math.round(e.contentRect.height))) })
    ro.observe(wrap.current)
    return () => ro.disconnect()
  }, [])
  const [cur, prev] = multi ? [multi[0] ? { buckets: multi[0].buckets, values: multi[0].values } : null, null] : (series || [])
  const n = cur?.values.length || 0
  const max = (fit ? fitMax : niceMax)(Math.max(0, ...(multi ? multi.flatMap((m) => m.values) : [...(cur?.values || []), ...(prev?.values || [])])))
  const plotW = Math.max(10, w - LABEL_W - 8)
  const x = (i) => LABEL_W + (n <= 1 ? plotW / 2 : (i / (n - 1)) * plotW)
  const y = (v) => PAD.top + (1 - v / max) * (height - PAD.top - PAD.bottom)
  const line = (vals, from = 0, to = vals.length) => vals.slice(from, to).map((v, k) => `${k ? 'L' : 'M'}${x(from + k)},${y(v)}`).join('')
  const incomplete = period.end >= Date.now() - 60000 && n > 1
  const solidTo = incomplete ? n - 1 : n
  const ticks = [0, 1, 2, 3, 4].map((k) => (max / 4) * k)
  const xEvery = Math.max(1, Math.ceil(n / Math.max(2, Math.floor(plotW / 110))))
  const shown = pinned ?? hover
  const clickable = unit === 'day' || unit === 'week' || unit === 'month'
  const fmt = metric.fmt
  const tickFmt = metric.key === 'duration' ? fmtDuration : metric.key === 'bounce' ? (v) => `${Math.round(v)}%` : fmtNum

  const pick = (e) => {
    const r = wrap.current.getBoundingClientRect()
    const i = Math.round(((e.clientX - r.left - LABEL_W) / plotW) * (n - 1))
    return n ? Math.min(n - 1, Math.max(0, i)) : null
  }

  return (
    <div
      ref={wrap}
      className={`relative mt-6 ${filling ? 'flex-1 min-h-[420px]' : ''}`}
      style={{ height: filling ? undefined : height, cursor: clickable && shown != null ? 'pointer' : 'default' }}
      onPointerMove={(e) => pinned == null && setHover(pick(e))}
      onPointerLeave={() => setHover(null)}
      onClick={(e) => { const i = pick(e); if (clickable && i != null) onPick(cur.buckets[i], unit) }}
      onContextMenu={(e) => { e.preventDefault(); setPinned(pinned == null ? pick(e) : null) }}
    >
      <svg width={w} height={height} className={`block overflow-visible ${filling ? 'absolute inset-0' : ''}`}>
        {ticks.map((t) => (
          <g key={t}>
            <line x1={LABEL_W} x2={LABEL_W + plotW} y1={y(t)} y2={y(t)} stroke="var(--kol-fg-08)" />
            <text x={0} y={y(t) + 4} className="kol-helper-10" fill="var(--kol-fg-48)">{tickFmt(t)}</text>
          </g>
        ))}
        {cur && cur.buckets.map((b, i) => (i % xEvery === 0 ? (
          <text key={b} x={x(i)} y={height - 6} textAnchor="middle" className="kol-helper-10" fill="var(--kol-fg-48)">{fmtTick(b, unit)}</text>
        ) : null))}
        {prev && <path d={line(prev.values.slice(0, n))} fill="none" stroke={color} strokeOpacity="0.35" strokeWidth="1.5" />}
        {multi && n > 0 && multi.map((m) => (
          <path key={m.key} d={line(m.values)} fill="none" stroke={m.color} strokeWidth="2" />
        ))}
        {!multi && cur && n > 0 && (
          <>
            <path d={`${line(cur.values)}L${x(n - 1)},${y(0)}L${x(0)},${y(0)}Z`} fill={color} fillOpacity="0.08" />
            <path d={line(cur.values, 0, solidTo)} fill="none" stroke={color} strokeWidth="2" />
            {incomplete && <path d={line(cur.values, n - 2, n)} fill="none" stroke={color} strokeWidth="2" strokeDasharray="3 4" />}
          </>
        )}
        {shown != null && cur && (
          <>
            <line x1={x(shown)} x2={x(shown)} y1={PAD.top} y2={height - PAD.bottom} stroke="var(--kol-fg-24)" />
            {multi
              ? multi.map((m) => <circle key={m.key} cx={x(shown)} cy={y(m.values[shown])} r="3.5" fill={m.color} />)
              : <circle cx={x(shown)} cy={y(cur.values[shown])} r="3.5" fill={color} />}
          </>
        )}
      </svg>
      {loading && <div className="absolute inset-0 flex items-center justify-center kol-helper-12 text-fg-48 pointer-events-none">Loading…</div>}
      {shown != null && cur && (
        <div
          className="absolute z-10 pointer-events-none bg-surface-primary border border-fg-08 rounded p-3 shadow-lg"
          style={{ top: 0, minWidth: 200, left: Math.min(Math.max(0, x(shown) + 12), w - 220) }}
        >
          <div className="kol-helper-10 uppercase tracking-wide text-fg-64 mb-2">{multi ? fmtBucket(cur.buckets[shown], unit) : metric.label}</div>
          {multi && multi.map((m) => (
            <div key={m.key} className="flex items-center gap-3 kol-helper-12">
              <span className="w-2 h-2 rounded-full" style={{ background: m.color }} />
              <span className="flex-1 text-fg-80">{m.label}</span>
              <span className="text-fg-96">{fmtNum(m.values[shown])}</span>
            </div>
          ))}
          {!multi && <div className="flex items-center gap-3 kol-helper-12">
            <span className="w-2 h-2 rounded-full" style={{ background: 'var(--kol-palette-blue)' }} />
            <span className="flex-1 text-fg-80">{fmtBucket(cur.buckets[shown], unit)}</span>
            <span className="text-fg-96">{fmt(cur.values[shown])}</span>
          </div>}
          {prev && prev.buckets[shown] != null && (
            <div className="flex items-center gap-3 kol-helper-12 mt-1">
              <span className="w-2 h-2 rounded-full opacity-40" style={{ background: 'var(--kol-palette-blue)' }} />
              <span className="flex-1 text-fg-56">{fmtBucket(prev.buckets[shown], unit)}</span>
              <span className="text-fg-64">{fmt(prev.values[shown])}</span>
            </div>
          )}
          <div className="border-t border-fg-08 mt-3 pt-2 kol-helper-10 text-fg-48 flex flex-col gap-0.5">
            {clickable && <span>Click to view {unit === 'month' ? 'month' : unit === 'week' ? 'week' : 'day'}</span>}
            <span>{pinned != null ? 'Right click to unpin tooltip' : 'Right click to pin tooltip'}</span>
          </div>
        </div>
      )}
    </div>
  )
}

/* ── the colour tile row (/demo-8, an option in the settings rail): the design canvas's KPI row (rounds 1–3) brought
 * back — the main site and its top subdomain first, then four metrics; a dot in each one's colour, the change against
 * the previous period always shown, the picked tile lit and underlined in its colour, the chart drawn in it ── */
const COLOUR_TILES = [
  { key: 'host:main', color: 'var(--kol-palette-yellow)' },
  { key: 'host:sub', color: 'var(--kol-palette-teal)' },
  { key: 'visitors', label: 'Visitors', color: 'var(--kol-palette-blue)' },
  { key: 'pageviews', label: 'Pageviews', color: 'var(--kol-palette-green)' },
  { key: 'duration', label: 'Avg session', color: 'var(--kol-palette-purple)' },
  { key: 'bounce', label: 'Bounce rate', color: 'var(--kol-palette-orange)' },
]
const MAIN_HOST = 'kolkrabbi.io'

/* the change as the canvas wrote it: % for counts, seconds for the session, points for the bounce rate */
function Delta({ k, now, then, canvas = false }) {
  if (then == null || now == null) return null
  let up, text, good
  if (k === 'duration') { const d = Math.round(now - then); up = d >= 0; text = fmtDuration(Math.abs(d)); good = up }
  else if (k === 'bounce') { const d = Math.round((now - then) * 10) / 10; up = d >= 0; text = `${Math.abs(d)} pts`; good = !up }
  else { const d = then ? Math.round(((now - then) / then) * 1000) / 10 : 100; up = d >= 0; text = `${Math.abs(d)}%`; good = up }
  /* /demo-9 (12.6): the canvas's own — 12px, the arrow as a glyph in the line, not an icon */
  if (canvas) return <span style={{ fontSize: 12, color: good ? 'var(--ui-success)' : 'var(--ui-error)' }}>{up ? '↗' : '↘'} {text}</span>
  return (
    <span className="inline-flex items-center gap-0.5 kol-helper-12" style={{ color: good ? 'var(--ui-success)' : 'var(--ui-error)' }}>
      <Icon name={up ? 'arrow-upright' : 'arrow-downright'} size={12} />{text}
    </span>
  )
}

function ColourStats({ period, unit, filters, metric, setMetric, onPickBucket, weekStart, traffic }) {
  const nine = useNine()
  const ten = useTen()
  const eleven = useEleven()
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

  return (
    <section className={`${eleven ? 'bg-surface-secondary flex flex-col' : 'bg-surface-secondary'} rounded overflow-hidden`} style={nine && !eleven ? { border: '1px solid var(--kol-oq-08)', borderRadius: 'var(--kol-radius-sm)' } : undefined}>
      <StatTiles size="lg" selected={pick.key} onSelect={setMetric}
        items={tiles.map((t) => ({ key: t.key, label: t.label, color: t.color, value: t.now != null ? t.fmt(t.now) : '…', delta: <Delta k={t.dk} now={t.now} then={t.then} canvas /> }))} />
      <div className={eleven ? 'flex-1 min-h-0 flex flex-col' : ''} style={{ padding: 'var(--kol-pad-card-lg)' }}>
        {eleven ? <ChartTitle11 title={pick.host ? `${pick.host} visitors` : pick.label} view={view} setView={setView} picked={picked} setPicked={setPicked} />
          : nine && <ChartTitle title={pick.host ? `${pick.host} visitors` : pick.label} period={period} view={view} setView={ten ? setView : null} />}
        {eleven && view === 'combined' ? <Combined picked={picked} period={period} unit={unit} filters={filters} weekStart={weekStart} onPick={onPickBucket} />
          : ten && view === 'split' ? <Split traffic={traffic} /> : eleven ? <WithFoot><Chart metric={metricOf(chartKey)} series={series.data} loading={series.loading} unit={unit} period={period} onPick={onPickBucket} color={pick.color} {...(nine ? { height: eleven ? 'fill' : 420, fit: true } : {})} /></WithFoot> : <Chart metric={metricOf(chartKey)} series={series.data} loading={series.loading} unit={unit} period={period} onPick={onPickBucket} color={pick.color} {...(nine ? { height: eleven ? 'fill' : 420, fit: true } : {})} />}
      </div>
    </section>
  )
}
