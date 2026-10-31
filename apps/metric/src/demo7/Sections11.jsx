/* /demo-11 (plan 2026-10-30-metric-style, W15): one card system. Every card is the Report card with ONE anatomy —
 * header: title (or tabs) on the rule, controls only on the right; body: fills the card's height; foot: legend /
 * scale on the left, totals / source on the right. Records are KOL `Table variant="simple"`, related cards share
 * tabs, deploy activity is a year of days, and no `·` separates anything (two facts are two columns or two spans). */
import { useState } from 'react'
import REPO from '../data/repo-metrics.json'
import { Table } from '@kolkrabbi/kol-component'
import { DEPLOY_STATE_LABELS, PALETTE, formatB2Size, timeAgo } from '@kolkrabbi/kol-dashboards'
import { Card, List } from './Report.jsx'
import { Heatmap, CalendarHeatmap, CalendarScale } from '@kolkrabbi/kol-dashboards'
import { Sized } from './Sections.jsx'
import { getJson, umami, useAsync, filterParams, fmtNum } from './data.js'

const C = { blue: 'var(--kol-palette-blue)', green: 'var(--kol-palette-green)', purple: 'var(--kol-palette-purple)', orange: 'var(--kol-palette-orange)', teal: 'var(--kol-palette-teal)', red: 'var(--kol-palette-red)' }
const GRID = { gap: 'var(--kol-gap-wall-grid)' }
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const HOURS = Array.from({ length: 24 }, (_, i) => `${i}h`)

/* the anatomy (15.1) — `title` for one, `tabs` for a group (15.4) */
export function Card11({ title, tabs, tab, setTab, controls, footLeft, footRight, children, className = '', footPad = 'pt-4' }) {
  const t = tabs ?? [{ key: 't', label: title }]
  return (
    <Card className={`h-full ${className}`} tabs={t} tab={tabs ? tab : 't'} setTab={setTab ?? (() => {})} menu={controls}>
      <div className="flex-1 min-h-0 flex flex-col">{children}</div>
      {(footLeft || footRight) && (
        <footer className={`flex flex-wrap items-center justify-between gap-x-4 gap-y-2 ${footPad} kol-helper-12 text-fg-48`}>
          <span className="flex flex-wrap items-center gap-x-4 gap-y-1 min-w-0">{footLeft}</span>
          <span className="flex items-center gap-4 shrink-0">{footRight}</span>
        </footer>
      )}
    </Card>
  )
}

/* a colour key, as the foot's left draws it */
export const Key = ({ color, label, value }) => (
  <span className="flex items-center gap-1.5 whitespace-nowrap"><span className="w-2 h-2 rounded-full shrink-0" style={{ background: color }} />{label}{value != null && <span className="text-fg-80">{value}</span>}</span>
)

/* numbers as the colour row draws them; the row's ends carry no padding of their own (16.3) — the card's 24 is the edge */
function Numbers({ items }) {
  return (
    <div className="pt-4 overflow-hidden">
      <div className="grid sm:-ml-[17px] sm:w-[calc(100%+17px)]" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(160px, 100%), 1fr))' }}>
        {items.map((t) => (
          <div key={t.label} className="flex flex-col gap-3 py-3 border-t border-[var(--kol-oq-08)] first:border-t-0 sm:border-t-0 sm:pl-[17px] sm:pr-4 sm:shadow-[inset_1px_0_0_var(--kol-oq-08)]">
            <span className="kol-helper-12 flex items-center gap-2 uppercase whitespace-nowrap" style={{ letterSpacing: '0.06em', color: 'var(--kol-fg-meta)' }}>
              <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: t.color }} />{t.label}
            </span>
            <span className="kol-mono-20" style={{ fontSize: 24, fontWeight: 500, lineHeight: 1, color: 'var(--kol-surface-on-primary)' }}>{t.value}</span>
            {t.note && <span className="kol-helper-12 text-fg-48">{t.note}</span>}
          </div>
        ))}
      </div>
    </div>
  )
}

/* records: the DS table, simple variant, real columns (15.3) */
const Records = ({ columns, rows, empty = 'No data yet' }) => (rows.length
  ? <div className="pt-4 min-w-0 overflow-x-auto"><Table variant="simple" width="column" compact columns={columns} rows={rows} /></div>
  : <div className="kol-helper-12 text-fg-48 py-10 text-center">{empty}</div>)
