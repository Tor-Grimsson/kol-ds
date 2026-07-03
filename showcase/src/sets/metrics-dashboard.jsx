import MetricsDashboard from '../workshop/metrics/MetricsDashboard.jsx'

export const meta = {
  title: 'Metrics dashboard',
  description: 'The KOL metrics dashboard — KPI cards, charts, deploys, and storage panels',
  category: 'dashboard',
  featured: true,
}
export const stage = 'full'

/* The monorepo /metrics route, ported verbatim with ONE adaptation: the data
 * hook always renders its *_FALLBACK mock data (same shape as the live
 * /api/metrics responses — see workshop/metrics/useMetricsData.js). Cards and
 * charts come from the ported workshop/dashboards family. */
export default function MetricsDashboardSet() {
  return <MetricsDashboard />
}
