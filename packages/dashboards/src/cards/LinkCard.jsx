/** LinkCard — an outbound link as a 66 row: the title, a mono meta line under it, ↗ at the right (float-everything W7
 * row 106, 2026-11-04; the exploration's "kolkrabbi.io · Studio site · ↗").
 *
 * An `<a>` when `href` is given (opens in a new tab), a button with `onClick` otherwise. Sits in the well with an 8
 * round (`--kol-float-list-r`); `title` in Inter panel, `meta` in mono ("Studio site", the url). */
import { IconLoader } from '@kolkrabbi/kol-icons'
import { PRESS, WELL } from './_shared/float.js'

export default function LinkCard({ title, meta, href, onClick, className = '' }) {
  const Tag = href ? 'a' : 'button'
  return (
    <Tag href={href} target={href ? '_blank' : undefined} rel={href ? 'noreferrer' : undefined} type={href ? undefined : 'button'} onClick={onClick}
      className={`flex items-center gap-4 w-full text-left rounded-[var(--kol-float-list-r)] px-4 py-3 min-w-0 ${PRESS} ${className}`.trim()} style={WELL}>
      <span className="flex-1 min-w-0 flex flex-col gap-1">
        <span className="kol-float-panel text-fg-96 truncate">{title}</span>
        {meta && <span className="kol-float-timecode text-fg-64 truncate">{meta}</span>}
      </span>
      <IconLoader name="arrow-upright" size={16} className="text-oq-64 shrink-0" />
    </Tag>
  )
}
