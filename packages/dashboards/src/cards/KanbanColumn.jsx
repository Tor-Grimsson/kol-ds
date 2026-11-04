/** KanbanColumn — a board column: the lane's title with its count, then its cards stacked (float-everything W7 row 104,
 * 2026-11-04; the exploration's "Lobby · 1" holding a CaptureCard).
 *
 * The column sits in the well (`--kol-float-well`) so the sheets inside it read as cards on a lane; 20 radius, 12 inset.
 * `title` in Inter body, `count` in mono at the right. `children` are the cards (CaptureCard, TaskCard…). */
import { WELL } from './_shared/float.js'

export default function KanbanColumn({ title, count, children, className = '' }) {
  return (
    <section className={`flex flex-col rounded-[var(--kol-float-menu-r)] p-3 min-w-0 ${className}`.trim()} style={WELL}>
      <header className="flex items-baseline justify-between gap-3 px-2 pt-1.5 pb-4">
        <span className="kol-float-body text-fg-96 truncate">{title}</span>
        {count != null && <span className="kol-float-timecode text-fg-64 shrink-0 tabular-nums">{count}</span>}
      </header>
      <div className="flex flex-col gap-3">{children}</div>
    </section>
  )
}
