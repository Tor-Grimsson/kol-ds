import { useState } from 'react'
import { TabsRow } from '@kolkrabbi/kol-component'

export const stage = 'md'

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'specimens', label: 'Specimens' },
  { id: 'downloads', label: 'Downloads' },
]

export default function TabsRowDemo() {
  const [a, setA] = useState('overview')
  const [b, setB] = useState('specimens')
  return (
    <div className="flex flex-col gap-6 w-full max-w-md">
      <TabsRow tabs={TABS} value={a} onChange={setA} />
      <div className="bg-surface-primary border border-fg-08 rounded overflow-hidden">
        <TabsRow tabs={TABS} value={b} onChange={setB} onClose={() => {}} onMinimise={() => {}} />
      </div>
    </div>
  )
}
