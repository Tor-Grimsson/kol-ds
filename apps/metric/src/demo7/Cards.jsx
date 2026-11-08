/* The four report cards (8.9, 8.10), tab for tab as plausible.io: Sources (Channels · Sources · Campaigns ⌄),
 * Pages (Top · Entry · Exit, ⋮ Break down by), Locations (Map · Countries · Regions · Cities), Devices (Browsers ·
 * Operating systems · Devices). Rows are Umami's; a row Umami can filter on filters the page when clicked. */
import { useState } from 'react'
import { IconLoader, KOL_ICON_SET_EXTERNAL_NAMES } from '@kolkrabbi/kol-icons'
import { MenuMore } from '@kolkrabbi/kol-component'
import { Card, RankedList, DetailsOverlay, WorldMap, REGION_NAMES as REGIONS } from '@kolkrabbi/kol-dashboards'
import { umami, report, useAsync, filterParams, countryName, isDevHost, fmtNum, fmtDuration } from './data.js'

const FLAGS = new Set(KOL_ICON_SET_EXTERNAL_NAMES)

/* ── names and icons ──────────────────────────────────────────────────── */
const CHANNELS = {
  direct: 'Direct', organicSearch: 'Organic Search', organicSocial: 'Organic Social', organicVideo: 'Organic Video',
  organicShopping: 'Organic Shopping', paidAds: 'Paid Ads', paidSearch: 'Paid Search', paidSocial: 'Paid Social',
  paidVideo: 'Paid Video', paidShopping: 'Paid Shopping', referral: 'Referral', email: 'Email', sms: 'SMS',
}
/* Icons: kol-icons only (plan 9.5, P35 — no CDN, no emoji). Brands and flags are the `external` set (kol-icons 0.54.0);
 * devices are interface/device; the small referrer sites keep their own favicon, stored here (src/demo7/favicons/). */
const BROWSERS = {
  chrome: ['Chrome', 'chrome'], crios: ['Chrome (iOS)', 'chrome'], 'chromium-webview': ['Chrome WebView', 'chrome'],
  ios: ['Safari (iOS)', 'safari'], safari: ['Safari', 'safari'], 'ios-webview': ['iOS WebView', 'safari'],
  firefox: ['Firefox', 'firefox'], fxios: ['Firefox (iOS)', 'firefox'], edge: ['Edge', 'edge'], 'edge-chromium': ['Edge', 'edge'], 'edge-ios': ['Edge (iOS)', 'edge'],
  opera: ['Opera', 'opera'], samsung: ['Samsung Internet'], instagram: ['Instagram', 'instagram'],
  facebook: ['Facebook', 'facebook'], brave: ['Brave'], yandexbrowser: ['Yandex'], duckduckgo: ['DuckDuckGo', 'duckduckgo'],
}
const OS = { 'Mac OS': 'apple', iOS: 'ios', 'Android OS': 'android', Linux: 'linux', Ubuntu: 'linux', 'Chrome OS': 'chrome' }
const osIcon = (name) => OS[name] || (/^Windows/.test(name) ? 'windows' : null)
const DEVICES = { desktop: 'desktop', laptop: 'laptop', mobile: 'mobile', tablet: 'tablet', xr: 'vr-headset' }
/* referrer → brand mark */
const SOURCES = [
  [/(^|\.)facebook\.com$/, 'facebook'], [/(^|\.)instagram\.com$/, 'instagram'], [/(^|\.)pinterest\.com$/, 'pinterest'],
  [/(^|\.)google\./, 'google'], [/^t\.co$|(^|\.)twitter\.com$|(^|\.)x\.com$/, 'twitter'], [/(^|\.)github\.com$/, 'github'],
  [/(^|\.)chatgpt\.com$|(^|\.)openai\.com$/, 'openai'], [/(^|\.)duckduckgo\.com$/, 'duckduckgo'], [/(^|\.)bing\.com$/, 'bing'], [/(^|\.)kagi\.com$/, 'kagi'],
]
const FAVICONS = Object.fromEntries(Object.entries(import.meta.glob('./favicons/*.{png,svg}', { eager: true, query: '?url', import: 'default' }))
  .map(([p, url]) => [p.split('/').pop().replace(/\.(png|svg)$/, ''), url]))

