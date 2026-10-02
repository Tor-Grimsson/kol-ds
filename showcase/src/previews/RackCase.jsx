import { useState } from 'react'
import { RackCase, RackRow, RackSlot, ModuleFrame, LabeledJack, LED } from '@kolkrabbi/kol-hardware'
import { RotaryDial } from '@kolkrabbi/kol-component'

export const stage = 'full'

function Lfo({ label }) {
  const [on, setOn] = useState(true)
  const [rate, setRate] = useState(40)
  return (
    <ModuleFrame label={label} enabled={on} onToggle={() => setOn((o) => !o)}>
      <div className="flex flex-col items-center gap-4">
        <RotaryDial variant="panel" value={rate} onChange={setRate} label="rate" size="md" />
        <LabeledJack type="out" label="out" />
      </div>
    </ModuleFrame>
  )
}

/* A 40hp case: a 3U row with two modules and open rail beside them, and a 1U row under it. */
export default function RackCasePreview() {
  return (
    <div className="overflow-x-auto">
      <RackCase hp={40}>
        <RackRow height="3u">
          <div style={{ display: 'flex', width: '100%', height: '100%', gap: 2, alignItems: 'flex-start' }}>
            <RackSlot hp={8}><Lfo label="LFO" /></RackSlot>
            <RackSlot hp={10}><Lfo label="VCO" /></RackSlot>
          </div>
        </RackRow>
        <RackRow height="1u">
          <div style={{ display: 'flex', width: '100%', height: '100%', gap: 2, alignItems: 'flex-start' }}>
            <RackSlot hp={12} u={1}>
              <ModuleFrame label="CLK" u={1}>
                <div className="flex items-center justify-center gap-3"><LED active color="yellow" /><LabeledJack type="out" label="out" /></div>
              </ModuleFrame>
            </RackSlot>
          </div>
        </RackRow>
      </RackCase>
    </div>
  )
}