const right = { style: { textAlign: 'right' } }
const when = (t) => timeAgo(typeof t === 'number' ? t : new Date(t).getTime())

/* ── the weekday grid (15.6, 15.7): no note; follows the picker and the Settings time zone; Less → More in the foot ── */
export function WeekdayGrid11({ period, filters, timezone }) {
  const weekly = useAsync(() => umami('/sessions/weekly', { startAt: period.start, endAt: period.end, timezone, ...filterParams(filters) }), JSON.stringify([period, filters, timezone]))
  return (
    <Card11 title="Visitors" className="min-h-[480px]" footLeft={<CalendarScale />} footRight={<span>{timezone}</span>} footPad="pt-6">
      <div className="pt-6 flex-1 min-h-0 flex flex-col overflow-x-auto">
        {Array.isArray(weekly.data)
          ? <div className="flex-1 min-h-0 flex flex-col min-w-[400px]"><Heatmap data={weekly.data} rows={DAYS} cols={HOURS} colTick={3} variant="dots" cellSize={16} fill /></div>
          : <div className="kol-helper-12 text-fg-48 py-16 text-center">Loading…</div>}
      </div>
    </Card11>
  )
}

/* ── Code ── */
export function CodeSection11({ sanity }) {
  const [rank, setRank] = useState('components')
  const [content, setContent] = useState('numbers')
  const n = (k) => fmtNum(REPO[k] ?? 0)
  const t = sanity?.types ?? {}
  const pkgs = REPO.dsPackages ?? []
  const apps = REPO.routesByApp ?? []
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2" style={GRID}>
      <Sized id="c11-numbers" className="lg:col-span-2">
        <Card11 title="Code" footRight={<><span>Measured</span><span className="text-fg-80">{REPO.measured}</span></>}>
          <Numbers items={[
            { label: 'Components', value: n('components'), note: 'kol-ds-ui', color: C.blue },
            { label: 'Atoms', value: n('atoms'), note: 'kol-component', color: C.blue },
            { label: 'Molecules', value: n('molecules'), note: 'kol-component', color: C.green },
            { label: 'Organisms', value: n('organisms'), note: 'kol-component', color: C.purple },
            { label: 'Lines of code', value: n('linesOfCode'), note: 'jsx js css ts', color: C.purple },
            { label: 'Commits', value: n('commits'), note: 'git history', color: C.orange },
            { label: 'Session logs', value: n('sessionLogs'), note: 'LLM sessions', color: C.purple },
            { label: 'Docs files', value: n('docsFiles'), note: 'docs/', color: C.orange },
            { label: 'Fonts', value: n('fonts'), note: 'typeface files', color: C.red },
          ]} />
        </Card11>
      </Sized>
      <Sized id="c11-rank">
        <Card11 tabs={[{ key: 'components', label: 'Components' }, { key: 'routes', label: 'Routes' }]} tab={rank} setTab={setRank}
          footRight={<span>{rank === 'components' ? 'kol-ds-ui packages' : 'apps'}</span>}>
          {rank === 'components'
            ? <List rows={pkgs.map((p) => ({ key: p.name, label: p.name, value: p.components, unit: 'components' }))} total={REPO.components} column="Package" valueLabel="Components" limit={20} />
            : <List rows={apps.map((a) => ({ key: a.name, label: `apps/${a.name}`, value: a.routes, unit: 'routes' }))} total={REPO.routes} column="App" valueLabel="Routes" limit={20} />}
        </Card11>
      </Sized>
      <Sized id="c11-content">
        <Card11 tabs={[{ key: 'numbers', label: 'Content' }, { key: 'edits', label: 'Recent edits' }]} tab={content} setTab={setContent} footRight={<span>Sanity</span>}>
          {content === 'numbers'
            ? <Numbers items={[
              { label: 'CMS documents', value: fmtNum(sanity?.totalDocuments ?? 0), note: 'all types', color: C.teal },
              { label: 'Blog posts', value: fmtNum(t.blog ?? 0), note: 'published', color: C.blue },
              { label: 'Projects', value: fmtNum(t.project ?? 0), note: 'portfolio', color: C.green },
            ]} />
            : <Records columns={[
              { header: 'Title', accessor: 'title' },
              { header: 'Type', accessor: 'type' },
              { header: 'Modified', accessor: 'when', ...right, sortable: true, sortValue: (r) => r.t },
            ]} rows={(sanity?.recentEdits ?? []).map((d) => ({ title: d.title, type: d.type, when: when(d.updated), t: new Date(d.updated).getTime() }))} />}
        </Card11>
      </Sized>
    </div>
  )
}

