import { DashChartCard, DonutChart } from '@kolkrabbi/kol-dashboards'

export const stage = 'md'

// Inline fixture — device session breakdown.
const segments = [
  { value: 1483, label: 'Desktop', color: 'var(--kol-palette-blue)' },
  { value: 1108, label: 'Mobile', color: 'var(--kol-palette-green)' },
  { value: 186, label: 'Tablet', color: 'var(--kol-palette-orange)' },
]

export default function DashChartCardDemo() {
  return (
    <DashChartCard title="Devices" subtitle="Sessions by device" icon="stat-chart-a" footer="Last 30 days">
      <div className="flex justify-center py-2">
        <DonutChart segments={segments} size={140} thickness={22} centerLabel="2,777" showLegend />
      </div>
    </DashChartCard>
  )
}
