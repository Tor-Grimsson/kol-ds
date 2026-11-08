import { TrendChart, formatCount } from '@kolkrabbi/kol-dashboards'

export const stage = 'lg'

// Inline fixture — 28 days of visitors with the 28 before them as the faint line, on fixed dates.
const DAY = 86400000
const start = Date.UTC(2026, 9, 1)
const buckets = Array.from({ length: 28 }, (_, i) => start + i * DAY)
const values = [120, 140, 135, 160, 190, 150, 130, 170, 210, 230, 200, 180, 175, 220, 260, 240, 210, 205, 250, 280, 300, 270, 240, 230, 260, 310, 330, 290]
const prev = values.map((v, i) => Math.round(v * (0.7 + (i % 5) * 0.05)))
const metric = { key: 'visitors', label: 'Unique visitors', fmt: formatCount }
const period = { start, end: start + 28 * DAY - 1 }

export default function TrendChartPreview() {
  return (
    <div className="w-full max-w-[1000px]">
      <TrendChart metric={metric} series={[{ buckets, values }, { buckets, values: prev }]} unit="day" period={period} onPick={() => {}} height={320} fit />
    </div>
  )
}
