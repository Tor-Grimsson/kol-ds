import { useState } from 'react'
import { RackCase, RackRow, RackSlot, ModuleFrame, LabeledJack, JackSocket, LED, Toggle, RockerSwitch, IconButton } from '@kolkrabbi/kol-hardware'
import { RotaryDial, Slider, LabeledControl } from '@kolkrabbi/kol-component'

export const meta = {
  title: 'Rack',
  description: 'The parts a eurorack is built from',
  category: 'hardware',
  featured: true,
  type: 'reference',
  status: 'active',
  updated: '2026-10-01',
  tags: ['domain/hardware', 'pattern/structure'],
}
export const stage = 'full'

/* THE RACK, AS ITS PARTS (2026-10-01 — user: "I need to be able to find the collection of parts
 * that make up things like the rack"). The case and its 1U / 3U rows, a slot per module, the
 * module frame, and the panel controls inside: knobs, a fader, switches, lights
 * and jacks. Nothing is wired — routing, the registry and the render loop are the consumer's. */
const ROW = { display: 'flex', width: '100%', height: '100%', gap: 2, alignItems: 'flex-start' }

function Osc() {
  const [on, setOn] = useState(true)
  const [freq, setFreq] = useState(40)
  const [fine, setFine] = useState(0)
  return (
    <ModuleFrame label="VCO" enabled={on} onToggle={() => setOn((o) => !o)}>
      <div className="flex flex-col items-center gap-4">
        <RotaryDial variant="panel" value={freq} onChange={setFreq} label="freq" size="lg" />
        <RotaryDial variant="panel" value={fine} onChange={setFine} label="fine" bipolar size="sm" />
        <div className="flex gap-3"><LabeledJack type="in" label="v/oct" /><LabeledJack type="out" label="out" /></div>
      </div>
    </ModuleFrame>
  )
}

function Lfo() {
  const [on, setOn] = useState(true)
  const [rate, setRate] = useState(30)
  const [sync, setSync] = useState(false)
  return (
    <ModuleFrame label="LFO" enabled={on} onToggle={() => setOn((o) => !o)}>
      <div className="flex flex-col items-center gap-4">
        <RotaryDial variant="panel" value={rate} onChange={setRate} label="rate" size="md" />
        <Toggle value={sync} onChange={setSync} label="sync" />
        <LabeledControl variant="panel" label="clk" gap={4}><LED active={on} color="yellow" /></LabeledControl>
        <LabeledJack type="out" label="out" />
      </div>
    </ModuleFrame>
  )
}

function Vca() {
  const [on, setOn] = useState(true)
  const [level, setLevel] = useState(70)
  return (
    <ModuleFrame label="VCA" enabled={on} onToggle={() => setOn((o) => !o)}>
      <div className="flex flex-col items-center gap-4">
        <Slider variant="panel" value={level} onChange={setLevel} label="lvl" direction="vertical" height={120} />
        <div className="flex gap-3"><LabeledJack type="in" label="in" /><LabeledJack type="out" label="out" /></div>
      </div>
    </ModuleFrame>
  )
}

export default function RackSet() {
  const [mute, setMute] = useState(false)
  return (
    <div className="overflow-x-auto p-6">
      <RackCase hp={48}>
        <RackRow height="3u">
          <div style={ROW}>
            <RackSlot hp={12}><Osc /></RackSlot>
            <RackSlot hp={10}><Lfo /></RackSlot>
            <RackSlot hp={8}><Vca /></RackSlot>
          </div>
        </RackRow>
        <RackRow height="1u">
          <div style={ROW}>
            <RackSlot hp={16} u={1}>
              <ModuleFrame label="UTIL" u={1}>
                <div className="flex items-center justify-around px-2">
                  <RockerSwitch on={mute} onToggle={() => setMute((m) => !m)} />
                  <IconButton icon="refresh" title="reset" momentary />
                  <JackSocket type="out" />
                </div>
              </ModuleFrame>
            </RackSlot>
          </div>
        </RackRow>
      </RackCase>
    </div>
  )
}
