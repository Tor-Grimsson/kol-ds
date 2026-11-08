/* Where journeys go from a page (or come from, by end point): `journeys` `{ items: [path, ...], count }`, three
 * columns that open one after another as a path is picked. */
import { useState } from 'react'
import { IconLoader } from '@kolkrabbi/kol-icons'
import { Button, SearchInput, Dropdown } from '@kolkrabbi/kol-component'
import { formatCount } from '../shared/formatSeries.js'

export default function JourneyExplorer({ journeys: raw = [], loading }) {
  const [mode, setMode] = useState('start')
  const [q, setQ] = useState('')
  const [path, setPath] = useState([])
  const journeys = raw.map((j) => {
    const items = j.items.filter((x) => x != null)
    return { items: mode === 'start' ? items : [...items].reverse(), count: j.count }
  })
  /* column n: what sits at position n among journeys matching the picked prefix */
  const column = (n) => {
    const m = new Map()
    for (const j of journeys) {
      if (j.items.length <= n || path.slice(0, n).some((p, k) => j.items[k] !== p)) continue
      m.set(j.items[n], (m.get(j.items[n]) || 0) + j.count)
    }
    return [...m].map(([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value)
  }
  const cols = [0, 1, 2]
  const titles = mode === 'start' ? ['Starting point', '1 step after', '2 steps after'] : ['End point', '1 step before', '2 steps before']
  return (
    <div className="pt-4">
      <h3 className="kol-helper-14 text-fg-96 pb-4">Explore user journeys</h3>
      <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(240px, 100%), 1fr))' }}>
        {cols.map((n) => {
          const rows = n === 0 ? column(0).filter((r) => r.label.toLowerCase().includes(q.toLowerCase())) : n <= path.length ? column(n) : null
          const max = Math.max(1, ...(rows || []).map((r) => r.value))
          return (
            <div key={n} className="border border-fg-08 rounded p-3 flex flex-col min-h-80">
              <div className="flex items-center gap-2 pb-3">
                {n === 0 ? (
                  <>
                    <Dropdown
                      tone="ghost"
                      ariaLabel="Explore from"
                      value={mode}
                      onChange={(v) => { setMode(v); setPath([]) }}
                      options={[{ value: 'start', label: 'Starting point' }, { value: 'end', label: 'End point' }]}
                    />
                    <div className="flex-1 min-w-0"><SearchInput variant="outline" size="sm" value={q} onChange={(e) => setQ(e.target?.value ?? e)} onClear={() => setQ('')} placeholder="Search" /></div>
                  </>
                ) : <span className="kol-helper-12 text-fg-88">{titles[n]}</span>}
              </div>
              {loading && n === 0 && <div className="flex-1 flex items-center justify-center kol-helper-12 text-fg-48">Loading…</div>}
              {rows ? (
                <div className="flex flex-col gap-1 overflow-auto max-h-80">
                  {rows.map((r) => {
                    const on = path[n] === r.label
                    return (
                      <Button variant="bare" key={r.label} onClick={() => setPath(on ? path.slice(0, n) : [...path.slice(0, n), r.label])}
                        className="group relative h-8 shrink-0 grid items-center gap-3 text-left kol-helper-12" style={{ gridTemplateColumns: 'minmax(0,1fr) auto' }}>
                        <span className={`absolute inset-y-0 left-0 rounded transition-colors ${on ? 'bg-fg-24' : 'bg-fg-08 group-hover:bg-fg-12'}`} style={{ width: `${Math.max(2, (r.value / max) * 100)}%` }} />
                        <span className={`relative px-2 truncate ${on ? 'text-fg-96' : 'text-fg-88'}`}>{r.label}</span>
                        <span className="relative text-fg-96 tabular-nums pr-1">{formatCount(r.value)}</span>
                      </Button>
                    )
                  })}
                  {!rows.length && <div className="py-10 text-center kol-helper-12 text-fg-48">No journeys go further</div>}
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center gap-3 kol-helper-12 text-fg-48">
                  <IconLoader name="pointer" size={18} />
                  {n === 1 ? `Select ${mode === 'start' ? 'a starting point' : 'an end point'} to continue` : 'Select an event to continue'}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
