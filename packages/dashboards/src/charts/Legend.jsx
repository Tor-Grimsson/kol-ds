/** Legend — a chart's series key: a 16 × 2 swatch and the label per series, the interval word at the end
 * (float-everything W10 row 157, 2026-11-04; the exploration's "— This period · — Previous period · DAILY").
 *
 * `items` are `[{ label, color?, dashed? }]` — the first series in the ink, the rest at fg-48 unless `color` says
 * otherwise, `dashed` draws the swatch as the comparison line; `interval` ("DAILY") closes the row in mono. Mono
 * timecode throughout. `LineChart variant="float"` draws one from its `legend`. */
export default function Legend({ items = [], interval, className = '' }) {
  return (
    <div className={`flex items-center gap-4 kol-float-timecode whitespace-nowrap ${className}`.trim()}>
      {items.map((it, i) => (
        <span key={it.key ?? it.label} className="flex items-center gap-1.5">
          <span className="block w-4 h-0.5 shrink-0" aria-hidden="true"
            style={{ background: it.dashed ? `repeating-linear-gradient(90deg, ${it.color ?? 'var(--kol-fg-48)'} 0 3px, transparent 3px 5px)` : (it.color ?? (i === 0 ? 'var(--kol-surface-on-primary)' : 'var(--kol-fg-48)')) }} />
          <span className={i === 0 ? 'text-fg-72' : 'text-fg-64'}>{it.label}</span>
        </span>
      ))}
      {interval && <span className="text-fg-64 uppercase">{interval}</span>}
    </div>
  )
}
