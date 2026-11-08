import { useState } from 'react'
import { TopStats, ChartHead, ChangeBadge, DeltaBadge } from '@kolkrabbi/kol-dashboards'

export const stage = 'lg'

/* plausible: the metric row over the chart (`children`) · colour: StatTiles lg flush to the top */
export const variants = ['plausible', 'colour']

// Inline fixture — a site's month.
const plausible = [
  { key: 'visitors', label: 'Unique visitors', value: '12.9k', change: <ChangeBadge now={12864} then={10740} />, exact: '12,864 vs. 10,740 unique visitors' },
  { key: 'visits', label: 'Total visits', value: '15.2k', change: <ChangeBadge now={15200} then={13100} /> },
  { key: 'pageviews', label: 'Total pageviews', value: '41.8k', change: <ChangeBadge now={41800} then={44100} /> },
  { key: 'vpv', label: 'Views per visit', value: '2.75', change: <ChangeBadge now={2.75} then={3.1} /> },
  { key: 'bounce', label: 'Bounce rate', value: '58%', change: <ChangeBadge now={58} then={61} lowerIsBetter /> },
  { key: 'duration', label: 'Visit duration', value: '1m 42s', change: <ChangeBadge now={102} then={96} /> },
]
const colour = [
  { key: 'visitors', label: 'Visitors', color: 'var(--kol-palette-blue)', value: '12.9k', delta: <DeltaBadge now={12864} then={10740} variant="canvas" /> },
  { key: 'pageviews', label: 'Pageviews', color: 'var(--kol-palette-green)', value: '41.8k', delta: <DeltaBadge now={41800} then={44100} variant="canvas" /> },
  { key: 'duration', label: 'Avg session', color: 'var(--kol-palette-purple)', value: '1m 42s', delta: <DeltaBadge kind="duration" now={102} then={96} variant="canvas" /> },
  { key: 'bounce', label: 'Bounce rate', color: 'var(--kol-palette-orange)', value: '58%', delta: <DeltaBadge kind="rate" now={58} then={61} variant="canvas" /> },
]

export default function TopStatsPreview({ variant = 'plausible' }) {
  const [sel, setSel] = useState('visitors')
  const [view, setView] = useState('trend')
  return (
    <div className="w-full max-w-[1200px]">
      <TopStats variant={variant} items={variant === 'colour' ? colour : plausible} selected={sel} onSelect={setSel}>
        <ChartHead title="Unique visitors" view={view} views={[{ id: 'trend', label: 'Unique visitors' }, { id: 'combined', label: 'Combined' }]} onView={setView} />
        <div className="kol-helper-12 text-fg-48 py-10 text-center">The chart goes here (TrendChart)</div>
      </TopStats>
    </div>
  )
}
