import { useState } from 'react'
import { Button } from '@kolkrabbi/kol-component'
import { Card, Legend, LineChart, ProportionBar, Sparkline, WeeklyBars } from '@kolkrabbi/kol-dashboards'
import FamilyPage, { Part } from '../FamilyPage.jsx'

/* Charts (24-float-system.md § The parts, by family, row 10) — every part live from kol-dashboards. */


const day = (i) => `${String(i + 1).padStart(2, '0')} Oct`
const THIS = [300, 330, 310, 400, 390, 280, 260, 360, 400, 420, 380, 430, 300, 300, 460, 480, 520, 910, 680, 540, 420, 390, 510, 560, 600, 630, 440, 800]
const PREV = [220, 260, 280, 300, 320, 240, 190, 290, 330, 330, 350, 400, 240, 250, 400, 420, 450, 700, 500, 440, 380, 300, 410, 480, 470, 520, 420, 640]
const SERIES = [
  { data: THIS.map((y, i) => ({ x: day(i), y })), fill: true },
  { data: PREV.map((y, i) => ({ x: day(i), y })), dashed: true },
]
const LEGEND = [{ label: 'This period' }, { label: 'Previous period', dashed: true }]
const SHIPPED = [3, 5, 4, 6, 2, 7, 5, 8, 6, 9, 7, 6, 8, 10, 9, 7, 11, 9, 12, 10, 8, 11, 13, 12, 10, 14, 12, 15, 13, 16]
const CARD_SERIES = [{ data: SHIPPED.map((y, i) => ({ x: `d${i}`, y })), fill: true }]
const WEEKS = [
  { label: '01–07', count: 13 },
  { label: '08–14', count: 19 },
  { label: '15–21', count: 24 },
  { label: '22–28', count: 31, current: true },
]
const DEVICES = [{ label: 'Desktop', value: 70 }, { label: 'Mobile', value: 27 }, { label: 'Tablet', value: 3 }]

export default function Charts() {
  const [metric, setMetric] = useState('visitors')

  return (
    <FamilyPage title="Charts" body="The traffic trend and its card form, and the small charts that sit in tiles and cards.">
      {() => (
        <>
          <Part name="LineChart float" slug="line-chart">
            <div className="flex w-full flex-col gap-4">
              <span className="kol-float-label text-fg-64">Selector · legend · scales</span>
              <div className="min-w-0 rounded-[var(--kol-float-menu-r)] bg-surface-secondary p-4">
                <LineChart variant="float" series={SERIES} height={210} peak={17}
                  tabs={[{ key: 'visitors', label: 'Visitors' }, { key: 'views', label: 'Page views' }]} tab={metric} onTab={setMetric}
                  legend={LEGEND} interval="DAILY"
                  yLabels={['0', '250', '500', '750', '1,000']} xLabels={['01 Oct', '05 Oct', '09 Oct', '13 Oct', '17 Oct', '21 Oct', '25 Oct', '28 Oct']} />
              </div>
              <span className="kol-float-label text-fg-64">The card form</span>
              <div className="w-full max-w-[420px]">
                <Card variant="float" title="Shipped" meta="LAST 30 DAYS" value="302">
                  <LineChart variant="float" series={CARD_SERIES} height={120} rules={4} xLabels={['30 days ago', 'Today']} />
                </Card>
              </div>
            </div>
          </Part>

          <Part name="Sparkline" slug="sparkline">
            <div className="w-40"><Sparkline data={[5, 6, 5, 7, 6, 8, 7, 9]} height={32} strokeWidth={1.5} /></div>
            <div className="w-40"><Sparkline data={[9, 8, 9, 7, 7, 6, 7, 5]} height={32} strokeWidth={1.5} fill /></div>
          </Part>

          <Part name="WeeklyBars" slug="weekly-bars">
            <div className="w-full max-w-[320px]"><WeeklyBars weeks={WEEKS} height={70} /></div>
          </Part>

          <Part name="ProportionBar" slug="proportion-bar">
            <div className="w-full max-w-[420px]"><ProportionBar segments={DEVICES} /></div>
          </Part>

          <Part name="Legend" slug="legend">
            <Legend items={LEGEND} interval="DAILY" />
          </Part>
        </>
      )}
    </FamilyPage>
  )
}
