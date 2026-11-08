/* The Goals card (8.11): Goals · Properties ⌄ · Funnels ⌄ · Explore, as plausible.io. Goals are the three events the
 * sites send since 7.1; Properties are Umami's event data; Funnels and Explore are Umami's funnel and journey reports. */
import { Behaviours, GoalsTable, RankedList, FunnelChart, JourneyExplorer } from '@kolkrabbi/kol-dashboards'
import { umami, report, useAsync, filterParams } from './data.js'

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
  const fields = useAsync(() => umami('/event-data/fields', { startAt: period.start, endAt: period.end }), JSON.stringify(period))
  const propertyOptions = (Array.isArray(fields.data) ? fields.data : []).map((f) => ({ key: f.propertyName, label: f.propertyName }))
  return (
    <Behaviours propertyOptions={propertyOptions} funnels={FUNNELS}>
      {({ tab, property, funnel }) => (
        <>
          {tab === 'goals' && <Goals period={period} filters={filters} total={total} onFilter={onFilter} />}
          {tab === 'properties' && <Properties period={period} name={property} total={total} />}
          {tab === 'funnels' && <Funnel period={period} filters={filters} funnel={FUNNELS.find((f) => f.key === funnel)} />}
          {tab === 'explore' && <Explore period={period} filters={filters} />}
        </>
      )}
    </Behaviours>
  )
}

/* ── the data for each tab: Umami's calls, handed to the package's bodies ── */
function Goals({ period, filters, total, onFilter }) {
  const { data, loading } = useAsync(async () => {
    const f = filterParams(filters)
    const [events, uniques] = await Promise.all([
      umami('/metrics', { startAt: period.start, endAt: period.end, type: 'event', ...f }),
      Promise.all(GOALS.map((g) => report('goal', { startDate: iso(period.start), endDate: iso(period.end), type: 'event', value: g.event }))),
    ])
    const counts = new Map((Array.isArray(events) ? events : []).map((e) => [e.x, e.y]))
    return GOALS.map((g, i) => ({ key: g.event, label: g.label, uniques: uniques[i]?.num || 0, total: counts.get(g.event) || 0 }))
  }, JSON.stringify([period, filters]))
  return <GoalsTable goals={data || []} visitors={total} loading={loading && !data} onPick={(g) => onFilter({ key: 'event', op: 'eq', value: g.key })} />
}

/* ── Properties: values of one property, Visitors · Events · % ───────── */
function Properties({ period, name, total }) {
  const { data, loading } = useAsync(
    () => (name ? umami('/event-data/values', { startAt: period.start, endAt: period.end, propertyName: name }) : null),
    JSON.stringify([period, name]),
  )
  if (!name) return <div className="py-16 text-center kol-helper-12 text-fg-48">No properties recorded yet</div>
  const rows = (Array.isArray(data) ? data : []).map((v) => ({ label: String(v.value ?? '(none)'), value: v.total, unit: 'events' }))
  return <RankedList rows={rows} total={total} column={name} valueLabel="Events" loading={loading} limit={50} />
}

function Funnel({ period, filters, funnel }) {
  const { data, loading } = useAsync(
    () => report('funnel', { startDate: iso(period.start), endDate: iso(period.end), window: 60, steps: funnel.steps.map(({ type, value }) => ({ type, value })) }),
    JSON.stringify([period, filters, funnel.key]),
  )
  const got = Array.isArray(data) ? data : []
  return <FunnelChart title={funnel.label} steps={funnel.steps.map((s, i) => ({ label: s.label, visitors: got[i]?.visitors }))} loading={loading && !data} />
}

function Explore({ period, filters }) {
  const { data, loading } = useAsync(
    () => report('journey', { startDate: iso(period.start), endDate: iso(period.end), steps: 3 }),
    JSON.stringify([period, filters]),
  )
  return <JourneyExplorer journeys={Array.isArray(data) ? data : []} loading={loading && !data} />
}
