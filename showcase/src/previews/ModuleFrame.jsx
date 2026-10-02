import { useState } from 'react'
import { ModuleFrame, LabeledJack } from '@kolkrabbi/kol-hardware'
import { RotaryDial } from '@kolkrabbi/kol-component'

export const stage = 'md'

export default function ModuleFramePreview() {
  const [on, setOn] = useState(true)
  const [rate, setRate] = useState(40)
  return (
    <div className="w-40 border border-oq-08">
      <ModuleFrame label="LFO" enabled={on} onToggle={() => setOn((o) => !o)}>
        <div className="flex flex-col items-center gap-4">
          <RotaryDial variant="panel" value={rate} onChange={setRate} label="rate" size="md" />
          <LabeledJack type="out" label="out" />
        </div>
      </ModuleFrame>
    </div>
  )
}
