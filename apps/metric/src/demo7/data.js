/* /demo-7's data layer (plan 2026-10-30-metric-style, W8): periods, the Umami calls through api/demo7.js, and the
 * small formatters. Plausible's dashboard is the spec for what each range, interval and comparison means. */
import { useEffect, useState } from 'react'

export const TZ = 'Atlantic/Reykjavik'
const DAY = 86400000
/* the Umami website was created 2026-03-05 — "All time" starts there */
const SITE_START = new Date('2026-03-05T00:00:00Z').getTime()

/* ── fetching ─────────────────────────────────────────────────────────── */
const cache = new Map()
export const getJson = (url, init) => {
  const key = init ? `${url}::${init.body}` : url
  if (!cache.has(key)) {
    cache.set(key, fetch(url, init).then((r) => r.json()).catch(() => null))
    setTimeout(() => cache.delete(key), 60000)
  }
  return cache.get(key)
}
const one = (p, params) => getJson(`/api/demo7?${new URLSearchParams({ p, ...params })}`)

/* SEVERAL HOSTS (/demo-9's Site toggle list, 12.4): Umami takes one value per filter key — repeated keys keep the last
 * (checked 2026-10-31) — so a hostname array is asked once per host and the answers are added up.
 * ponytail: visitors are summed per host, so someone on two subdomains counts twice; exact only per single host. */
