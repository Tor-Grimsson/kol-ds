import { useState } from 'react'
import { RailFlyout } from '@kolkrabbi/kol-shell'

/* a section's children beside the rail (the gap map's row 130): the card alone, the current row lit */
const ROWS = [
  { path: '/dashboard/tasks', label: 'Tasks', icon: 'checklist', count: 5 },
  { path: '/dashboard/capture', label: 'Capture', icon: 'inbox', count: 3 },
  { path: '/dashboard/projects', label: 'Projects', icon: 'folder' },
  { path: '/dashboard/calendar', label: 'Calendar', icon: 'calendar' },
  { path: '/dashboard/metrics', label: 'Metrics', icon: 'bar-chart' },
  { path: '/dashboard/links', label: 'Links', icon: 'link' },
]

export default function RailFlyoutPreview() {
  const [active, setActive] = useState('/dashboard/tasks')
  return <RailFlyout icon="grid" title="Dashboard" items={ROWS} active={active} onPick={(i) => setActive(i.path)} />
}
