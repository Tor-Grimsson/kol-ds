import { useState } from 'react'
import { MetricTiles, ChangeBadge } from '@kolkrabbi/kol-dashboards'

export const stage = 'lg'

// Inline fixture — a site's month, compared with the month before.
const items = [
  { key: 'visitors', label: 'Unique visitors', value: '12.9k', change: <ChangeBadge now={12864} then={10740} />, range: '1 Oct - 28 Oct', compare: { value: '10.7k', range: '3 Sep - 30 Sep' }, exact: '12,864 vs. 10,740 unique visitors' },
  { key: 'visits', label: 'Total visits', value: '15.2k', change: <ChangeBadge now={15200} then={13100} />, range: '1 Oct - 28 Oct', compare: { value: '13.1k', range: '3 Sep - 30 Sep' } },
  { key: 'pageviews', label: 'Total pageviews', value: '41.8k', change: <ChangeBadge now={41800} then={44100} />, range: '1 Oct - 28 Oct', compare: { value: '44.1k', range: '3 Sep - 30 Sep' } },
  { key: 'vpv', label: 'Views per visit', value: '2.75', change: <ChangeBadge now={2.75} then={3.1} />, range: '1 Oct - 28 Oct', compare: { value: '3.1', range: '3 Sep - 30 Sep' } },
  { key: 'bounce', label: 'Bounce rate', value: '58%', change: <ChangeBadge now={58} then={61} lowerIsBetter />, range: '1 Oct - 28 Oct', compare: { value: '61%', range: '3 Sep - 30 Sep' } },
  { key: 'duration', label: 'Visit duration', value: '1m 42s', change: <ChangeBadge now={102} then={96} />, range: '1 Oct - 28 Oct', compare: { value: '1m 36s', range: '3 Sep - 30 Sep' } },
]

export default function MetricTilesPreview() {
  const [sel, setSel] = useState('visitors')
  return <div className="w-full max-w-[1200px]"><MetricTiles items={items} selected={sel} onSelect={setSel} /></div>
}
