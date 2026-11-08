import { useState } from 'react'
import { ChartHead } from '@kolkrabbi/kol-dashboards'

export const stage = 'md'

// Inline fixture — the series the combined view can draw.
const seriesOptions = [
  { key: 'visitors', label: 'Visitors', color: 'var(--kol-palette-blue)' },
  { key: 'visits', label: 'Visits', color: 'var(--kol-palette-teal)' },
  { key: 'pageviews', label: 'Pageviews', color: 'var(--kol-palette-green)' },
  { key: 'bounces', label: 'Bounces', color: 'var(--kol-palette-red)' },
]

export default function ChartHeadPreview() {
  const [view, setView] = useState('trend')
  const [picked, setPicked] = useState(['visitors', 'pageviews'])
  return (
    <div className="w-full max-w-[720px] bg-surface-secondary rounded" style={{ padding: 'var(--kol-pad-card-lg)' }}>
      <ChartHead title="Unique visitors" view={view} views={[{ id: 'trend', label: 'Unique visitors' }, { id: 'combined', label: 'Combined' }]} onView={setView} seriesOptions={seriesOptions} picked={picked} onPicked={setPicked} />
    </div>
  )
}
