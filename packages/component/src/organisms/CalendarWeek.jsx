import { toDate, addDays, sameDay, weekStart, WEEKDAYS } from './calendarDates.js'

/* taxonomy-ok: organism — a whole calendar region: seven day columns and the running list */

/**
 * CalendarWeek — A week as seven columns, and what runs through it. `MON 2 … SUN 8` (float-everything W11 row 160,
 * 2026-11-04 — kol-float--style W2.11 `Week calendar`). On the page ground at the sheet radius: each column 20 in, the
 * weekday in `kol-float-ruler` (fg-64), the date in Inter 17 under it (today on a 32 disc of the ink), the day's events
 * as fg-16 chips on the list radius; Saturday and Sunday on fg-02. With no events, `empty` sits along the columns'
 * foot. Under them, `running` — the phases that span the week — under its mono label: each a 92 card on
 * `surface-secondary` (radius 16) with a 7 × 38 marker in fg-64, the name in `kol-float-body-lg`, its meta in mono, the
 * range at the end. No gridlines (no-borders law).
 *
 * @param {string|Date} week          any day of the week to show
 * @param {string|Date} [today]
 * @param {Array}       [events]      `[{ date, label, time? }]`
 * @param {ReactNode}   [empty]       the line when no event shows
 * @param {Array}       [running]     `[{ label, meta?, range? }]`
 * @param {string}      [runningLabel]  default `Running this week`
 * @param {string[]}    [weekdays]
 * @param {Function}    [onSelect]    `(date: Date) => void`
 * @param {string}      [className]
 */
export default function CalendarWeek({ week, today, events = [], empty, running = [], runningLabel = 'Running this week', weekdays = WEEKDAYS, onSelect, className = '' }) {
  const ws = weekStart(toDate(week))
  const t = today ? toDate(today) : null
  const days = Array.from({ length: 7 }, (_, i) => addDays(ws, i))
  const evs = events.map((e) => ({ ...e, d: toDate(e.date) }))

  return (
    <div className={`overflow-hidden rounded-[var(--kol-float-menu-r)] bg-surface-primary ${className}`.trim()}>
      <div className="relative grid h-[213px] grid-cols-7">
        {days.map((day, i) => {
          const isToday = sameDay(day, t)
          const list = evs.filter((e) => sameDay(e.d, day))
          const Cell = onSelect ? 'button' : 'div'
          return (
            <Cell key={i} {...(onSelect ? { type: 'button', onClick: () => onSelect(day) } : {})}
              className={`flex min-w-0 flex-col items-start gap-1.5 px-5 pt-5 text-left ${i >= 5 ? 'bg-fg-02' : ''} ${onSelect ? 'cursor-pointer focus-visible:outline-none focus-visible:shadow-[inset_var(--kol-float-focus)]' : ''}`.trim()}>
              <span className="kol-float-ruler uppercase text-fg-64">{weekdays[i]}</span>
              <span className={`inline-flex h-8 min-w-8 items-center justify-center rounded-full font-[family-name:var(--kol-font-family-float)] text-[17px] tabular-nums ${isToday ? '-ml-[9px] bg-[var(--kol-surface-on-primary)] text-[var(--kol-surface-primary)]' : 'justify-start text-fg-emphasis'}`}>
                {day.getDate()}
              </span>
              {list.map((e, k) => (
                <span key={k} className="kol-float-label flex w-full min-w-0 flex-col rounded-[var(--kol-float-list-r)] bg-fg-16 px-2 py-1 text-fg-emphasis">
                  {e.time && <span className="kol-float-ruler text-fg-64">{e.time}</span>}
                  <span className="truncate">{e.label}</span>
                </span>
              ))}
            </Cell>
          )
        })}
        {empty && evs.length === 0 && <span className="kol-float-hint pointer-events-none absolute bottom-5 left-6 text-fg-64">{empty}</span>}
      </div>
      {running.length > 0 && (
        <div className="flex flex-col gap-4 px-6 pb-6 pt-8">
          <span className="kol-float-ruler uppercase text-fg-64">{runningLabel}</span>
          {running.map((r, i) => (
            <div key={i} className="flex h-[92px] items-center gap-4 rounded-2xl bg-surface-secondary px-5">
              <span className="h-[38px] w-[7px] shrink-0 rounded-[4px] bg-fg-64" />
              <span className="flex min-w-0 flex-1 flex-col gap-1">
                <span className="kol-float-body-lg truncate text-fg-emphasis">{r.label}</span>
                {r.meta && <span className="kol-float-ruler text-fg-64">{r.meta}</span>}
              </span>
              {r.range && <span className="kol-float-timecode shrink-0 text-fg-64">{r.range}</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
