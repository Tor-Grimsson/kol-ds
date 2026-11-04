import { toDate } from './calendarDates.js'

/* taxonomy-ok: organism — a whole calendar region: month head, phase rows, today line */

const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

/**
 * CalendarTimeline — A year of phases on one scale. `PHASE · Jan … Dec`, one row per phase (float-everything W11 row
 * 158, 2026-11-04 — kol-float--style W2.11 `Timeline calendar`). On the page ground at the sheet radius: a 44 head
 * (`label` in `kol-float-ruler` over a 172 gutter, the months in `kol-float-label`, fg-64, 11 into each column), then
 * one 26 row per phase — its name in the gutter (`kol-float-label`, fg-64) and its bar on fg-16 (18 tall, radius 6,
 * 4 in from its ends) placed by its dates. An `emphasis` row is the span itself: its name in `kol-float-hint` on the
 * emphasis ink, a 7 bar on fg-64. `today` draws a 1px line of the ink down the rows. Month columns are equal; a date
 * lands by its day within its month. No gridlines (no-borders law).
 *
 * @param {number}      [year]      the year shown (default `today`'s, else this year)
 * @param {Array}       rows        `[{ label, start, end, emphasis? }]` — dates as `YYYY-MM-DD`, `end` inclusive
 * @param {string|Date} [today]
 * @param {string}      [label]     the gutter's head (default `Phase`)
 * @param {string[]}    [months]    the head's words (default Jan … Dec)
 * @param {string}      [className]
 */
export default function CalendarTimeline({ year, rows = [], today, label = 'Phase', months = MONTHS_SHORT, className = '' }) {
  const t = today ? toDate(today) : null
  const yr = year ?? (t ?? new Date()).getFullYear()
  /* a date as a share of the year: month index + the day within it, over 12 equal columns */
  const at = (d, end = false) => {
    if (d.getFullYear() < yr) return 0
    if (d.getFullYear() > yr) return 1
    const dim = new Date(yr, d.getMonth() + 1, 0).getDate()
    return (d.getMonth() + (d.getDate() - (end ? 0 : 1)) / dim) / 12
  }
  const pct = (f) => `${f * 100}%`

  return (
    <div className={`overflow-hidden rounded-[var(--kol-float-menu-r)] bg-surface-primary pb-3 ${className}`.trim()}>
      <div className="flex h-11 items-center">
        <span className="kol-float-ruler w-[172px] shrink-0 pl-5 uppercase text-fg-64">{label}</span>
        <div className="grid flex-1 grid-cols-12">
          {months.map((m) => <span key={m} className="kol-float-label pl-[11px] text-fg-64">{m}</span>)}
        </div>
      </div>
      <div className="relative flex flex-col">
        {rows.map((r, i) => {
          const a = at(toDate(r.start))
          const b = at(toDate(r.end ?? r.start), true)
          return (
            <div key={i} className="flex h-[26px] items-center">
              <span className={`w-[172px] shrink-0 truncate pl-5 ${r.emphasis ? 'kol-float-hint text-fg-emphasis' : 'kol-float-label text-fg-64'}`}>{r.label}</span>
              <div className="relative h-full flex-1">
                <span className={`absolute top-1/2 -translate-y-1/2 ${r.emphasis ? 'h-[7px] rounded-[4px] bg-fg-64' : 'h-[18px] rounded-[6px] bg-fg-16'}`}
                  style={{ left: `calc(${pct(a)} + 4px)`, width: `calc(${pct(b - a)} - 8px)` }} />
              </div>
            </div>
          )
        })}
        {t && t.getFullYear() === yr && (
          <span className="pointer-events-none absolute inset-y-0 left-[172px] right-0">
            <span className="absolute inset-y-0 w-px bg-[var(--kol-surface-on-primary)]" style={{ left: pct(at(t)) }} />
          </span>
        )}
      </div>
    </div>
  )
}
