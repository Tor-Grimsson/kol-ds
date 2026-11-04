/** FoldedHead — a folded card's heading as a pill: the title, its count and a ⌄ (float-everything W7 row 100,
 * 2026-11-04; the exploration's "Briefs · 1 · ⌄" at 40 high).
 *
 * A button: `onClick` expands the card it stands for. `title` in Inter panel, `count` in mono. Where a folded card
 * keeps its sheet (row 107), use `Card variant="float" folded`; this is the compact form for a stack of folded groups. */
import { Button } from '@kolkrabbi/kol-component'
import { Icon } from '@kolkrabbi/kol-icons'
import { PRESS } from './_shared/float.js'

export default function FoldedHead({ title, count, onClick, className = '' }) {
  return (
    <Button variant="bare" onClick={onClick} aria-expanded={false}
      className={`inline-flex items-center gap-3 h-10 pl-4 pr-3 rounded-full bg-surface-secondary text-left min-w-0 ${PRESS} ${className}`.trim()}>
      <span className="kol-float-panel text-fg-96 truncate">{title}</span>
      {count != null && <span className="kol-float-timecode text-fg-64 ml-auto tabular-nums">{count}</span>}
      <Icon name="chevron-down" size={16} className="text-oq-64 shrink-0" />
    </Button>
  )
}
