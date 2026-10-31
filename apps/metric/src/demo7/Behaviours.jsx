/* The Goals card (8.11): Goals · Properties ⌄ · Funnels ⌄ · Explore, as plausible.io. Goals are the three events the
 * sites send since 7.1; Properties are Umami's event data; Funnels and Explore are Umami's funnel and journey reports. */
import { useState } from 'react'
import { Icon } from '@kolkrabbi/kol-icons'
import { Button, SearchInput, Dropdown } from '@kolkrabbi/kol-component'
import { Card, List } from './Report.jsx'
import { umami, report, useAsync, filterParams, fmtNum } from './data.js'

const GOALS = [
  { event: 'outbound-link-click', label: 'Outbound Link: Click' },
  { event: 'file-download', label: 'File Download' },
  { event: 'contact', label: 'Contact' },
]
/* our funnels, step for step; a `path` step takes Umami's * wildcard */
const FUNNELS = [
  { key: 'work', label: 'Home to Work', steps: [{ type: 'path', value: '/', label: 'Visit /' }, { type: 'path', value: '/work', label: 'Visit /work' }] },
  { key: 'project', label: 'Home to a project', steps: [{ type: 'path', value: '/', label: 'Visit /' }, { type: 'path', value: '/work', label: 'Visit /work' }, { type: 'path', value: '/work/*', label: 'Visit /work/*' }] },
  { key: 'contact', label: 'Visit to Contact', steps: [{ type: 'path', value: '/', label: 'Visit /' }, { type: 'event', value: 'contact', label: 'Contact' }] },
]

const iso = (t) => new Date(t).toISOString()

export default function BehavioursCard({ period, filters, total, onFilter }) {
  const [tab, setTab] = useState('goals')
  const [prop, setProp] = useState(null)
  const [funnel, setFunnel] = useState(FUNNELS[0].key)
  const fields = useAsync(() => umami('/event-data/fields', { startAt: period.start, endAt: period.end }), JSON.stringify(period))
  const propOptions = (Array.isArray(fields.data) ? fields.data : []).map((f) => ({ key: `prop:${f.propertyName}`, label: f.propertyName }))
  const active = tab.startsWith('prop') ? 'properties' : tab.startsWith('funnel') ? 'funnels' : tab
  const pick = (k) => {
    if (k.startsWith('prop:')) { setProp(k.slice(5)); setTab(k) }
    else if (k.startsWith('funnel:')) { setFunnel(k.slice(7)); setTab(k) }
    else setTab(k)
  }
  return (
    <Card
      className="lg:col-span-2"
      tabs={[
        { key: 'goals', label: 'Goals' },
        { key: 'properties', label: 'Properties', search: true, empty: 'No properties recorded yet', options: propOptions },
        { key: 'funnels', label: 'Funnels', search: true, options: FUNNELS.map((f) => ({ key: `funnel:${f.key}`, label: f.label })) },
        { key: 'explore', label: 'Explore' },
      ]}
      tab={active === 'properties' ? `prop:${prop}` : active === 'funnels' ? `funnel:${funnel}` : tab}
      setTab={pick}
    >
      {active === 'goals' && <Goals period={period} filters={filters} total={total} onFilter={onFilter} />}
      {active === 'properties' && <Properties period={period} name={prop} total={total} />}
      {active === 'funnels' && <Funnel period={period} filters={filters} funnel={FUNNELS.find((f) => f.key === funnel)} />}
      {active === 'explore' && <Explore period={period} filters={filters} />}
    </Card>
  )
}

