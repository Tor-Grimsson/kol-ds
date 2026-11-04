/** WeeklyBars — a rhythm as bars: one column a week, the count over it, the dates under it, the current week in the ink
 * (float-everything W10 row 155, 2026-11-04; the exploration's "13 · 19 · 24 · 31 over 01–07 … 22–28").
 *
 * `weeks` are `[{ count, label, current? }]`; bars scale to the largest count within `height` (72). Counts in mono
 * timecode, dates in ruler; a bar is fg-16, the `current` one the ink. Columns share the width, 16 apart. */
export default function WeeklyBars({ weeks = [], height = 72, className = '' }) {
  const max = Math.max(1, ...weeks.map((w) => w.count ?? 0))
  return (
    <div className={`flex items-end gap-4 ${className}`.trim()}>
      {weeks.map((w) => (
        <div key={w.key ?? w.label} className="flex-1 min-w-0 flex flex-col items-center gap-1.5">
          <span className="kol-float-timecode text-fg-72 tabular-nums">{w.count}</span>
          <span className={`block w-full ${w.current ? 'bg-fg-96' : 'bg-fg-16'}`} style={{ height: Math.max(2, Math.round(((w.count ?? 0) / max) * height)) }} />
          <span className="kol-float-ruler text-fg-64 whitespace-nowrap">{w.label}</span>
        </div>
      ))}
    </div>
  )
}
