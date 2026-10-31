import { useState } from 'react'
import { DocumentHeader } from '@kolkrabbi/kol-framework'

export const stage = 'full'

/* apps/document's header on the document fixture's names: the client, the plain tabs, the groups as menus */
const TABS = [{ id: 'overview', label: 'Overview' }, { id: 'project', label: 'Project' }, { id: 'plan', label: 'Plan' }, { id: 'quote', label: 'Client quote' }]
const rows = (...labels) => labels.map((label) => ({ label, onClick: () => {} }))
const MENUS = [
  { label: 'Assets', items: rows('Overview', 'Media', 'Logo system', 'Typography', 'Color', 'Brand guide') },
  { label: 'Reference', items: rows('Overview', 'Brief', 'Brand summary', 'Updates') },
  { label: 'Reviews', items: rows('All reviews') },
]

export default function DocumentHeaderPreview() {
  const [tab, setTab] = useState('project')
  return (
    <div className="w-full">
      <DocumentHeader title="Client: ATLAS" tabs={TABS} value={tab} onChange={setTab} menus={MENUS} />
    </div>
  )
}
