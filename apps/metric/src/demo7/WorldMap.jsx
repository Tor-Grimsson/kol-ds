/* The Map tab (8.10): countries shaded by visitors, a tooltip "Country N visitors", a click filters by the country.
 * Shapes: Natural Earth 1:110m (public domain), Equal Earth projection, baked to SVG paths in world.json. */
import { useRef, useState } from 'react'
import WORLD from './world.json'
import { fmtNum } from './data.js'

export default function WorldMap({ rows, loading, onFilter }) {
  const wrap = useRef(null)
  const [hover, setHover] = useState(null)
  const byCc = new Map((rows || []).map((r) => [r.key, r]))
  const max = Math.max(1, ...(rows || []).map((r) => r.value))
  return (
    <div ref={wrap} className="relative pt-6 flex-1 flex items-center" onPointerLeave={() => setHover(null)}>
      <svg viewBox={`0 0 ${WORLD.w} ${WORLD.h}`} className="w-full h-auto block">
        {WORLD.countries.map((c) => {
          const r = byCc.get(c.id)
          const hot = hover?.id === c.id
          return (
            <path
              key={`${c.id}${c.name}`}
              d={c.d}
              fill={r ? 'var(--kol-palette-blue)' : 'var(--kol-fg-08)'}
              fillOpacity={r ? 0.25 + 0.75 * Math.sqrt(r.value / max) : 1}
              stroke={hot ? 'var(--kol-palette-blue)' : 'var(--kol-surface-secondary)'}
              strokeWidth={hot ? 1.5 : 0.5}
              className={r ? 'cursor-pointer' : ''}
              onPointerMove={(e) => {
                const b = wrap.current.getBoundingClientRect()
                setHover({ id: c.id, name: r?.label || c.name, value: r?.value || 0, x: e.clientX - b.left, y: e.clientY - b.top })
              }}
              onClick={() => r?.filter && onFilter(r.filter)}
            />
          )
        })}
      </svg>
      {loading && !rows && <div className="absolute inset-0 flex items-center justify-center kol-helper-12 text-fg-48">Loading…</div>}
      {hover && (
        <div
          className="absolute pointer-events-none bg-surface-primary border border-fg-08 rounded px-3 py-2 shadow-lg kol-helper-12 whitespace-nowrap"
          style={{ left: Math.min(hover.x + 14, (wrap.current?.clientWidth || 0) - 160), top: hover.y + 14 }}
        >
          <div className="text-fg-96">{hover.name}</div>
          <div className="text-fg-64"><span className="text-fg-96">{fmtNum(hover.value)}</span> visitors</div>
        </div>
      )}
    </div>
  )
}
