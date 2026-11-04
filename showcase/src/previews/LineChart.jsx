import { useState } from 'react'
import { Card, LineChart } from '@kolkrabbi/kol-dashboards'

export const stage = 'md'

/* default: the plot · float: the exploration's traffic trend — metric selector, legend, y scale, the previous period
 * dashed, the peak · card: the record Metrics page's form — a float Card with the value at the right, 30 days ago → Today */
export const variants = ['default', 'float', 'card']

// Inline fixture — three normalized series (new / returning / bounced).
const series = [
  { data: [52, 61, 58, 47, 40, 55, 66, 72, 64, 78, 81, 92].map((y) => ({ y })), color: 'var(--kol-palette-green)', fill: true },
  { data: [34, 39, 37, 31, 27, 35, 41, 45, 40, 48, 50, 56].map((y) => ({ y })), color: 'var(--kol-palette-blue)', fill: true },
  { data: [19, 22, 20, 17, 14, 19, 23, 25, 22, 26, 27, 30].map((y) => ({ y })), color: 'var(--kol-palette-red)', fill: true },
]

// 28 days of visitors, this period and the one before
const DAYS = ['01 Oct', '05 Oct', '09 Oct', '13 Oct', '17 Oct', '21 Oct', '25 Oct', '28 Oct']
const thisPeriod = [310, 330, 300, 360, 380, 350, 320, 340, 390, 410, 380, 360, 300, 420, 440, 470, 520, 600, 980, 640, 520, 480, 540, 580, 640, 700, 560, 820]
const prevPeriod = thisPeriod.map((v, i) => Math.round(v * 0.8 + Math.sin(i) * 30))
const traffic = [
  { data: thisPeriod.map((y, i) => ({ x: `Day ${i + 1}`, y })), fill: true },
  { data: prevPeriod.map((y, i) => ({ x: `Day ${i + 1}`, y })), dashed: true },
]
const pageviews = [{ data: [12, 14, 13, 18, 16, 22, 30, 24, 26, 34, 28, 40, 33, 36, 29, 44, 38, 42, 35, 31, 30, 37, 41, 39, 36, 48, 45, 52, 46, 60].map((y, i) => ({ x: `Day ${i + 1}`, y })) }]

export default function LineChartPreview({ variant = 'default' }) {
  const [tab, setTab] = useState('visitors')
  if (variant === 'float') {
    return (
      <div className="w-full max-w-[940px] bg-surface-secondary rounded-[var(--kol-float-menu-r)] p-4">
        <LineChart variant="float" series={traffic} height={210} peak={18}
          tabs={[{ key: 'visitors', label: 'Visitors' }, { key: 'pageviews', label: 'Page views' }]} tab={tab} onTab={setTab}
          legend={[{ label: 'This period' }, { label: 'Previous period', dashed: true }]} interval="Daily"
          yLabels={['0', '250', '500', '750', '1,000']} xLabels={DAYS} />
      </div>
    )
  }
  if (variant === 'card') {
    return (
      <div className="w-full max-w-[940px]">
        <Card variant="float" title="Pageviews" meta="Last 30 days" value="1,036">
          <LineChart variant="float" series={pageviews} height={132} rules={4} xLabels={['30 days ago', 'Today']} />
        </Card>
      </div>
    )
  }
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
