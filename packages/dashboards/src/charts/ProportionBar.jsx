/** ProportionBar — a whole split into its shares as one 8px bar: a segment per share, 3 apart, each as wide as its
 * share (float-everything W10 row 156, 2026-11-04; the exploration's devices / browsers split).
 *
 * `segments` are `[{ value, color?, label? }]`; widths follow value / total. Without `color` the segments step down
 * the ink ladder — fg-96 · fg-48 · fg-16 · fg-08 — so the largest share reads first. `label` goes on the segment's
 * `title`. Full width; `height` (8). */
const LADDER = ['var(--kol-fg-96)', 'var(--kol-fg-48)', 'var(--kol-fg-16)', 'var(--kol-fg-08)']

export default function ProportionBar({ segments = [], height = 8, className = '' }) {
  const total = segments.reduce((n, s) => n + (s.value ?? 0), 0) || 1
  return (
    <div className={`flex w-full gap-[3px] ${className}`.trim()} style={{ height }} role="img" aria-label={segments.map((s) => `${s.label ?? ''} ${Math.round(((s.value ?? 0) / total) * 100)}%`).join(', ')}>
      {segments.map((s, i) => (
        <span key={s.key ?? s.label ?? i} title={s.label} className="block h-full"
          style={{ width: `${((s.value ?? 0) / total) * 100}%`, background: s.color ?? LADDER[Math.min(i, LADDER.length - 1)] }} />
      ))}
    </div>
  )
}
