/* A trend line over time buckets: the y axis fits the data (a fixed label column, so the plot never moves with the
 * label length), the comparison period a faint second line, the unfinished current period dotted, a tooltip on hover
 * (right click pins it), a click on `onPick(bucket, unit)` for day, week and month. `multi` draws several count series
 * on the one axis. `series` is `[cur, prev]`, each `{ buckets, values }`; `metric` is `{ key, label, fmt }`;
 * `height="fill"` takes the height its card gives it, 420 at least. */
import { useEffect, useRef, useState } from 'react'
import { formatCount, formatDuration, formatTick, formatBucket } from '../shared/formatSeries.js'

const niceMax = (v) => {
  if (v <= 0) return 4
  const p = 10 ** Math.floor(Math.log10(v))
  for (const s of [1, 2, 2.5, 5, 10]) if (s * p * 4 >= v) return s * p * 4
  return v
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
export default function TrendChart({ metric, series, loading, unit, period, onPick, color = 'var(--kol-palette-blue)', height: heightProp = H, fit = false, multi }) {
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
  const tickFmt = metric.key === 'duration' ? formatDuration : metric.key === 'bounce' ? (v) => `${Math.round(v)}%` : formatCount

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
          <text key={b} x={x(i)} y={height - 6} textAnchor="middle" className="kol-helper-10" fill="var(--kol-fg-48)">{formatTick(b, unit)}</text>
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
          <div className="kol-helper-10 uppercase tracking-wide text-fg-64 mb-2">{multi ? formatBucket(cur.buckets[shown], unit) : metric.label}</div>
          {multi && multi.map((m) => (
            <div key={m.key} className="flex items-center gap-3 kol-helper-12">
              <span className="w-2 h-2 rounded-full" style={{ background: m.color }} />
              <span className="flex-1 text-fg-80">{m.label}</span>
              <span className="text-fg-96">{formatCount(m.values[shown])}</span>
            </div>
          ))}
          {!multi && <div className="flex items-center gap-3 kol-helper-12">
            <span className="w-2 h-2 rounded-full" style={{ background: 'var(--kol-palette-blue)' }} />
            <span className="flex-1 text-fg-80">{formatBucket(cur.buckets[shown], unit)}</span>
            <span className="text-fg-96">{fmt(cur.values[shown])}</span>
          </div>}
          {prev && prev.buckets[shown] != null && (
            <div className="flex items-center gap-3 kol-helper-12 mt-1">
              <span className="w-2 h-2 rounded-full opacity-40" style={{ background: 'var(--kol-palette-blue)' }} />
              <span className="flex-1 text-fg-56">{formatBucket(prev.buckets[shown], unit)}</span>
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
