import { DashFeaturedCard, LineChart } from '../workshop/dashboards/index.js'

export const stage = 'full'

// Inline fixture — 14 days of traffic (win = new, draw = returning, loss = bounced).
const dailyVisits = [
  { win: 52, draw: 34, loss: 19 }, { win: 61, draw: 39, loss: 22 },
  { win: 58, draw: 37, loss: 20 }, { win: 47, draw: 31, loss: 17 },
  { win: 40, draw: 27, loss: 14 }, { win: 55, draw: 35, loss: 19 },
  { win: 66, draw: 41, loss: 23 }, { win: 72, draw: 45, loss: 25 },
  { win: 64, draw: 40, loss: 22 }, { win: 78, draw: 48, loss: 26 },
  { win: 81, draw: 50, loss: 27 }, { win: 70, draw: 44, loss: 24 },
  { win: 88, draw: 53, loss: 29 }, { win: 92, draw: 56, loss: 30 },
]

const dailyToSeries = (visits) => [
  { data: visits.map((d) => ({ y: d.win })), color: 'var(--kol-palette-green)', fill: true },
  { data: visits.map((d) => ({ y: d.draw })), color: 'var(--kol-palette-blue)', fill: true },
  { data: visits.map((d) => ({ y: d.loss })), color: 'var(--kol-palette-red)', fill: true },
]

const sum = (key) => dailyVisits.reduce((s, d) => s + d[key], 0).toLocaleString()

export default function DashFeaturedCardDemo() {
  return (
    <DashFeaturedCard
      badge="Last 14 days"
      title="Site Traffic"
      icon="trending"
      description="New visitors, returning visitors, and bounces."
      metricLabel="Total visits"
      metricValue="9,412"
      chart={<LineChart series={dailyToSeries(dailyVisits)} height={200} showArea />}
      legends={[
        { label: 'New', detail: sum('win'), color: 'var(--kol-palette-green)' },
        { label: 'Returning', detail: sum('draw'), color: 'var(--kol-palette-blue)' },
        { label: 'Bounced', detail: sum('loss'), color: 'var(--kol-palette-red)' },
      ]}
    />
  )
}