/* ── Deploys ── */
export function DeploysSection11() {
  const [tab, setTab] = useState('recent')
  const d = useAsync(() => getJson(`/api/demo5-deploys?range=${365 * 86400000}`), 'deploys-365d')
  const deploys = d.data?.deploys ?? []
  const last30 = deploys.filter((x) => x.created >= Date.now() - 30 * 86400000)
  const isFail = (x) => x.state === 'ERROR' || x.state === 'CANCELED'
  const failed = last30.filter(isFail)
  const builds = last30.filter((x) => x.duration).map((x) => x.duration)
  const avg = (b) => (b.length ? Math.round(b.reduce((a, c) => a + c, 0) / b.length) : 0)
  const latest = deploys[0]
  const label = (x) => DEPLOY_STATE_LABELS[x.state] || x.state
  const projects = Object.values(last30.reduce((acc, x) => { (acc[x.project] ??= { name: x.project, deploys: [] }).deploys.push(x); return acc }, {}))
    .sort((a, b) => b.deploys[0].created - a.deploys[0].created)
  const days = new Map()
  for (const x of deploys) { const t = new Date(x.created); const k = `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, '0')}-${String(t.getDate()).padStart(2, '0')}`; days.set(k, (days.get(k) || 0) + 1) }
  const deployCols = [
    { header: 'Project', accessor: 'project' },
    { header: 'Source', accessor: 'source' },
    { header: 'Branch', accessor: 'branch' },
    { header: 'Target', accessor: 'target' },
    { header: 'Build', accessor: 'build', ...right },
    { header: 'State', accessor: 'state' },
    { header: 'When', accessor: 'when', ...right, sortable: true, sortValue: (r) => r.t },
  ]
  const deployRow = (x) => ({ project: x.project, source: x.source, branch: x.branch, target: x.target, build: x.duration ? `${x.duration}s` : '—', state: label(x), when: when(x.created), t: x.created })
  return (
    <div className="grid grid-cols-1" style={GRID}>
      <Sized id="d11-numbers">
        <Card11 title="Deploys" footRight={<><span>Vercel</span><span>30 days</span></>}>
          <Numbers items={[
            { label: 'Latest deploy', value: latest ? label(latest) : '—', note: latest ? `${latest.project}, ${when(latest.created)}` : '', color: C.green },
            { label: 'Avg build time', value: `${avg(builds)}s`, note: `${last30.length} deploys`, color: C.purple },
            { label: 'Failed deploys', value: String(failed.length), note: `of ${last30.length}`, color: failed.length ? C.red : C.green },
            { label: 'Projects', value: String(projects.length), note: 'deployed', color: C.teal },
          ]} />
        </Card11>
      </Sized>
      <Sized id="d11-calendar">
        <Card11 title="Deploy activity" footLeft={<CalendarScale color={C.green} />} footRight={<><span>{fmtNum(deploys.length)} deploys</span><span>last year</span></>}>
          <div className="pt-4 overflow-x-auto">{d.loading ? <div className="kol-helper-12 text-fg-48 py-10 text-center">Loading…</div> : <div className="min-w-[640px]"><CalendarHeatmap days={days} color={C.green} /></div>}</div>
        </Card11>
      </Sized>
      <Sized id="d11-records">
        <Card11 tabs={[{ key: 'recent', label: 'Recent' }, { key: 'projects', label: 'By project' }, { key: 'failed', label: 'Failed' }]} tab={tab} setTab={setTab}
          footRight={<><span>Vercel</span><span>30 days</span></>}>
          {tab === 'recent' && <Records columns={deployCols} rows={last30.slice(0, 15).map(deployRow)} empty={d.loading ? 'Loading…' : 'No data yet'} />}
          {tab === 'failed' && <Records columns={deployCols} rows={failed.map(deployRow)} empty="No failed deploys" />}
          {tab === 'projects' && <Records columns={[
            { header: 'Project', accessor: 'name' },
            { header: 'Deploys', accessor: 'n', ...right, sortable: true },
            { header: 'Failed', accessor: 'f', ...right, sortable: true },
            { header: 'Avg build', accessor: 'avg', ...right },
            { header: 'State', accessor: 'state' },
            { header: 'When', accessor: 'when', ...right, sortable: true, sortValue: (r) => r.t },
          ]} rows={projects.map((p) => ({ name: p.name, n: p.deploys.length, f: p.deploys.filter(isFail).length, avg: `${avg(p.deploys.filter((x) => x.duration).map((x) => x.duration))}s`, state: label(p.deploys[0]), when: when(p.deploys[0].created), t: p.deploys[0].created }))} />}
        </Card11>
      </Sized>
    </div>
  )
}

