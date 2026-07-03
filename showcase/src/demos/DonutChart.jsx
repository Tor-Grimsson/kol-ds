import { DonutChart } from '../workshop/dashboards/index.js'

export const stage = 'md'

// Inline fixture — visit breakdown segments.
const segments = [
  { value: 1483, label: 'New', color: 'var(--kol-palette-green)' },
  { value: 1108, label: 'Returning', color: 'var(--kol-palette-blue)' },
  { value: 186, label: 'Bounced', color: 'var(--kol-palette-red)' },
]

export default function DonutChartDemo() {
  return (
    <div className="flex justify-center py-2">
      <DonutChart segments={segments} size={160} thickness={26} centerLabel="2,777" showLegend />
    </div>
  )
}
