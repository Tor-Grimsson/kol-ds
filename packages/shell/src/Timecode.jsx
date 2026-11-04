/* taxonomy-ok: atom — one line of the float's mono role */

/**
 * Timecode — The transport's readout (float-everything W5 row 70, 2026-11-04): the current position in
 * `kol-float-timecode` (the emphasis ink) and, 12 after it, `/ total` in the same role at oq-48. The transport draws it
 * in its own capsule (`AppFloatNav variant="transport" timecode`); alone, it is the line. The exploration's `Timecode`
 * (kol-float--style 9:9350).
 *
 * @param {string} current  the position ("00:04:12")
 * @param {string} total    the length ("00:12:00"); unset, the position alone
 * @param {string} className
 */
export default function Timecode({ current, total, className = '' }) {
  return (
    <span className={`kol-timecode kol-float-timecode inline-flex items-center gap-3 tabular-nums ${className}`.trim()}>
      <span className="text-emphasis">{current}</span>
      {total && <span className="text-oq-48">/ {total}</span>}
    </span>
  )
}
