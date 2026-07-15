import {
  DashboardGrid,
  GridCard,
  DashMetricCard,
  DashChartCard,
  DonutChart,
  LineChart,
  Sparkline,
} from '@kolkrabbi/kol-dashboards'

export const stage = 'full'

// Inline fixtures — a 14-point trend, a 3-series line, a device donut.
const trend = [38, 42, 51, 47, 58, 61, 55, 66, 72, 64, 78, 81, 76, 90]

const series = [
  { data: trend.map((y) => ({ y })), color: 'var(--kol-palette-green)', fill: true },
  { data: trend.map((y) => ({ y: Math.round(y * 0.6) })), color: 'var(--kol-palette-blue)', fill: true },
]

const segments = [
  { value: 1483, label: 'Desktop', color: 'var(--kol-palette-blue)' },
  { value: 1108, label: 'Mobile', color: 'var(--kol-palette-green)' },
  { value: 186, label: 'Tablet', color: 'var(--kol-palette-orange)' },
]

/* The dashboard shell: a container-queried grid (2-col, 4-col from 540px)
 * whose children are GridCard-wrapped cards. Row 1 is four 1x1 metrics;
 * below, a 2x2 chart, a 2x1 donut, and a 2x1 metric with sparkline. */
export default function DashboardGridDemo() {
  return (
    <DashboardGrid>
      <GridCard>
        <DashMetricCard className="h-full" label="Visitors (30d)" value="1,284" delta="+12% vs prev period" borderColor="var(--kol-palette-blue)" sparkline={<Sparkline data={trend} height={24} fill color="var(--kol-palette-blue)" />} />
      </GridCard>
      <GridCard>
        <DashMetricCard className="h-full" label="Pageviews" value="4,912" delta="+8% vs prev period" borderColor="var(--kol-palette-green)" />
      </GridCard>
      <GridCard>
        <DashMetricCard className="h-full" label="Avg session" value="2m 41s" delta="+14s vs prev period" borderColor="var(--kol-palette-purple)" />
      </GridCard>
      <GridCard>
        <DashMetricCard className="h-full" label="Bounce rate" value="38%" delta="-3% vs prev period" borderColor="var(--kol-palette-orange)" />
      </GridCard>

      <GridCard span="2x2">
        <DashChartCard className="h-full" title="Traffic" subtitle="New vs returning" footer="Last 14 days">
          <LineChart series={series} height={220} showArea />
        </DashChartCard>
      </GridCard>
      <GridCard span="2x1">
        <DashChartCard className="h-full" title="Devices" subtitle="Sessions by device">
          <div className="flex justify-center py-2">
            <DonutChart segments={segments} size={120} thickness={20} centerLabel="2,777" showLegend />
          </div>
        </DashChartCard>
      </GridCard>
      <GridCard span="2x1">
        <DashMetricCard className="h-full" label="Total visits" value="2,777" delta="+212 vs prev period" borderColor="var(--kol-palette-teal)" sparkline={<Sparkline data={trend} height={28} fill color="var(--kol-palette-teal)" />} />
      </GridCard>
    </DashboardGrid>
  )
}
