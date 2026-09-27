import { useMemo, useState } from 'react'
import { SignalScope } from '@kolkrabbi/kol-hardware'
import { compileExpression } from '@kolkrabbi/kol-hardware/signal'
import { Input } from '@kolkrabbi/kol-component'

export const stage = 'lg'

export default function SignalScopeDemo() {
  const [expr, setExpr] = useState('wave(t)+saw(t*2)*0.3')
  const { fn } = useMemo(() => compileExpression(expr), [expr])
  return (
    <div className="flex w-full flex-col gap-2">
      <Input value={expr} onCommit={(v) => setExpr(v || 'wave(t)')} aria-label="Expression" />
      <SignalScope sample={(t) => fn(t, Math.round(t * 60), 0, 100)} height={200} />
    </div>
  )
}
