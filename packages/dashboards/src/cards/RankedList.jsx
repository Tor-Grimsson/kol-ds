/* RankedList — ranked rows (DashboardCardSet, 2026-11-03; metric's Report List / Row / Trend, carried verbatim).
 *
 * A column head (`column` left, `valueLabel` right), then up to `limit` rows: a bar behind the label sized by the row's
 * share of the largest, the value right (`display` or `format(value)`), the share of `total` beside it on hover, and a
 * trend arrow when the row carries `prev`. Rows are any `{ key?, label, value, icon?, display?, prev?, disabled? }`.
 * `onPick(row)` makes rows clickable (a `disabled` row is not). `loading` (with no rows yet) and `empty` fill the body.
 *
 * Phone (plausible.io's, kol-website metric 2026-11-03): labels 14 under md, 12 from md; rows 36 apart under md; a
 * long label wraps to two lines instead of cutting.
 *
 * `variant="float"` (float-everything W7, 2026-11-04): the rows in Inter — labels body 14, the head in label, values in
 * mono timecode — the share bar at the 8 list round, lifted to fg-16 on hover (W0.7). The anatomy is the same. */
import { Button, useMediaQuery } from '@kolkrabbi/kol-component'
import { Icon } from '@kolkrabbi/kol-icons'

/* the compact count: 1.2k · 120k · 1.2M */
const fmtNum = (n) => {
  if (n == null || Number.isNaN(n)) return '0'
  const a = Math.abs(n)
  if (a >= 1e6) return `${+(n / 1e6).toFixed(1)}M`
  if (a >= 1e5) return `${Math.round(n / 1e3)}k`
  if (a >= 1e3) return `${+(n / 1e3).toFixed(1)}k`
  return `${Math.round(n * 100) / 100}`
}

export default function RankedList({ rows, total, column, valueLabel = 'Visitors', onPick, loading, empty = 'No data yet', limit = 9, format = fmtNum, variant }) {
  const shown = (rows || []).slice(0, limit)
  const max = Math.max(1, ...shown.map((r) => r.value))
  const md = useMediaQuery('(min-width: 768px)')
  const float = variant === 'float'
  const type = float ? 'kol-float-body' : md ? 'kol-helper-12' : 'kol-helper-14'
  const head = float ? 'kol-float-label text-fg-64' : 'kol-helper-12 text-fg-48'
  return (
    <div className="flex flex-col flex-1 pt-4 min-h-0">
      <div className={`flex items-center justify-between ${head} pb-2`}>
        <span>{column}</span>
        <span>{valueLabel}</span>
      </div>
      {loading && !rows ? (
        <div className={`flex-1 flex items-center justify-center ${head} py-16`}>Loading…</div>
      ) : !shown.length ? (
        <div className={`flex-1 flex items-center justify-center ${head} py-16`}>{empty}</div>
      ) : (
        <div className="flex flex-col gap-1 md:gap-[var(--kol-gap-wall-list)]">
          {shown.map((r) => (
            <Row key={r.key ?? r.label} r={r} max={max} total={total} type={type} float={float} format={format} onPick={onPick && !r.disabled ? () => onPick(r) : null} />
          ))}
        </div>
      )}
    </div>
  )
}

function Row({ r, max, total, type, float, format, onPick }) {
  const pct = total ? Math.round((r.value / total) * 1000) / 10 : null
  return (
    <div className="group grid items-center gap-4" style={{ gridTemplateColumns: 'minmax(0, 1fr) auto' }}>
      <Button
        variant="bare"
        disabled={!onPick}
        onClick={onPick || undefined}
        className={`relative min-h-8 min-w-0 text-left ${onPick ? 'cursor-pointer' : 'cursor-default'}${float ? ' focus-visible:outline-none focus-visible:shadow-[var(--kol-float-focus)] rounded-[var(--kol-float-list-r)]' : ''}`}
      >
        <span
          className={`absolute inset-y-0 left-0 transition-colors ${float ? 'rounded-[var(--kol-float-list-r)] bg-fg-08 group-hover:bg-fg-16' : 'rounded bg-fg-08 group-hover:bg-fg-12'}`}
          style={{ width: `${Math.max(1.5, (r.value / max) * 100)}%` }}
        />
        <span className={`relative flex items-center gap-2 min-h-8 py-1.5 px-2 ${type} text-fg-88 min-w-0`}>
          {r.icon}
          <span className="min-w-0 [overflow-wrap:anywhere] line-clamp-2">{r.label}</span>
        </span>
      </Button>
      <span className={`flex items-center gap-1.5 ${float ? 'kol-float-timecode' : 'kol-helper-12'} text-fg-96 tabular-nums justify-end`} style={{ minWidth: '7ch' }}>
        {pct != null && <span className="text-fg-56 pr-2 opacity-0 group-hover:opacity-100 transition-opacity">{pct}%</span>}
        {r.display ?? format(r.value)}
        {r.prev !== undefined && <Trend now={r.value} then={r.prev} />}
      </span>
    </div>
  )
}

const Trend = ({ now, then }) => {
  if (!then && !now) return null
  const up = now >= (then || 0)
  if (now === then) return <span className="w-3" />
  return <Icon name={up ? 'arrow-upright' : 'arrow-downright'} size={12} style={{ color: up ? 'var(--ui-success)' : 'var(--ui-error)' }} />
}
