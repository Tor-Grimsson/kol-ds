import { DashStackedBarCard } from '@kolkrabbi/kol-dashboards'

export const stage = 'md'

// Inline fixture — per-day mix of new/returning/bounced (win/draw/loss).
const data = [
  { win: 52, draw: 34, loss: 19, total: 105 },
  { win: 61, draw: 39, loss: 22, total: 122 },
  { win: 47, draw: 31, loss: 17, total: 95 },
  { win: 40, draw: 27, loss: 14, total: 81 },
  { win: 55, draw: 35, loss: 19, total: 109 },
  { win: 66, draw: 41, loss: 23, total: 130 },
  { win: 72, draw: 45, loss: 25, total: 142 },
  { win: 64, draw: 40, loss: 22, total: 126 },
  { win: 78, draw: 48, loss: 26, total: 152 },
  { win: 81, draw: 50, loss: 27, total: 158 },
]

export default function DashStackedBarCardDemo() {
  return (
    <DashStackedBarCard
      title="Traffic mix"
      value="9,412"
      data={data}
      footerLeft="Per day"
      footerRight="new / returning / bounced"
    />
  )
}