const Mark = ({ name, fallback = 'globe' }) => (
  <span className="w-4 h-4 shrink-0 inline-flex items-center justify-center"><IconLoader name={name || fallback} size={16} className={name ? '' : 'text-fg-48'} /></span>
)
const Brand = ({ name }) => <Mark name={name} />
export const Favicon = ({ host }) => {
  const h = host || ''
  if (FAVICONS[h]) return <img src={FAVICONS[h]} alt="" width={16} height={16} className="w-4 h-4 shrink-0 rounded-sm" />
  if (/(^|\.)kolkrabbi\.io$/.test(h)) return <Mark name="kolkrabbi" />
  if (/^(localhost|127\.)/.test(h)) return <Mark name="code" />
  const brand = SOURCES.find(([re]) => re.test(h))?.[1]
  return <Mark name={brand} />
}
const Flag = ({ cc }) => <Mark name={cc && FLAGS.has(`flag-${cc.toLowerCase()}`) ? `flag-${cc.toLowerCase()}` : null} />

/* ── data ─────────────────────────────────────────────────────────────── */
const metrics = (type, period, filters, extra) =>
  umami('/metrics', { startAt: period.start, endAt: period.end, type, ...filterParams(filters), ...extra })

/* one tab's rows for both periods, so the arrows can compare */
function useRows(load, deps, comparison) {
  return useAsync(async () => {
    const [now, then] = await Promise.all([load(deps.period), comparison ? load(comparison) : null])
    return { rows: now || [], prev: then ? new Map(then.map((r) => [r.key ?? r.label, r.value])) : null }
  }, JSON.stringify([deps, comparison]))
}

const asRows = (list, map = (r) => ({ label: r.x, value: r.y })) => (Array.isArray(list) ? list.filter((r) => r.x != null).map(map) : [])
/* RankedList's rows: each carries its comparison value; a row Umami cannot filter on is not clickable */
const ranked = (data) => data?.rows?.map((r) => ({ ...r, prev: data.prev?.get(r.key ?? r.label), disabled: !r.filter }))
const pick = (onFilter) => onFilter && ((r) => onFilter(r.filter))

/* the extra columns each kind of row carries when expanded (guided tour: "Expanded view adds …") */
const pct = (v) => `${Math.round(v)}%`
const EXPANDED = {
  visitors: [{ key: 'visitors', label: 'Visitors', fmt: fmtNum }, { key: 'bounce', label: 'Bounce rate', fmt: pct }, { key: 'duration', label: 'Visit duration', fmt: fmtDuration }],
  path: [{ key: 'visitors', label: 'Visitors', fmt: fmtNum }, { key: 'pageviews', label: 'Pageviews', fmt: fmtNum }, { key: 'bounce', label: 'Bounce rate', fmt: pct }, { key: 'timeOnPage', label: 'Time on page', fmt: fmtDuration }],
  entry: [{ key: 'visitors', label: 'Unique entrances', fmt: fmtNum }, { key: 'visits', label: 'Total entrances', fmt: fmtNum }, { key: 'bounce', label: 'Bounce rate', fmt: pct }, { key: 'duration', label: 'Visit duration', fmt: fmtDuration }],
  exit: [{ key: 'visitors', label: 'Unique exits', fmt: fmtNum }, { key: 'visits', label: 'Total exits', fmt: fmtNum }, { key: 'exitRate', label: 'Exit rate', fmt: pct }],
}
async function expanded(type, period, filters, toRow) {
  const f = filterParams(filters)
  const [rows, paths] = await Promise.all([
    umami('/metrics/expanded', { startAt: period.start, endAt: period.end, type, ...f }),
    type === 'exit' ? umami('/metrics/expanded', { startAt: period.start, endAt: period.end, type: 'path', ...f }) : null,
  ])
  const views = new Map((paths || []).map((p) => [p.name, +p.pageviews]))
  return (rows || []).filter((r) => r.name != null).map((r) => {
    const visits = +r.visits || 0
    return {
      ...toRow({ x: r.name, y: r.visitors }),
      visitors: +r.visitors, visits, pageviews: +r.pageviews,
      bounce: visits ? (r.bounces / visits) * 100 : 0,
      duration: visits ? r.totaltime / visits : 0,
      timeOnPage: +r.pageviews ? r.totaltime / r.pageviews : 0,
      exitRate: views.get(r.name) ? (visits / views.get(r.name)) * 100 : 0,
    }
  })
}

/* a card's expand dialog, fed by /metrics/expanded where Umami has it, else the plain list */
function useDetails() {
  const [d, setD] = useState(null)
  const state = useAsync(() => (d ? d.load() : null), d?.id)
  return {
    open: (title, columns, load) => setD({ id: `${title}${Date.now()}`, title, columns, load }),
    el: d && <DetailsOverlay open title={d.title} columns={[{ key: 'label', label: d.columns.label }, ...d.columns.cols]} rows={state.data} loading={state.loading} onClose={() => setD(null)} />,
  }
}

