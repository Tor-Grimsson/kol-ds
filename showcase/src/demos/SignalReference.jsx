import { useState } from 'react'
import { SignalReference } from '@kolkrabbi/kol-hardware'
import { EXPRESSION_SECTIONS, EXPRESSION_TABS } from '@kolkrabbi/kol-hardware/signal'

export const stage = 'md'

export default function SignalReferenceDemo() {
  const [picked, setPicked] = useState(null)
  return (
    <div className="flex w-80 flex-col gap-3">
      <SignalReference sections={EXPRESSION_SECTIONS} tabs={EXPRESSION_TABS} onPick={setPicked} />
      <span className="kol-helper-10 text-meta">{picked ? `picked ${picked}` : 'click a code'}</span>
    </div>
  )
}
