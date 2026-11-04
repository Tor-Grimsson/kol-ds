/* the float cards' progress line (float-everything W7, 2026-11-04; rows 105 · 109 · 114): a label left and the
 * percentage in mono right, then a track in fg-16 with the done share in the ink — 4px, or 6px for a project's
 * completion (`thick`). An optional `note` under it ("1 / 2 done"). Shared by ProjectCard, ContinueCard, PositionBlock. */
export default function ProgressLine({ label, pct = 0, note, thick = false, light = false }) {
  const h = thick ? 'h-1.5' : 'h-1'
  return (
    <div className="flex flex-col gap-2 min-w-0">
      <div className="flex items-baseline justify-between gap-4">
        <span className="kol-float-hint text-fg-64 truncate">{label}</span>
        <span className="kol-float-timecode text-fg-96 shrink-0 tabular-nums">{Math.round(pct)}%</span>
      </div>
      <div className={`${h} w-full rounded-full bg-fg-16 overflow-hidden`} role="progressbar" aria-valuenow={Math.round(pct)} aria-valuemin={0} aria-valuemax={100}>
        <div className={`${h} rounded-full ${light ? 'bg-fg-64' : 'bg-fg-96'}`} style={{ width: `${Math.min(100, Math.max(0, pct))}%` }} />
      </div>
      {note && <span className="kol-float-timecode text-fg-64">{note}</span>}
    </div>
  )
}
