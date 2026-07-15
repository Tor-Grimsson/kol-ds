import { DashTableCard } from '@kolkrabbi/kol-dashboards'

export const stage = 'full'

// Inline fixtures — Vercel deploy history.
const columns = [
  { header: 'Status', accessor: 'state' },
  { header: 'Time', accessor: 'time' },
  { header: 'Build', accessor: 'duration' },
  { header: 'Branch', accessor: 'branch' },
]

const rows = [
  { state: 'READY', time: '2h ago', duration: '42s', branch: 'main' },
  { state: 'READY', time: '1d ago', duration: '39s', branch: 'main' },
  { state: 'ERROR', time: '2d ago', duration: '18s', branch: 'feat/metrics' },
  { state: 'READY', time: '3d ago', duration: '44s', branch: 'main' },
  { state: 'CANCELED', time: '6d ago', duration: '—', branch: 'feat/sets' },
  { state: 'READY', time: '8d ago', duration: '46s', branch: 'main' },
]

export default function DashTableCardDemo() {
  return (
    <DashTableCard
      title="Recent deploys"
      subtitle="Vercel deployment history"
      icon="dashboard-roadmap"
      columns={columns}
      rows={rows}
      footer="6 total deploys"
    />
  )
}
