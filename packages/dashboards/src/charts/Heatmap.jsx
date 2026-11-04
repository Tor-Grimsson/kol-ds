import useChartTooltip from '../shared/useChartTooltip.js'
import DashTooltip from '../shared/DashTooltip.jsx'

/* `variant="dots"` (MetricDashboardUpstream, kol-website 2026-10-31 — metric's weekday × hour card): each cell is a dot
 * whose AREA follows the value ("bigger dot, more visitors"), in the scale's first colour; an empty cell keeps a 2px
 * speck so the grid still reads. Its labels are kol-helper-10 at fg-48, the hours sit on the grid's own columns, and
 * the day labels stop where the dots stop. Default stays the cells.
 * `fill`: a flex share of its column, not `h-full` — a percentage height inside a flex item resolves differently in
 * Firefox and pushed a card's foot into its bottom padding. */
const Heatmap = ({
  data = [],
  rows = [],
  cols = [],
  /* every Nth column label on the axis (the rest stay blank there); the tooltip always names the full label —
   * so a sparse axis never turns a hover into "C10" (user 2026-10-31) */
  colTick = 1,
  colorScale = ['var(--kol-palette-blue)', 'var(--kol-palette-yellow)'],
  cellSize = 32,
  fill = false,
  variant = 'cells',
}) => {
  const { activeIndex, handlers, containerHandlers, containerRef } = useChartTooltip()
  const dots = variant === 'dots'
  const label = dots ? 'kol-helper-10 text-fg-48' : 'dash-caption text-fg-64'

  const cells = Array.isArray(data[0])
    ? data.flatMap((row, r) => row.map((value, c) => ({ row: r, col: c, value })))
    : data

  const maxValue = Math.max(...cells.map(c => c.value), 1)
  const colCount = cols.length || (Array.isArray(data[0]) ? data[0].length : Math.max(...cells.map(c => c.col)) + 1)

  return (
    <div className={`flex gap-2 min-w-0${fill ? ' flex-1 min-h-0' : ''}`} ref={containerRef} {...containerHandlers}>
      {rows.length > 0 && (
        <div
          className="grid shrink-0 items-center"
          style={{ gridTemplateRows: `repeat(${rows.length}, ${fill ? '1fr' : `${cellSize}px`})`, gap: '4px', paddingBottom: dots && cols.length ? 24 : 0 }}
        >
          {rows.map((l, i) => (
            <span key={i} className={`${label} text-right`}>{l}</span>
          ))}
        </div>
      )}

      <div className="flex-1 flex flex-col gap-2 min-w-0 min-h-0">
        <div
          className={`grid gap-1${fill ? ' flex-1 min-h-0' : ''}`}
          style={{
            gridTemplateColumns: `repeat(${colCount}, 1fr)`,
            gridAutoRows: fill ? '1fr' : `${cellSize}px`
          }}
        >
          {cells.map((cell, idx) => {
            if (dots) {
              const d = cell.value ? 4 + Math.sqrt(cell.value / maxValue) * 7 : 2
              return (
                <div key={idx} className="flex items-center justify-center" {...handlers(idx)}>
                  <span className="rounded-full" style={{ width: d, height: d, background: cell.value ? colorScale[0] : 'var(--kol-fg-24)' }} />
                </div>
              )
            }
            const pct = Math.round((cell.value / maxValue) * 100)
            return (
              <div
                key={idx}
                className={`dash-heatmap-cell rounded-sm ${activeIndex === idx ? 'dash-chart-element--active' : ''}`}
                style={{
                  backgroundColor: `color-mix(in srgb, ${colorScale[1]} ${pct}%, ${colorScale[0]})`
                }}
                {...handlers(idx)}
              />
            )
          })}
        </div>

        {cols.length > 0 && (dots ? (
          <div className="grid gap-1 h-4 items-center" style={{ gridTemplateColumns: `repeat(${colCount}, 1fr)` }}>
            {cols.map((l, i) => (
              <span key={i} className={`${label} text-center leading-none`}>{i % colTick === 0 ? l : ''}</span>
            ))}
          </div>
        ) : (
          <div className="flex justify-around">
            {cols.map((l, i) => (
              <span key={i} className={`${label} text-center`}>{i % colTick === 0 ? l : ''}</span>
            ))}
          </div>
        ))}

        <DashTooltip visible={activeIndex !== null}>
          {activeIndex !== null && cells[activeIndex] && (
            <span className="dash-caption">
              {rows[cells[activeIndex].row] ?? `R${cells[activeIndex].row}`},{' '}
              {cols[cells[activeIndex].col] || `C${cells[activeIndex].col}`}:{' '}
              {cells[activeIndex].value}
            </span>
          )}
        </DashTooltip>
      </div>
    </div>
  )
}

