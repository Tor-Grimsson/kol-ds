/* The selectable metric row of a TopStats card, as plausible.io draws it: a hairline between tiles, each with its
 * label, value and `change` (a node, e.g. a ChangeBadge), the `range` it covers and, when comparing, `compare`
 * `{ value, range }` under it; `exact` shows on hover. 2 · 3 · 6 across. */
import { Button, Tooltip } from '@kolkrabbi/kol-component'

export default function MetricTiles({ items, selected, onSelect }) {
  return (
    <div className="overflow-hidden">
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 w-[calc(100%+1px)]">
        {items.map((m) => {
          const sel = m.key === selected
          const tile = (
            <Button
              variant="bare"
              key={m.key}
              onClick={() => onSelect?.(m.key)}
              className={`w-full h-full text-left rounded px-3 py-3 transition-colors ${sel ? 'bg-fg-08' : 'hover:bg-fg-04'}`}
            >
              <div className={`kol-helper-12 uppercase tracking-wide ${sel ? 'text-fg-96' : 'text-fg-56'}`}>{m.label}</div>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="kol-mono-20 text-fg-96">{m.value}</span>
                {m.change}
              </div>
              {m.compare && m.range && <div className="kol-helper-10 text-fg-48 mt-0.5">{m.range}</div>}
              {m.compare && (
                <>
                  <div className="kol-mono-16 text-fg-48 mt-2">{m.compare.value}</div>
                  <div className="kol-helper-10 text-fg-40 mt-0.5">{m.compare.range}</div>
                </>
              )}
            </Button>
          )
          return (
            <div key={m.key} className="px-1 border-r border-fg-08">
              {m.exact ? <Tooltip label={m.exact} placement="top" triggerClassName="block w-full h-full">{tile}</Tooltip> : tile}
            </div>
          )
        })}
      </div>
    </div>
  )
}