const add = (a, b) => {
  if (a == null) return b
  if (b == null) return a
  if (typeof a === 'number' && typeof b === 'number') return a + b
  if (Array.isArray(a) && Array.isArray(b)) {
    if (Array.isArray(a[0]) || typeof a[0] === 'number') return a.map((v, i) => add(v, b[i]))
    const out = new Map()
    for (const r of [...a, ...b]) {
      const k = r?.x ?? r?.name
      out.set(k, out.has(k) ? add(out.get(k), r) : r)
    }
    return [...out.values()].sort((m, n) => (n.y ?? n.visitors ?? 0) - (m.y ?? m.visitors ?? 0))
  }
  if (typeof a === 'object' && typeof b === 'object') {
    const o = { ...a }
    for (const k of Object.keys(b)) o[k] = typeof b[k] === 'string' ? b[k] : add(a[k], b[k])
    return o
  }
  return a
}
export const umami = (p, params = {}) => {
  const h = params.hostname
  if (!Array.isArray(h)) return one(p, params)
  return Promise.all(h.map((v) => one(p, { ...params, hostname: v }))).then((rs) => rs.reduce(add, null))
}
export const report = (type, parameters) =>
  getJson(`/api/demo7?report=${type}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ parameters }) })

/* `run` returns a promise; the hook re-runs when `key` changes. A new key clears the old value, so nothing shows
 * last period's numbers under this period's dates while it loads. `keep` holds it instead (the 30 s refreshes). */
export function useAsync(run, key, keep = false) {
  const [state, setState] = useState({ data: null, loading: true })
  useEffect(() => {
    let live = true
    setState((s) => ({ data: keep ? s.data : null, loading: true }))
    Promise.resolve(run()).then((data) => live && setState({ data, loading: false }))
    return () => { live = false }
  }, [key])
  return state
}

/* ── ranges, as Plausible's date picker groups them ───────────────────── */
export const RANGE_GROUPS = [
  [{ key: 'day', label: 'Today', k: 'D' }, { key: 'yesterday', label: 'Yesterday', k: 'E' }, { key: 'realtime', label: 'Realtime', k: 'R' }],
  [{ key: '24h', label: 'Last 24 Hours', k: 'H' }, { key: '7d', label: 'Last 7 Days', k: 'W' }, { key: '28d', label: 'Last 28 Days', k: 'F' }, { key: '91d', label: 'Last 91 Days', k: 'N' }],
  [{ key: 'month', label: 'Month to Date', k: 'M' }, { key: 'lastmonth', label: 'Last Month', k: 'P' }],
  [{ key: 'year', label: 'Year to Date', k: 'Y' }, { key: '12mo', label: 'Last 12 Months', k: 'L' }],
  [{ key: 'all', label: 'All time', k: 'A' }, { key: 'custom', label: 'Custom Range', k: 'C' }],
]
export const RANGES = RANGE_GROUPS.flat()

const sod = (t) => { const d = new Date(t); d.setHours(0, 0, 0, 0); return d.getTime() }
const som = (t, back = 0) => { const d = new Date(t); d.setHours(0, 0, 0, 0); d.setDate(1); d.setMonth(d.getMonth() - back); return d.getTime() }
const soy = (t) => { const d = new Date(t); d.setHours(0, 0, 0, 0); d.setMonth(0, 1); return d.getTime() }

/* intervals each range allows, first = default (Plausible: minute/hour for a day, day/week for 28 days …) */
const INTERVALS = {
  day: ['hour', 'minute'], yesterday: ['hour', 'minute'], '24h': ['hour'], '7d': ['day', 'hour'],
  '28d': ['day', 'week'], '91d': ['day', 'week', 'month'], month: ['day', 'week'], lastmonth: ['day', 'week'],
  year: ['month', 'week', 'day'], '12mo': ['month', 'week', 'day'], all: ['month', 'week', 'day'],
}

export function periodOf(range, custom) {
  const now = Date.now()
  const today = sod(now)
  switch (range) {
    case 'day': return { start: today, end: now }
    case 'yesterday': return { start: today - DAY, end: today - 1 }
    case '24h': return { start: now - DAY, end: now }
    case '7d': return { start: today - 7 * DAY, end: today - 1 }
    case '28d': return { start: today - 28 * DAY, end: today - 1 }
    case '91d': return { start: today - 91 * DAY, end: today - 1 }
    case 'month': return { start: som(now), end: now }
    case 'lastmonth': return { start: som(now, 1), end: som(now) - 1 }
    case 'year': return { start: soy(now), end: now }
    case '12mo': return { start: som(now, 11), end: now }
    case 'all': return { start: SITE_START, end: now }
    case 'custom': return { start: custom.start, end: custom.end }
    default: return { start: today - 28 * DAY, end: today - 1 }
  }
}

export function intervalsOf(range, period) {
  if (INTERVALS[range]) return INTERVALS[range]
  const days = (period.end - period.start) / DAY
  return days <= 1 ? ['hour', 'minute'] : days <= 31 ? ['day', 'week'] : ['day', 'week', 'month']
}

/* the comparison period: previous = the same length just before; year = a year earlier; custom = his dates */
export function comparisonOf(mode, period, customCompare) {
  if (mode === 'previous') { const len = period.end - period.start + 1; return { start: period.start - len, end: period.start - 1 } }
  if (mode === 'year') {
    const shift = (t) => { const d = new Date(t); d.setFullYear(d.getFullYear() - 1); return d.getTime() }
    return { start: shift(period.start), end: shift(period.end) }
  }
  if (mode === 'custom' && customCompare) return customCompare
  return null
}

/* bucket starts for a period + interval, so the chart and the per-bucket stats line up */
export function bucketsOf(period, unit, weekStart = 1) {
  const out = []
  const d = new Date(period.start)
  if (unit === 'minute') d.setSeconds(0, 0)
  else if (unit === 'hour') d.setMinutes(0, 0, 0)
  else d.setHours(0, 0, 0, 0)
  if (unit === 'week') d.setDate(d.getDate() - ((d.getDay() - weekStart + 7) % 7))
  if (unit === 'month') d.setDate(1)
  while (d.getTime() <= period.end && out.length < 1500) {
    out.push(d.getTime())
    if (unit === 'minute') d.setMinutes(d.getMinutes() + 1)
    else if (unit === 'hour') d.setHours(d.getHours() + 1)
    else if (unit === 'day') d.setDate(d.getDate() + 1)
    else if (unit === 'week') d.setDate(d.getDate() + 7)
    else d.setMonth(d.getMonth() + 1)
  }
  return out
}

/* ── filters: Plausible's operators onto Umami's prefixes ────────────── */
export const OPS = [
  { value: 'eq', label: 'is' },
  { value: 'neq', label: 'is not' },
  { value: 'c', label: 'contains' },
  { value: 'dnc', label: 'does not contain' },
]
export const FILTER_LABEL = {
  path: 'Page', hostname: 'Hostname', referrer: 'Source', country: 'Country', region: 'Region', city: 'City',
  browser: 'Browser', os: 'Operating system', device: 'Device', event: 'Goal',
}
export const filterParams = (filters) =>
  Object.fromEntries(filters.map((f) => [f.key, Array.isArray(f.value) ? f.value.map((v) => `${f.op}.${v}`) : `${f.op}.${f.value}`]))

/* ── formatting ───────────────────────────────────────────────────────── */
export const fmtNum = (n) => {
  if (n == null || Number.isNaN(n)) return '0'
  const a = Math.abs(n)
  if (a >= 1e6) return `${+(n / 1e6).toFixed(1)}M`
  if (a >= 1e5) return `${Math.round(n / 1e3)}k`
  if (a >= 1e3) return `${+(n / 1e3).toFixed(1)}k`
  return `${Math.round(n * 100) / 100}`
}
export const fmtDuration = (s) => {
  s = Math.round(s || 0)
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = s % 60
  return h ? `${h}h ${m}m` : m ? `${m}m ${String(sec).padStart(2, '0')}s` : `${sec}s`
}
const dayFmt = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short' })
const dayYearFmt = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
export const fmtDay = (t) => dayFmt.format(t)
export const fmtRange = ({ start, end }) => {
  const y = new Date(start).getFullYear() !== new Date(end).getFullYear()
  const f = y ? dayYearFmt : dayFmt
  return sod(start) === sod(end) ? f.format(start) : `${f.format(start)} - ${f.format(end)}`
}
export const fmtBucket = (t, unit) => {
  const d = new Date(t)
  if (unit === 'minute' || unit === 'hour') return `${dayFmt.format(d)}, ${d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}`
  if (unit === 'month') return d.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
  if (unit === 'week') return `Week of ${dayFmt.format(d)}`
  return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })
}
export const fmtTick = (t, unit) => {
  const d = new Date(t)
  if (unit === 'minute' || unit === 'hour') return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
  if (unit === 'month') return d.toLocaleDateString('en-GB', { month: 'short', year: '2-digit' })
  return dayFmt.format(d)
}

const regionNames = new Intl.DisplayNames(['en'], { type: 'region' })
export const countryName = (cc) => { try { return regionNames.of(cc) } catch { return cc } }

/* the four sites' own hosts and the dev ones never count as sites */
export const isDevHost = (h) => !h || /^(localhost|127\.|192\.168\.|10\.)/.test(h)
