import { DashMetricCard, Sparkline } from '@kolkrabbi/kol-dashboards'

export const stage = 'md'

// Inline fixture — a 14-point visitor trend for the sparkline.
const trend = [38, 42, 51, 47, 58, 61, 55, 66, 72, 64, 78, 81, 76, 90]

export default function DashMetricCardDemo() {
  return (
    <>
      <DashMetricCard
        label="Visitors (30d)"
        value="1,284"
        delta="+12% vs prev period"
        borderColor="var(--kol-palette-blue)"
        sparkline={<Sparkline data={trend} height={28} fill color="var(--kol-palette-blue)" />}
      />
      <DashMetricCard
        label="Avg session"
        value="2m 41s"
        delta="+14s vs prev period"
        borderColor="var(--kol-palette-purple)"
      />
    </>
  )
}
