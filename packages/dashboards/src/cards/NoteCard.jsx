/** NoteCard — a reading note: a mono eyebrow naming where it was taken, the note itself (float-everything W7 row 113,
 * 2026-11-04; the exploration's "READING NOTE / PAGE 125 · The intervals matter as much as the arrivals.").
 *
 * `eyebrow` in mono ruler, the note as `children` in Inter body. `onClick` makes it pressable (opens the passage). */
import { SHEET, PRESS } from './_shared/float.js'

export default function NoteCard({ eyebrow, children, onClick, className = '' }) {
  const Tag = onClick ? 'button' : 'section'
  return (
    <Tag type={onClick ? 'button' : undefined} onClick={onClick} className={`${SHEET} flex flex-col items-start text-left px-6 py-4 ${onClick ? PRESS : ''} ${className}`.trim()}>
      {eyebrow && <span className="kol-float-ruler text-fg-64 uppercase">{eyebrow}</span>}
      <p className="kol-float-body text-fg-96 mt-3 max-w-[44ch]">{children}</p>
    </Tag>
  )
}
