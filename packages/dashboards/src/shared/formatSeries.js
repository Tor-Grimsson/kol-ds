/* Series formatters (kol-dashboards 0.12.0, carried from apps/metric's data.js): counts, durations and the
 * date labels a trend chart and its tiles print. Pure; the consumer picks the locale it already used (en-GB). */
export const formatCount = (n) => {
  if (n == null || Number.isNaN(n)) return '0'
  const a = Math.abs(n)
  if (a >= 1e6) return `${+(n / 1e6).toFixed(1)}M`
  if (a >= 1e5) return `${Math.round(n / 1e3)}k`
  if (a >= 1e3) return `${+(n / 1e3).toFixed(1)}k`
  return `${Math.round(n * 100) / 100}`
}
export const formatDuration = (s) => {
  s = Math.round(s || 0)
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = s % 60
  return h ? `${h}h ${m}m` : m ? `${m}m ${String(sec).padStart(2, '0')}s` : `${sec}s`
}
const dayFmt = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short' })
const dayYearFmt = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
const sod = (t) => { const d = new Date(t); d.setHours(0, 0, 0, 0); return d.getTime() }
export const formatRange = ({ start, end }) => {
  const y = new Date(start).getFullYear() !== new Date(end).getFullYear()
  const f = y ? dayYearFmt : dayFmt
  return sod(start) === sod(end) ? f.format(start) : `${f.format(start)} - ${f.format(end)}`
}
export const formatBucket = (t, unit) => {
  const d = new Date(t)
  if (unit === 'minute' || unit === 'hour') return `${dayFmt.format(d)}, ${d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}`
  if (unit === 'month') return d.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
  if (unit === 'week') return `Week of ${dayFmt.format(d)}`
  return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })
}
export const formatTick = (t, unit) => {
  const d = new Date(t)
  if (unit === 'minute' || unit === 'hour') return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
  if (unit === 'month') return d.toLocaleDateString('en-GB', { month: 'short', year: '2-digit' })
  return dayFmt.format(d)
}
