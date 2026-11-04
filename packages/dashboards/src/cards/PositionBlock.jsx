/** PositionBlock — the saved place in a book: a mono eyebrow, the chapter, the page and its share as a progress line
 * (float-everything W7 row 114, 2026-11-04; the exploration's "YOUR PLACE · The third interlude · Page 125 of 297 ·
 * 42%").
 *
 * `eyebrow` in mono ruler, `title` in Inter window, `page` + `pct` the 4px line (the ink at fg-64). `onClick` makes
 * the block pressable (resumes). Full width — it spans the reader's column. */
import { SHEET, PRESS } from './_shared/float.js'
import ProgressLine from './_shared/ProgressLine.jsx'

export default function PositionBlock({ eyebrow = 'Your place', title, page, pct = 0, onClick, className = '' }) {
  const Tag = onClick ? 'button' : 'section'
  return (
    <Tag type={onClick ? 'button' : undefined} onClick={onClick} className={`${SHEET} flex flex-col items-stretch text-left w-full px-6 pt-4 pb-5 ${onClick ? PRESS : ''} ${className}`.trim()}>
      <span className="kol-float-ruler text-fg-64 uppercase">{eyebrow}</span>
      <span className="kol-float-window text-fg-96 mt-2">{title}</span>
      <div className="mt-2"><ProgressLine label={page} pct={pct} light /></div>
    </Tag>
  )
}
