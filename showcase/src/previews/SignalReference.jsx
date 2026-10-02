import { useState } from 'react'
import { SignalReference } from '@kolkrabbi/kol-hardware'
import { EXPRESSION_SECTIONS, EXPRESSION_TABS } from '@kolkrabbi/kol-hardware/signal'

export const stage = 'md'

export const variants = ['tabs', 'panel', 'popover']
export const sizes = ['sm', 'xs', 'md']

export default function SignalReferencePreview({ variant = 'tabs', size = 'sm' }) {
  const [picked, setPicked] = useState(null)
  return (
    <div className="flex w-80 flex-col gap-3">
      <SignalReference variant={variant} size={size} sections={EXPRESSION_SECTIONS} tabs={EXPRESSION_TABS} onPick={setPicked} />
      <span className="kol-helper-10 text-meta">{picked ? `picked ${picked}` : 'click a code'}</span>
    </div>
  )
}
