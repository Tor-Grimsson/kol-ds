import { DashSlotCard, LineChart } from '../workshop/dashboards/index.js'

export const stage = 'lg'

// Inline fixture — a build-time trend plus summary stat tiles.
const series = [
  { data: [42, 39, 44, 41, 46, 38, 40, 45, 43, 47].map((y) => ({ y })), color: 'var(--kol-palette-purple)', fill: true },
]

const items = [
  { label: 'Avg build', value: '42s' },
  { label: 'Fastest', value: '38s' },
  { label: 'Deploys', value: '128' },
  { label: 'Failed', value: '3' },
]

export default function DashSlotCardDemo() {
  return (
    <DashSlotCard
      title="Build performance"
      subtitle="Last 10 deploys"
      icon="stat-chart-a"
      chart={<LineChart series={series} height={140} showArea />}
      items={items}
      footer={{ label: 'Success rate', value: '97.6%' }}
    />
  )
}
