import { MetricsDashboard } from '@kolkrabbi/kol-dashboards'
import useMetricsData from '../data/metrics/useMetricsData.js'

export const meta = {
  title: 'Metrics dashboard',
  description: 'The KOL metrics dashboard — KPI cards, charts, deploys, and storage panels',
  category: 'dashboard',
  featured: true,
}
export const stage = 'full'

/* Consumer content, injected into the package view (which ships no baked data):
 * the kolkrabbi.io milestone timeline. The dashboard data comes from a local
 * useMetricsData adapter that renders the demo fixtures (same shape as the live
 * /api/metrics responses). Swap the adapter for a live one to wire real data. */
const MILESTONES = [
  { date: '2026-03-05', type: 'ship', text: 'Metrics dashboard live with Umami' },
  { date: '2026-03-05', type: 'ship', text: 'GSAP prints hero + workshop expand-all' },
  { date: '2026-03-04', type: 'ship', text: 'CodeBlock consolidation to @kol/ui' },
  { date: '2026-03-03', type: 'ship', text: 'GLIF image gen + screen recording skills' },
  { date: '2026-03-01', type: 'ship', text: 'Table consolidation + @apply removal' },
  { date: '2026-02-28', type: 'ship', text: 'ShellLayout extracted to @kol/ui' },
  { date: '2026-02-18', type: 'ship', text: '24-print CDN migration' },
  { date: '2025-11-15', type: 'launch', text: 'kolkrabbi.io launched on Vercel' },
  { date: '2025-11-07', type: 'ship', text: 'Chess analytics — 19 cards, 27k games' },
  { date: '2025-10-16', type: 'ship', text: 'Color system refactor — 69 tokens' },
]

export default function MetricsDashboardSet() {
  const data = useMetricsData()
  return <MetricsDashboard data={data} milestones={MILESTONES} mainHost="kolkrabbi.io" />
}
