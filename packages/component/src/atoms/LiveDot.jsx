/**
 * LiveDot — A live count with its pulse. `● 8 active visitors` (float-everything W2 row 30, 2026-11-04 — the
 * exploration's live visitors line). An 8px dot in the success ink that breathes (still under reduced motion), the
 * count in mono 32 medium at the emphasis ink, the words in the float body role at fg-72.
 *
 * @param {number|string} count
 * @param {string} [label]       the words after the count (`active visitors`)
 * @param {boolean} [live]       the dot and its pulse (default true; false draws the count alone)
 * @param {string} [className]
 */
export default function LiveDot({ count, label, live = true, className = '' }) {
  return (
    <span className={`inline-flex items-center gap-3 ${className}`.trim()}>
      {live && <span aria-hidden="true" className="h-2 w-2 shrink-0 rounded-full bg-[var(--ui-success)] motion-safe:animate-pulse" />}
      <span className="font-mono text-[32px] font-medium leading-none text-fg-emphasis tabular-nums">{count}</span>
      {label && <span className="kol-float-body text-fg-72">{label}</span>}
    </span>
  )
}
