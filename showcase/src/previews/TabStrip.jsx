import { useState } from 'react'
import { TabStrip } from '@kolkrabbi/kol-shell'

const OPTIONS = [
  { value: 'grid', label: 'Grid' },
  { value: 'list', label: 'List' },
  { value: 'feed', label: 'Feed' },
]

/* The flat text tabs: the active one at full ink, the rest quiet. */
export default function TabStripPreview() {
  const [v, setV] = useState('grid')
  return <TabStrip options={OPTIONS} value={v} onChange={setV} />
}
