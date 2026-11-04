import { useState } from 'react'
import { RailTrigger } from '@kolkrabbi/kol-shell'

/* the rail's hidden state (the gap map's row 129): the 44 button, the breadcrumb, the nav as a card on a press */
const NAV = [
  { path: '/', label: 'Home', icon: 'home-01' },
  { path: '/dashboard', label: 'Dashboard', icon: 'grid', sub: [
    { path: '/dashboard/tasks', label: 'Tasks', icon: 'checklist' },
    { path: '/dashboard/capture', label: 'Capture', icon: 'inbox' },
    { path: '/dashboard/projects', label: 'Projects', icon: 'folder' },
    { path: '/dashboard/calendar', label: 'Calendar', icon: 'calendar' },
    { path: '/dashboard/metrics', label: 'Metrics', icon: 'bar-chart' },
    { path: '/dashboard/links', label: 'Links', icon: 'link' },
  ] },
  { path: '/documents', label: 'Documents', icon: 'file-text' },
  { path: '/settings', label: 'Settings', icon: 'settings-01' },
]

export default function RailTriggerPreview() {
  const [path, setPath] = useState('/dashboard/tasks')
  return (
    <div className="min-h-[360px]">
      <RailTrigger title="Studio" items={NAV} currentPath={path} onNavigate={setPath} breadcrumb={['Dashboard', 'Tasks']} />
    </div>
  )
}
