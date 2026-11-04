/**
 * SummaryLine — A label and its value on one line. `Estimated size · 18.4 MB` (float-everything W6 row 91, 2026-11-04 —
 * kol-float--style 46:3057): the label at the left in `kol-float-hint` on fg-64, the value at the right in
 * `kol-float-timecode` (JetBrains Mono 12) in the emphasis ink, tabular. The line under a form that says what the
 * action will produce; no rule above it — a gap does that.
 *
 * @param {ReactNode} label
 * @param {ReactNode} value
 * @param {string}    [className]
 */
export default function SummaryLine({ label, value, className = '' }) {
  return (
    <div className={`flex w-full items-baseline justify-between gap-4 ${className}`.trim()}>
      <span className="kol-float-hint min-w-0 truncate text-fg-64">{label}</span>
      <span className="kol-float-timecode shrink-0 tabular-nums text-fg-emphasis">{value}</span>
    </div>
  )
}