/* ── Sources ──────────────────────────────────────────────────────────── */
const UTM = [
  { key: 'utm_medium', label: 'UTM mediums', col: 'UTM medium' },
  { key: 'utm_source', label: 'UTM sources', col: 'UTM source' },
  { key: 'utm_campaign', label: 'UTM campaigns', col: 'UTM campaign' },
  { key: 'utm_content', label: 'UTM contents', col: 'UTM content' },
  { key: 'utm_term', label: 'UTM terms', col: 'UTM term' },
]
const utm = async (period, key) => {
  const r = await report('utm', { startDate: new Date(period.start).toISOString(), endDate: new Date(period.end).toISOString() })
  return (r?.[key] || []).map((u) => ({ label: u.utm, value: u.views, unit: 'pageviews' }))
}

export function SourcesCard({ period, comparison, filters, total, onFilter }) {
  const [tab, setTab] = useState('referrer')
  const details = useDetails()
  const load = (p) => {
    if (tab === 'channel') return metrics('channel', p, filters).then((l) => asRows(l, (r) => ({ label: CHANNELS[r.x] || r.x, value: r.y })))
    if (tab === 'referrer') return metrics('referrer', p, filters).then((l) => asRows(l, (r) => ({ label: r.x, value: r.y, icon: <Favicon host={r.x} />, filter: { key: 'referrer', op: 'eq', value: r.x } })))
    return utm(p, tab)
  }
  const { data, loading } = useRows(load, { tab, period, filters }, comparison)
  const u = UTM.find((x) => x.key === tab)
  const col = tab === 'channel' ? 'Channel' : tab === 'referrer' ? 'Source' : u.col
  return (
    <Card
      tabs={[{ key: 'channel', label: 'Channels' }, { key: 'referrer', label: 'Sources' }, { key: 'campaigns', label: 'Campaigns', options: UTM }]}
      tab={tab}
      onTab={setTab}
      onExpand={() => details.open(col === 'Source' ? 'Top sources' : col, { label: col, cols: tab === 'referrer' ? EXPANDED.visitors : [{ key: 'value', label: u ? 'Pageviews' : 'Visitors', fmt: fmtNum }] },
        () => (tab === 'referrer' ? expanded('referrer', period, filters, (r) => ({ label: r.x, value: r.y, icon: <Favicon host={r.x} /> })) : load(period)))}
    >
      <RankedList rows={ranked(data)} total={total} column={col} valueLabel={u ? 'Pageviews' : 'Visitors'} loading={loading} onPick={pick(onFilter)}
        empty={u ? 'No UTM-tagged visits in this period' : 'No data yet'} />
      {details.el}
    </Card>
  )
}

/* ── Pages ────────────────────────────────────────────────────────────── */
export function PagesCard({ period, comparison, filters, total, onFilter }) {
  const [tab, setTab] = useState('path')
  const [by, setBy] = useState('path')
  const details = useDetails()
  const pageRow = (r) => ({ label: r.x, value: r.y, filter: tab === 'path' ? { key: 'path', op: 'eq', value: r.x } : null })
  /* "URL" = host + path: Umami keeps them apart, so ask per site and join */
  const load = async (p) => {
    if (by === 'path') return asRows(await metrics(tab, p, filters), pageRow)
    const hosts = asRows(await metrics('hostname', p, filters)).filter((h) => !isDevHost(h.label))
    const lists = await Promise.all(hosts.map((h) => metrics(tab, p, filters, { hostname: `eq.${h.label}` })
      .then((l) => asRows(l, (r) => ({ key: `${h.label}${r.x}`, label: `${h.label}${r.x}`, value: r.y, filter: { key: 'hostname', op: 'eq', value: h.label } })))))
    return lists.flat().sort((a, b) => b.value - a.value)
  }
  const { data, loading } = useRows(load, { tab, by, period, filters }, comparison)
  const col = { path: 'Page', entry: 'Entry page', exit: 'Exit page' }[tab]
  const val = { path: 'Visitors', entry: 'Unique entrances', exit: 'Unique exits' }[tab]
  return (
    <Card
      tabs={[{ key: 'path', label: 'Top pages' }, { key: 'entry', label: 'Entry pages' }, { key: 'exit', label: 'Exit pages' }]}
      tab={tab}
      onTab={setTab}
      onExpand={() => details.open({ path: 'Top pages', entry: 'Entry pages', exit: 'Exit pages' }[tab], { label: col, cols: EXPANDED[tab] }, () => expanded(tab, period, filters, (r) => ({ label: r.x, value: r.y })))}
      controls={<MenuMore label="Break down by" minWidth={200} items={[{ heading: 'Break down by' }, ...[{ key: 'path', label: 'Path' }, { key: 'url', label: 'URL' }].map((o) => ({ key: o.key, label: o.label, current: o.key === by, indicator: o.key === by ? 'dot' : undefined, onClick: () => setBy(o.key) }))]} />}
    >
      <RankedList rows={ranked(data)} total={total} column={col} valueLabel={val} loading={loading} onPick={pick(onFilter)} />
      {details.el}
    </Card>
  )
}

