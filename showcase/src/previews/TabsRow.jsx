import { useState } from 'react'
import { TabsRow } from '@kolkrabbi/kol-component'

/* one tab component, four looks — the picker on the toolbar flips it */
export const stage = 'md'
export const variants = ['underline', 'chip', 'text', 'stacked']

const TABS = [
  { id: 'overview', label: 'Overview', icon: 'home-01' },
  { id: 'specimens', label: 'Specimens', icon: 'grid' },
  { id: 'downloads', label: 'Downloads', icon: 'download' },
]

export default function TabsRowPreview({ variant = 'underline' }) {
  const [a, setA] = useState('overview')
  const [b, setB] = useState('specimens')
  return (
    <div className="flex flex-col gap-6 w-full max-w-md">
      <TabsRow look={variant} tabs={TABS} value={a} onChange={setA} />
      {variant === 'underline' && (
        <div className="bg-surface-primary border border-fg-08 rounded overflow-hidden">
          <TabsRow tabs={TABS} value={b} onChange={setB} onClose={() => {}} onMinimise={() => {}} />
        </div>
      )}
    </div>
  )
}
