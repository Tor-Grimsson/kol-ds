import { Histogram } from '../workshop/dashboards/index.js'

export const stage = 'md'

// Inline fixture — session-duration distribution buckets.
const data = [
  { range: '0–10s', count: 182 },
  { range: '10–30s', count: 341 },
  { range: '30–60s', count: 268 },
  { range: '1–2m', count: 197 },
  { range: '2–5m', count: 143 },
  { range: '5–10m', count: 76 },
  { range: '10m+', count: 41 },
]

export default function HistogramDemo() {
  // Histogram fills its flex parent — give it a bounded height.
  return (
    <div className="flex" style={{ height: 220 }}>
      <Histogram data={data} barColor="var(--kol-palette-teal)" />
    </div>
  )
}