/* ── Locations ────────────────────────────────────────────────────────── */
export function LocationsCard({ period, comparison, filters, total, onFilter }) {
  const [tab, setTab] = useState('map')
  const details = useDetails()
  const rowOf = {
    country: (r) => ({ key: r.x, label: countryName(r.x), value: r.y, icon: <Flag cc={r.x} />, filter: { key: 'country', op: 'eq', value: r.x } }),
    region: (r) => ({ key: r.x, label: REGIONS[r.x] || r.x, value: r.y, icon: <Flag cc={r.country} />, filter: { key: 'region', op: 'eq', value: r.x } }),
    city: (r) => ({ key: `${r.country}${r.x}`, label: r.x, value: r.y, icon: <Flag cc={r.country} />, filter: { key: 'city', op: 'eq', value: r.x } }),
  }
  const type = tab === 'map' ? 'country' : tab
  const { data, loading } = useRows((p) => metrics(type, p, filters).then((l) => asRows(l, rowOf[type])), { type, period, filters }, comparison)
  const col = { country: 'Country', region: 'Region', city: 'City' }[type]
  return (
    <Card
      className="min-h-[437px]" /* the map tab keeps the list tabs' height (plausible.io: ~430 at 402) — switching never jumps */
      tabs={[{ key: 'map', label: 'Map' }, { key: 'country', label: 'Countries' }, { key: 'region', label: 'Regions' }, { key: 'city', label: 'Cities' }]}
      tab={tab}
      onTab={setTab}
      onExpand={() => details.open(`${col === 'City' ? 'Cities' : col === 'Country' ? 'Countries' : 'Regions'}`, { label: col, cols: [{ key: 'value', label: 'Visitors', fmt: fmtNum }, { key: 'share', label: '%', fmt: (v) => `${v}%` }] },
        () => metrics(type, period, filters).then((l) => asRows(l, rowOf[type]).map((r) => ({ ...r, share: total ? Math.round((r.value / total) * 1000) / 10 : 0 }))))}
    >
      {tab === 'map'
        ? <WorldMap rows={data?.rows} loading={loading} onFilter={onFilter} />
        : <RankedList rows={ranked(data)} total={total} column={col} loading={loading} onPick={pick(onFilter)} />}
      {details.el}
    </Card>
  )
}

/* ── Devices ──────────────────────────────────────────────────────────── */
export function DevicesCard({ period, comparison, filters, total, onFilter }) {
  const [tab, setTab] = useState('browser')
  const details = useDetails()
  const rowOf = {
    browser: (r) => ({ key: r.x, label: BROWSERS[r.x]?.[0] || r.x, value: r.y, icon: <Brand name={BROWSERS[r.x]?.[1]} />, filter: { key: 'browser', op: 'eq', value: r.x } }),
    os: (r) => ({ key: r.x, label: r.x, value: r.y, icon: <Brand name={osIcon(r.x)} />, filter: { key: 'os', op: 'eq', value: r.x } }),
    device: (r) => ({ key: r.x, label: r.x[0].toUpperCase() + r.x.slice(1), value: r.y, icon: <Mark name={DEVICES[r.x] || 'monitor'} />, filter: { key: 'device', op: 'eq', value: r.x } }),
  }
  const { data, loading } = useRows((p) => metrics(tab, p, filters).then((l) => asRows(l, rowOf[tab])), { tab, period, filters }, comparison)
  const col = { browser: 'Browser', os: 'Operating system', device: 'Device' }[tab]
  return (
    <Card
      tabs={[{ key: 'browser', label: 'Browsers' }, { key: 'os', label: 'Operating systems' }, { key: 'device', label: 'Devices' }]}
      tab={tab}
      onTab={setTab}
      onExpand={() => details.open({ browser: 'Browsers', os: 'Operating systems', device: 'Devices' }[tab], { label: col, cols: EXPANDED.visitors },
        () => expanded(tab, period, filters, rowOf[tab]))}
    >
      <RankedList rows={ranked(data)} total={total} column={col} loading={loading} onPick={pick(onFilter)} />
      {details.el}
    </Card>
  )
}
