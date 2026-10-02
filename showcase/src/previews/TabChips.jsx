import { useState } from 'react'
import { TabChips } from '@kolkrabbi/kol-component'

const TABS = [{ id: 'pnpm', label: 'pnpm' }, { id: 'npm', label: 'npm' }, { id: 'yarn', label: 'yarn' }, { id: 'bun', label: 'bun' }]

/* The tab chips every preview card and install block on this site wears. */
export default function TabChipsPreview() {
  const [v, setV] = useState('pnpm')
  return <TabChips tabs={TABS} value={v} onChange={setV} ariaLabel="Package manager" />
}
