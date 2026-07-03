import { LineChart } from '../workshop/dashboards/index.js'

export const stage = 'md'

// Inline fixture — three normalized series (new / returning / bounced).
const series = [
  { data: [52, 61, 58, 47, 40, 55, 66, 72, 64, 78, 81, 92].map((y) => ({ y })), color: 'var(--kol-palette-green)', fill: true },
  { data: [34, 39, 37, 31, 27, 35, 41, 45, 40, 48, 50, 56].map((y) => ({ y })), color: 'var(--kol-palette-blue)', fill: true },
  { data: [19, 22, 20, 17, 14, 19, 23, 25, 22, 26, 27, 30].map((y) => ({ y })), color: 'var(--kol-palette-red)', fill: true },
]

export default function LineChartDemo() {
  return (
    <LineChart
      series={series}
      height={220}
      showArea
      showDots
      xLabels={['Wk 1', 'Wk 2', 'Wk 3', 'Wk 4']}
      yLabels={['0', '50', '100']}
    />
  )
}