/* ── Storage ── */
export function StorageSection11() {
  const s = useAsync(() => getJson('/api/demo5-storage'), 'storage')
  const d = s.data
  const stores = d?.stores ?? []
  const [tab, setTab] = useState(null)
  const cur = stores.find((x) => x.bucket === tab) ?? stores[0]
  if (!d) return <p className="kol-helper-12 text-fg-48">{s.loading ? 'Loading storage…' : 'No storage data'}</p>
  return (
    <div className="grid grid-cols-1" style={GRID}>
      <Sized id="s11-numbers">
        <Card11 title="Storage" footRight={<><span>{fmtNum(d.files ?? 0)} files</span><span>{stores.length} stores</span></>}>
          <Numbers items={[
            { label: 'Storage', value: formatB2Size(d.bytes), note: 'every store', color: C.blue },
            ...stores.map((x, i) => ({ label: x.bucket, value: formatB2Size(x.bytes), note: x.provider, color: PALETTE[(i + 1) % PALETTE.length] })),
          ]} />
        </Card11>
      </Sized>
      {cur && (
        <Sized id="s11-stores">
          <Card11 tabs={stores.map((x) => ({ key: x.bucket, label: x.bucket }))} tab={cur.bucket} setTab={setTab}
            footLeft={cur.types.map((t, i) => <Key key={t.name} color={PALETTE[i % PALETTE.length]} label={t.name} value={formatB2Size(t.bytes)} />)}
            footRight={<><span>{cur.provider}</span><span className="text-fg-80">{formatB2Size(cur.bytes)}</span></>}>
            <div className="flex h-2 rounded-full overflow-hidden bg-fg-08 mt-4">
              {cur.types.map((t, i) => <div key={t.name} style={{ width: `${(t.bytes / cur.bytes) * 100}%`, background: PALETTE[i % PALETTE.length] }} />)}
            </div>
            <List rows={cur.folders.slice(0, 12).map((f) => ({ key: f.name, label: f.name, value: f.bytes, display: formatB2Size(f.bytes), unit: 'bytes' }))} total={cur.bytes} column="Folder" valueLabel="Size" limit={12} />
          </Card11>
        </Sized>
      )}
      <Sized id="s11-uploads">
        <Card11 title="Recent uploads" footRight={<span>Every store</span>}>
          <Records columns={[
            { header: 'File', accessor: 'file' },
            { header: 'Store', accessor: 'store' },
            { header: 'Path', accessor: 'path' },
            { header: 'Size', accessor: 'size', ...right, sortable: true, sortValue: (r) => r.bytes },
            { header: 'Modified', accessor: 'when', ...right, sortable: true, sortValue: (r) => r.t },
          ]} rows={(d.recent ?? []).filter((f) => !/\.(ts|m3u8)$/.test(f.name)).slice(0, 12).map((f) => ({ file: f.name.split('/').pop(), store: `${f.provider} ${f.bucket}`, path: f.name.split('/').slice(0, -1).join('/'), size: formatB2Size(f.size), bytes: f.size, when: when(f.uploaded), t: typeof f.uploaded === 'number' ? f.uploaded : new Date(f.uploaded).getTime() }))} />
        </Card11>
      </Sized>
    </div>
  )
}
