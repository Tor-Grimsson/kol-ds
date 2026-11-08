/* A section's head card: a row of tiles over the selected metric's chart (`children`). `variant="plausible"`
 * (default) is `MetricTiles` inside the padded card; `variant="colour"` is `StatTiles size="lg"` flush to the card's
 * top with the chart in a padded body; `variant="realtime"` is a row of live tiles (`{ key, label, value, dot?, disabled? }`,
 * `dot` a pulsing live mark) in an auto-fit grid. `items` take each variant's tile shape (see MetricTiles, StatTiles). */
import { Button } from '@kolkrabbi/kol-component'
import MetricTiles from './MetricTiles.jsx'
import StatTiles from './StatTiles.jsx'

export default function TopStats({ variant = 'plausible', items, selected, onSelect, children }) {
  if (variant === 'realtime') {
    return (
      <section className="bg-surface-secondary rounded" style={{ padding: 'var(--kol-pad-card-lg)' }}>
        <div className="grid gap-2" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(200px, 100%), 1fr))' }}>
          {items.map((t) => {
            const sel = t.key === selected
            const click = !t.disabled
            return (
              <Button variant="bare" key={t.key} disabled={!click} onClick={() => click && onSelect?.(t.key)}
                className={`text-left rounded px-3 py-3 ${sel ? 'bg-fg-08' : click ? 'hover:bg-fg-04' : 'cursor-default'}`}>
                <div className={`kol-helper-12 uppercase tracking-wide ${sel ? 'text-fg-96' : 'text-fg-56'}`}>{t.label}</div>
                <div className="flex items-center gap-3 mt-1">
                  <span className="kol-mono-20 text-fg-96">{t.value}</span>
                  {t.dot && <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--ui-success)' }} />}
                </div>
              </Button>
            )
          })}
        </div>
        {children}
      </section>
    )
  }
  if (variant === 'colour') {
    return (
      <section className="bg-surface-secondary flex flex-col rounded overflow-hidden">
        <StatTiles size="lg" selected={selected} onSelect={onSelect} items={items} />
        <div className="flex-1 min-h-0 flex flex-col" style={{ padding: 'var(--kol-pad-card-lg)' }}>{children}</div>
      </section>
    )
  }
  return (
    <section className="bg-surface-secondary flex flex-col rounded" style={{ padding: 'var(--kol-pad-card-lg)' }}>
      <MetricTiles items={items} selected={selected} onSelect={onSelect} />
      {children}
    </section>
  )
}
