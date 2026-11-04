import { useState } from 'react'
import { TopControlsBar } from '@kolkrabbi/kol-shell'

/* the one 64 bar (the gap map's row 77): capsule · tabs · search · Panels ▾ · + New task */
const TABS = [
  { value: 'tasks', label: 'Tasks', icon: 'checklist' },
  { value: 'capture', label: 'Capture', icon: 'inbox' },
  { value: 'projects', label: 'Projects', icon: 'folder' },
  { value: 'calendar', label: 'Calendar', icon: 'calendar' },
  { value: 'metrics', label: 'Metrics', icon: 'bar-chart' },
  { value: 'links', label: 'Links', icon: 'link' },
]
const PANELS = [{ label: 'Side panel', icon: 'panel-right', onPress: () => {} }, { label: 'Task index', icon: 'list-bullet', onPress: () => {} }]

export const stage = 'full'

export default function TopControlsBarPreview() {
  const [tab, setTab] = useState('tasks')
  return (
    <TopControlsBar
      document={{ name: 'Studio / Dashboard', onBack: () => {}, menuItems: [{ label: 'Rename', onPress: () => {} }, { label: 'Duplicate', onPress: () => {} }] }}
      tabs={TABS}
      tab={tab}
      onTab={setTab}
      onSearch={() => {}}
      panels={{ items: PANELS }}
      action={{ label: 'New task', onPress: () => {} }}
    />
  )
}
