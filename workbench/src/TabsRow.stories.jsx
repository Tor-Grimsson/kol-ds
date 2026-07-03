import { useState } from 'react'
import { TabsRow } from '@kolkrabbi/kol-component'

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'specimens', label: 'Specimens' },
  { id: 'downloads', label: 'Downloads' },
]

export const Default = () => {
  const [v, setV] = useState('overview')
  return (
    <div style={{ maxWidth: 360 }}>
      <TabsRow tabs={TABS} value={v} onChange={setV} />
    </div>
  )
}

export const WithAffordances = () => {
  const [v, setV] = useState('palette')
  return (
    <div
      className="bg-surface-primary border border-fg-08 rounded overflow-hidden"
      style={{ width: 320 }}
    >
      <TabsRow
        tabs={[
          { id: 'palette', label: 'Palette' },
          { id: 'inspector', label: 'Inspector' },
        ]}
        value={v}
        onChange={setV}
        onClose={() => {}}
        onMinimise={() => {}}
      />
    </div>
  )
}
