import { useState } from 'react'
import { PanelsMenu } from '@kolkrabbi/kol-component'

export const stage = 'md'

/* which panels are shown — the action on each row changes it */
export default function PanelsMenuPreview() {
  const [side, setSide] = useState(false)
  const [index, setIndex] = useState(false)
  return (
    <PanelsMenu panels={[
      { id: 'side', name: 'Side panel', meta: 'Properties', state: side ? 'Shown' : 'Hidden', action: side ? 'Hide' : 'Show', primary: !side, onAction: () => setSide((v) => !v) },
      { id: 'index', name: 'Task index', meta: '5 tasks', state: index ? 'Expanded' : 'Folded', action: index ? 'Collapse' : 'Expand', onAction: () => setIndex((v) => !v) },
    ]} />
  )
}
