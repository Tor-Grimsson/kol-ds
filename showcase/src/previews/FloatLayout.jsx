import { useState } from 'react'
import { FloatLayout, PropertyRail } from '@kolkrabbi/kol-shell'
import { EmptyState } from '@kolkrabbi/kol-component'
import { Card } from '@kolkrabbi/kol-dashboards'

/* the float workspace frame (kol-float--style 9:15449): nav Rail · the 64 bar · the eyebrow under it · content · the one
 * inspector · the bottom Rail under both (9:14340's Task index, folded here). Hide the inspector (⇥) or the Rail (Hide)
 * and Panels ▾ appears to bring it back. */
const NAV = [
  { heading: 'Workspace' },
  { icon: 'home-01', label: 'Home', path: '/' },
  { icon: 'grid', label: 'Dashboard', path: '/dashboard', sub: [
    { icon: 'checklist', label: 'Tasks', path: '/dashboard/tasks', count: 5 },
    { icon: 'inbox', label: 'Capture', path: '/dashboard/capture', count: 3 },
    { icon: 'bar-chart', label: 'Metrics', path: '/dashboard/metrics' },
  ] },
  { icon: 'file-text', label: 'Documents', path: '/documents' },
  { heading: 'Studio' },
  { icon: 'folder', label: 'Projects', path: '/projects' },
  { icon: 'image', label: 'Prints', path: '/prints' },
  { icon: 'notes', label: 'Notes', path: '/notes' },
]
const TABS = [{ value: 'tasks', label: 'Tasks', count: 5 }, { value: 'capture', label: 'Capture', count: 3 }, { value: 'projects', label: 'Projects' }]

export const frame = 720

export default function FloatLayoutPreview() {
  const [path, setPath] = useState('/dashboard/tasks')
  const [tab, setTab] = useState('tasks')
  const [mode, setMode] = useState('properties')
  const [folded, setFolded] = useState(true)
  return (
    <FloatLayout
      nav={NAV} currentPath={path} onNavigate={setPath} title="Studio" onSearch={() => {}}
      breadcrumb={['Dashboard', 'Tasks']}
      eyebrow={<span className="kol-float-ruler text-fg-64 whitespace-pre">WORKSPACE  /  TASKS</span>}
      bottom={<Card variant="float" title="Task index" count="5 tasks" folded={folded} onFold={() => setFolded(!folded)}><span className="kol-float-label text-oq-64">The bottom Rail — under the content and the inspector.</span></Card>}
      bar={{ document: { name: 'Studio / Dashboard' }, tabs: TABS, tab, onTab: setTab, onSearch: () => {}, action: { label: 'New task', onPress: () => {} } }}
      inspector={({ hide }) => (
        <PropertyRail title="Inspector" onCollapse={hide} tabs={[{ value: 'layers', label: 'Layers' }, { value: 'properties', label: 'Properties' }]} tab={mode} onTab={setMode}
          sections={[{ rows: [{ render: () => <EmptyState variant="float" title="Nothing selected" body="Select a task to see its fields." /> }] }]} />
      )}
    >
      <EmptyState variant="float" eyebrow="Dashboard / Tasks" title="Tasks, in focus." body="The content slot — the page draws here." />
    </FloatLayout>
  )
}
