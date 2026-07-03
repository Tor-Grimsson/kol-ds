import { DashAlertCard } from '../workshop/dashboards/index.js'

export const stage = 'md'

// Inline fixture — storage summary with per-bucket alert rows.
const alerts = [
  { title: 'website', description: '12.1 GB · 3 recent uploads' },
  { title: 'kol-media', description: '5.3 GB · 2 recent uploads' },
  { title: 'chess-data', description: '1.0 GB · 1 recent upload' },
]

export default function DashAlertCardDemo() {
  return (
    <DashAlertCard
      label="B2 storage"
      value="18.4 GB"
      trend="up"
      trendValue="4,312 objects"
      alerts={alerts}
      footer="3 buckets"
    />
  )
}