/* ── Goals: Uniques · Total · CR ─────────────────────────────────────── */
function Goals({ period, filters, total, onFilter }) {
  const { data, loading } = useAsync(async () => {
    const f = filterParams(filters)
    const [events, uniques] = await Promise.all([
      umami('/metrics', { startAt: period.start, endAt: period.end, type: 'event', ...f }),
      Promise.all(GOALS.map((g) => report('goal', { startDate: iso(period.start), endDate: iso(period.end), type: 'event', value: g.event }))),
    ])
    const counts = new Map((Array.isArray(events) ? events : []).map((e) => [e.x, e.y]))
    return GOALS.map((g, i) => ({ ...g, uniques: uniques[i]?.num || 0, total: counts.get(g.event) || 0 }))
  }, JSON.stringify([period, filters]))
  const max = Math.max(1, ...(data || []).map((g) => g.uniques))
  return (
    <div className="pt-4">
      <div className="grid grid-cols-[minmax(0,1fr)_8ch_6ch_6ch] sm:grid-cols-[minmax(0,1fr)_repeat(3,8ch)] gap-2 sm:gap-4 kol-helper-12 text-fg-48 pb-2">
        <span>Goal</span><span className="text-right">Uniques</span><span className="text-right">Total</span><span className="text-right">CR</span>
      </div>
      {loading && !data && <div className="py-10 text-center kol-helper-12 text-fg-48">Loading…</div>}
      <div className="flex flex-col" style={{ gap: 'var(--kol-gap-wall-list)' }}>
        {(data || []).map((g) => (
          <div key={g.event} className="group grid grid-cols-[minmax(0,1fr)_8ch_6ch_6ch] sm:grid-cols-[minmax(0,1fr)_repeat(3,8ch)] gap-2 sm:gap-4 items-center kol-helper-12">
            <Button variant="bare" onClick={() => onFilter({ key: 'event', op: 'eq', value: g.event })} className="relative min-h-8 sm:h-8 text-left">
              <span className="absolute inset-y-0 left-0 rounded bg-fg-08 group-hover:bg-fg-12" style={{ width: `${Math.max(1.5, (g.uniques / max) * 100)}%` }} />
              <span className="relative block px-2 py-1.5 sm:py-0 text-fg-88 sm:truncate">{g.label}</span>
            </Button>
            <span className="text-right text-fg-96 tabular-nums">{fmtNum(g.uniques)}</span>
            <span className="text-right text-fg-96 tabular-nums">{fmtNum(g.total)}</span>
            <span className="text-right text-fg-96 tabular-nums">{total ? `${Math.round((g.uniques / total) * 1000) / 10}%` : '0%'}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── Properties: values of one property, Visitors · Events · % ───────── */
function Properties({ period, name, total }) {
  const { data, loading } = useAsync(
    () => (name ? umami('/event-data/values', { startAt: period.start, endAt: period.end, propertyName: name }) : null),
    JSON.stringify([period, name]),
  )
  if (!name) return <div className="py-16 text-center kol-helper-12 text-fg-48">No properties recorded yet</div>
  const rows = (Array.isArray(data) ? data : []).map((v) => ({ label: String(v.value ?? '(none)'), value: v.total, unit: 'events' }))
  return <List rows={rows} total={total} column={name} valueLabel="Events" loading={loading} limit={50} />
}

/* ── Funnels: steps as columns, drop-off between them ────────────────── */
function Funnel({ period, filters, funnel }) {
  const { data, loading } = useAsync(
    () => report('funnel', { startDate: iso(period.start), endDate: iso(period.end), window: 60, steps: funnel.steps.map(({ type, value }) => ({ type, value })) }),
    JSON.stringify([period, filters, funnel.key]),
  )
  const steps = Array.isArray(data) ? data : []
  const first = steps[0]?.visitors || 0
  const last = steps[steps.length - 1]?.visitors || 0
  const conv = first ? (last / first) * 100 : 0
  const p = (v) => `${Math.round(v * 100) / 100}%`
  return (
    <div className="pt-4">
      <div className="flex flex-wrap items-center gap-3 pb-6">
        <h3 className="kol-helper-14 text-fg-96 flex-1">{funnel.label}</h3>
        <span className="kol-helper-12 text-fg-48">{funnel.steps.length}-step funnel</span>
        <span className="text-fg-24">|</span>
        <span className="kol-helper-12 text-fg-48">Sequential</span>
        <span className="text-fg-24">|</span>
        <span className="kol-helper-12 text-fg-48">Conversion rate: <span className="text-fg-96">{p(conv)}</span></span>
      </div>
      {loading && !data && <div className="py-16 text-center kol-helper-12 text-fg-48">Loading…</div>}
      <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${funnel.steps.length}, minmax(0, 1fr))` }}>
        {funnel.steps.map((s, i) => {
          const v = steps[i]?.visitors || 0
          const share = first ? v / first : 0
          const next = steps[i + 1]?.visitors
          return (
            <div key={s.label} className="flex flex-col min-w-0">
              <div className="border-l border-fg-08 pl-3 pb-4">
                <div className="kol-helper-12 text-fg-80 truncate">{s.label}</div>
                <div className="kol-mono-16 text-fg-96 mt-1">{p(share * 100)}</div>
                <div className="kol-helper-12 text-fg-48">{fmtNum(v)} visitors</div>
              </div>
              <div className="relative h-56 rounded bg-fg-04 overflow-hidden">
                <div className="absolute inset-x-0 bottom-0 rounded" style={{ height: `${share * 100}%`, background: 'var(--kol-palette-blue)', opacity: 0.7 }} />
                <span className="absolute left-2 bottom-2 inline-flex items-center gap-1.5 rounded bg-surface-primary px-2 py-1 kol-helper-12 text-fg-88">
                  {next != null ? (
                    <><Icon name="arrow-right" size={12} />{p(v ? (next / v) * 100 : 0)}</>
                  ) : (
                    <><Icon name="check" size={12} />{p(conv)}<Icon name="arrow-down" size={12} className="ml-1" />{p(100 - conv)}</>
                  )}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ── Explore: where journeys go from a page (or come from, by end point) ── */
function Explore({ period, filters }) {
  const [mode, setMode] = useState('start')
  const [q, setQ] = useState('')
  const [path, setPath] = useState([])
  const { data, loading } = useAsync(
    () => report('journey', { startDate: iso(period.start), endDate: iso(period.end), steps: 3 }),
    JSON.stringify([period, filters]),
  )
  const journeys = (Array.isArray(data) ? data : []).map((j) => {
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
              {loading && !data && n === 0 && <div className="flex-1 flex items-center justify-center kol-helper-12 text-fg-48">Loading…</div>}
              {rows ? (
                <div className="flex flex-col gap-1 overflow-auto max-h-80">
                  {rows.map((r) => {
                    const on = path[n] === r.label
                    return (
                      <Button variant="bare" key={r.label} onClick={() => setPath(on ? path.slice(0, n) : [...path.slice(0, n), r.label])}
                        className="group relative h-8 shrink-0 grid items-center gap-3 text-left kol-helper-12" style={{ gridTemplateColumns: 'minmax(0,1fr) auto' }}>
                        <span className={`absolute inset-y-0 left-0 rounded transition-colors ${on ? 'bg-fg-24' : 'bg-fg-08 group-hover:bg-fg-12'}`} style={{ width: `${Math.max(2, (r.value / max) * 100)}%` }} />
                        <span className={`relative px-2 truncate ${on ? 'text-fg-96' : 'text-fg-88'}`}>{r.label}</span>
                        <span className="relative text-fg-96 tabular-nums pr-1">{fmtNum(r.value)}</span>
                      </Button>
                    )
                  })}
                  {!rows.length && <div className="py-10 text-center kol-helper-12 text-fg-48">No journeys go further</div>}
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center gap-3 kol-helper-12 text-fg-48">
                  <Icon name="pointer" size={18} />
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
