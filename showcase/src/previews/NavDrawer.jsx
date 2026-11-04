import { useState } from 'react'
import { NavDrawer, Button } from '@kolkrabbi/kol-component'

export const stage = 'md'

const ITEMS = [
  { icon: 'home-01', label: 'Home', path: '/' },
  { icon: 'grid', label: 'Dashboard', path: '/dashboard', sub: [
    { icon: 'checklist', label: 'Tasks', path: '/dashboard/tasks' },
    { icon: 'inbox', label: 'Capture', path: '/dashboard/capture' },
    { icon: 'folder', label: 'Projects', path: '/dashboard/projects' },
    { icon: 'calendar', label: 'Calendar', path: '/dashboard/calendar' },
    { icon: 'bar-chart', label: 'Metrics', path: '/dashboard/metrics' },
    { icon: 'link', label: 'Links', path: '/dashboard/links' },
  ] },
]

/* the hidden nav, called up on demand — drawn in flow here; in an app it sits fixed at the top-left */
export default function NavDrawerPreview() {
  const [open, setOpen] = useState(true)
  const [path, setPath] = useState('/dashboard/tasks')
  if (!open) return <Button variant="float" tone="secondary" size="md" iconLeft="hamburger" onClick={() => setOpen(true)}>Navigation</Button>
  return (
    <NavDrawer open fixed={false} title="Studio" items={ITEMS} currentPath={path} onNavigate={setPath} onClose={() => setOpen(false)}
      footer={<Button variant="float" tone="ghost" size="sm" iconRight="arrow-down">All pages</Button>} />
  )
}