export default Heatmap

/* CALENDAR (MetricDashboardUpstream, kol-website 2026-10-31 — metric's Deploy activity card): a year of days as GitHub
 * draws contributions — weeks across, Mon–Sun down, month labels over their first week, a square per day in five steps
 * (empty, then four of `color`), `CalendarScale` the Less → More key beside it. */
const STEP = (v, max) => (!v ? 0 : Math.min(4, 1 + Math.floor((v / max) * 3.999)))
const STEP_BG = (k, color) => (k ? `color-mix(in srgb, ${color} ${[0, 30, 55, 78, 100][k]}%, var(--kol-surface-secondary))` : 'var(--kol-oq-08)')

export function CalendarScale({ color = 'var(--kol-palette-blue)' }) {
  return (
    <span className="flex items-center gap-1">
      Less{[0, 1, 2, 3, 4].map((k) => <span key={k} className="w-2.5 h-2.5 rounded-[2px]" style={{ background: STEP_BG(k, color) }} />)}More
    </span>
  )
}

/* `days` — Map of 'YYYY-MM-DD' → count; `end` — the last day shown (default today); `weeks` columns back (default 53),
 * the last one `end`'s week, weeks start Monday; `label` names the count in the tooltip */
export function CalendarHeatmap({ days = new Map(), end = new Date(), weeks = 53, color = 'var(--kol-palette-blue)', label = 'deploys' }) {
  const { activeIndex, handlers, containerHandlers, containerRef } = useChartTooltip()
  const last = new Date(end.getFullYear(), end.getMonth(), end.getDate())
  const start = new Date(last); start.setDate(start.getDate() - (weeks - 1) * 7 - ((last.getDay() + 6) % 7))
  const cols = []
  for (let d = new Date(start); d <= last; d.setDate(d.getDate() + 1)) {
    const wi = Math.floor((d - start) / (7 * 86400000))
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    ;(cols[wi] ??= [])[(d.getDay() + 6) % 7] = { key, date: new Date(d), value: days.get(key) || 0 }
  }
  const max = Math.max(1, ...cols.flat().filter(Boolean).map((c) => c.value))
  const fmt = new Intl.DateTimeFormat('en-GB', { month: 'short' })
  /* the week columns where a month starts; a label within two columns of the next one is skipped, so a one-week month never prints "OctNov" */
  const starts = cols.flatMap((w, i) => {
    const first = w.find(Boolean)
    const prev = cols[i - 1]?.find(Boolean)
    return first && (!prev || first.date.getMonth() !== prev.date.getMonth()) ? [i] : []
  })
  const active = activeIndex !== null ? cols[Math.floor(activeIndex / 7)]?.[activeIndex % 7] : null
  return (
    <div className="relative flex gap-2 min-w-0" ref={containerRef} {...containerHandlers}>
      <div className="grid shrink-0 pt-5" style={{ gridTemplateRows: 'repeat(7, 1fr)', gap: 3 }}>
        {['Mon', '', 'Wed', '', 'Fri', '', ''].map((d, i) => <span key={i} className="kol-helper-10 text-fg-48 leading-none flex items-center">{d}</span>)}
      </div>
      <div className="flex-1 min-w-0">
        <div className="grid" style={{ gridTemplateColumns: `repeat(${cols.length}, 1fr)`, gap: 3 }}>
          {cols.map((w, i) => {
            const m = starts.includes(i) && !starts.some((j) => j > i && j - i <= 2) ? fmt.format(w.find(Boolean).date) : ''
            return <span key={`m${i}`} className="kol-helper-10 text-fg-48 h-4 whitespace-nowrap overflow-visible">{m}</span>
          })}
        </div>
        <div className="grid mt-1" style={{ gridTemplateColumns: `repeat(${cols.length}, 1fr)`, gridTemplateRows: 'repeat(7, auto)', gridAutoFlow: 'column', gap: 3 }}>
          {cols.flatMap((w, i) => Array.from({ length: 7 }, (_, r) => {
            const c = w[r]
            return <span key={`${i}-${r}`} {...(c ? handlers(i * 7 + r) : {})} className="aspect-square rounded-[2px]" style={{ background: c ? STEP_BG(STEP(c.value, max), color) : 'transparent' }} />
          }))}
        </div>
      </div>
      <DashTooltip visible={!!active}>
        {active && <span className="dash-caption">{active.key}: {active.value} {label}</span>}
      </DashTooltip>
    </div>
  )
}
