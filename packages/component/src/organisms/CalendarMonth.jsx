import { toDate, addDays, sameDay, weekStart, daysBetween, WEEKDAYS } from './calendarDates.js'

/* taxonomy-ok: organism — a whole calendar region: weekday head, six week rows, event bars */

/**
 * CalendarMonth — A month as a grid of weeks, with what runs across them. `MON … SUN` over six rows (float-everything
 * W11 row 159, 2026-11-04 — kol-float--style W2.11 `Month calendar`). On the page ground (`bg-surface-primary`) at the
 * sheet radius: a 40 head of weekdays in `kol-float-ruler` (fg-64), then one 60 row per week — the date in mono 11
 * at 16 in (fg-64; outside the month fg-40), today on a 25 disc of the ink, Saturday and Sunday on fg-02. An event is a
 * 16 bar on fg-16 (radius 4, 8 in from its cells) with its label in Inter 10, split at each week's edge and labelled
 * again where it resumes. No gridlines (the no-borders law): the columns read by alignment and the weekend tint.
 *
 * @param {string|Date} month      any day of the month to show (`2026-11` or `2026-11-03`)
 * @param {string|Date} [today]    lit on the disc
 * @param {Array}       [events]   `[{ start, end?, label }]` — dates as `YYYY-MM-DD`; `end` inclusive, default `start`
 * @param {string[]}    [weekdays] the head's words (default Mon … Sun)
 * @param {Function}    [onSelect] `(date: Date) => void` — a day pressed
 * @param {string}      [className]
 */
export default function CalendarMonth({ month, today, events = [], weekdays = WEEKDAYS, onSelect, className = '' }) {
  const m = toDate(String(month).length === 7 ? `${month}-01` : month)
  const first = new Date(m.getFullYear(), m.getMonth(), 1)
  const last = new Date(m.getFullYear(), m.getMonth() + 1, 0)
  const t = today ? toDate(today) : null
  const weeks = []
  for (let ws = weekStart(first); ws <= last; ws = addDays(ws, 7)) weeks.push(ws)
  const evs = events.map((e) => ({ ...e, s: toDate(e.start), e: toDate(e.end ?? e.start) }))

  return (
    <div className={`overflow-hidden rounded-[var(--kol-float-menu-r)] bg-surface-primary ${className}`.trim()}>
      <div className="grid h-10 grid-cols-7 items-center">
        {weekdays.map((d) => <span key={d} className="kol-float-ruler px-4 uppercase text-fg-64">{d}</span>)}
      </div>
      {weeks.map((ws) => {
        const we = addDays(ws, 6)
        const bars = evs.filter((e) => e.s <= we && e.e >= ws).map((e) => {
          const a = Math.max(0, daysBetween(ws, e.s))
          const b = Math.min(6, daysBetween(ws, e.e))
          return { label: e.label, a, b }
        })
        /* lanes: a bar takes the first lane whose last bar ended before it starts */
        const ends = []
        for (const bar of bars) {
          bar.lane = ends.findIndex((end) => end < bar.a)
          if (bar.lane < 0) bar.lane = ends.length
          ends[bar.lane] = bar.b
        }
        return (
          <div key={ws.toISOString()} className="relative grid grid-cols-7" style={{ minHeight: Math.max(60, 38 + ends.length * 20 + 2) }}>
            {Array.from({ length: 7 }, (_, i) => {
              const day = addDays(ws, i)
              const isToday = sameDay(day, t)
              const out = day.getMonth() !== m.getMonth()
              const Cell = onSelect ? 'button' : 'div'
              return (
                <Cell key={i} {...(onSelect ? { type: 'button', onClick: () => onSelect(day) } : {})}
                  className={`flex items-start px-4 pt-[9px] text-left ${i >= 5 ? 'bg-fg-02' : ''} ${onSelect ? 'cursor-pointer hover:bg-fg-04 focus-visible:outline-none focus-visible:shadow-[inset_var(--kol-float-focus)]' : ''}`.trim()}>
                  <span className={`kol-float-ruler inline-flex h-[25px] min-w-[25px] items-center justify-center rounded-full text-[11px] tabular-nums ${isToday ? '-ml-[7px] bg-[var(--kol-surface-on-primary)] text-[var(--kol-surface-primary)]' : out ? 'text-fg-40 justify-start' : 'text-fg-64 justify-start'}`}>
                    {day.getDate()}
                  </span>
                </Cell>
              )
            })}
            {bars.map((b, i) => (
              <span key={i} className="kol-float-label pointer-events-none absolute flex h-4 items-center truncate rounded-[4px] bg-fg-16 px-2 text-[10px] leading-none text-fg-emphasis"
                style={{ top: 38 + b.lane * 20, left: `calc(${(b.a / 7) * 100}% + 8px)`, width: `calc(${((b.b - b.a + 1) / 7) * 100}% - 16px)` }}>
                {b.label}
              </span>
            ))}
          </div>
        )
      })}
    </div>
  )
}
