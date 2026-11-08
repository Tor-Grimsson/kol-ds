/* A chart (`children`) over a legend row of `items` `{ key, label, color, value? }`, 24 apart. Without items the row
 * is kept, empty and invisible, so switching a card between a legended and a plain chart never changes its height. */
export default function ChartWithLegend({ items, children }) {
  return (
    <div className="flex flex-col gap-5 flex-1 min-h-0">
      {children}
      {items
        ? (
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            {items.map((c) => (
              <span key={c.key} className="flex items-center gap-1.5 kol-helper-12 text-fg-64">
                <span className="w-2 h-2 rounded-full shrink-0" style={{ background: c.color }} />{c.label} {c.value ?? ''}
              </span>
            ))}
          </div>
        )
        : <div className="flex flex-wrap gap-x-4 gap-y-1 invisible" aria-hidden><span className="flex items-center gap-1.5 kol-helper-12">&nbsp;</span></div>}
    </div>
  )
}
