import { toHours } from './calendarDates.js'

/* taxonomy-ok: organism — a whole calendar region: the all-day lane over the hours */

const HOUR = 25

/**
 * CalendarDay — One day: what lasts all of it, then the hours. `All day · 07:00 … 19:00` (float-everything W11 row
 * 161, 2026-11-04 — kol-float--style W2.11 `Day calendar`). On the page ground at the sheet radius: a 62 all-day lane
 * (`All day` in `kol-float-label`, fg-64, 18 in; each all-day item a 32 bar on fg-16, radius 8, its label in
 * `kol-float-hint`), then one 25 row per hour with the time in `kol-float-ruler` in a 110 gutter. A timed event is an
 * fg-16 block across the lane from its start to its end; `now` draws a 1px line of the ink across the lane with
 * `nowLabel` over its end. No gridlines (no-borders law) — the gutter's times are the scale.
 *
 * @param {Array}    [allDay]     `[{ label }]`
 * @param {Array}    [events]     `[{ start: 'HH:MM', end: 'HH:MM', label }]`
 * @param {number}   [from]       first hour shown (default 7)
 * @param {number}   [to]         last hour shown (default 19)
 * @param {string}   [now]        `HH:MM` — the current-time line; unset, none
 * @param {string}   [nowLabel]   default `Today`
 * @param {string}   [allDayLabel]  default `All day`
 * @param {string}   [className]
 */
export default function CalendarDay({ allDay = [], events = [], from = 7, to = 19, now, nowLabel = 'Today', allDayLabel = 'All day', className = '' }) {
  const hours = Array.from({ length: to - from + 1 }, (_, i) => from + i)
  const y = (t) => (toHours(t) - from) * HOUR + 4
  const nowY = now != null ? y(now) : null

  return (
    <div className={`overflow-hidden rounded-[var(--kol-float-menu-r)] bg-surface-primary pb-1 ${className}`.trim()}>
      <div className="flex min-h-[62px] items-center gap-4 pl-[18px] pr-[18px]">
        <span className="kol-float-label w-[76px] shrink-0 text-fg-64">{allDayLabel}</span>
        <div className="flex min-w-0 flex-1 flex-col gap-1 py-[15px]">
          {allDay.map((a, i) => (
            <span key={i} className="kol-float-hint flex h-8 items-center truncate rounded-[var(--kol-float-list-r)] bg-fg-16 px-4 text-fg-emphasis">{a.label}</span>
          ))}
        </div>
      </div>
      <div className="relative" style={{ height: hours.length * HOUR + 4 }}>
        {hours.map((h, i) => (
          <span key={h} className="kol-float-ruler absolute left-[18px] tabular-nums text-fg-64" style={{ top: i * HOUR + 5 }}>
            {String(h).padStart(2, '0')}:00
          </span>
        ))}
        {events.map((e, i) => (
          <span key={i} className="kol-float-label absolute left-[110px] right-[18px] flex items-start overflow-hidden rounded-[var(--kol-float-list-r)] bg-fg-16 px-3 py-1 text-fg-emphasis"
            style={{ top: y(e.start), height: Math.max(HOUR - 2, y(e.end) - y(e.start) - 2) }}>
            <span className="truncate">{e.label}</span>
          </span>
        ))}
        {nowY != null && (
          <>
            <span className="kol-float-label absolute right-[30px] text-fg-emphasis" style={{ top: nowY - 18 }}>{nowLabel}</span>
            <span className="absolute left-[110px] right-[18px] h-px bg-[var(--kol-surface-on-primary)]" style={{ top: nowY }} />
          </>
        )}
      </div>
    </div>
  )
}
