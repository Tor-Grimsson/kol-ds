import { ScatterPlot } from '../workshop/dashboards/index.js'

export const stage = 'md'

// Inline fixture — sessions plotted by page depth (x) vs duration in seconds (y).
const data = [
  { id: 's1', x: 12, y: 340 }, { id: 's2', x: 28, y: 620 },
  { id: 's3', x: 45, y: 210 }, { id: 's4', x: 63, y: 1180 },
  { id: 's5', x: 78, y: 540 }, { id: 's6', x: 92, y: 1650 },
  { id: 's7', x: 110, y: 880 }, { id: 's8', x: 128, y: 2100 },
  { id: 's9', x: 141, y: 1320 }, { id: 's10', x: 160, y: 2480 },
  { id: 's11', x: 175, y: 1740 }, { id: 's12', x: 188, y: 2760 },
]

export default function ScatterPlotDemo() {
  return (
    <ScatterPlot
      data={data}
      maxX={200}
      maxY={3000}
      xLabels={[50, 100, 150, 200]}
      yLabels={[0, 1000, 2000, 3000]}
      pointColor="var(--kol-palette-blue)"
      height={260}
    />
  )
}
