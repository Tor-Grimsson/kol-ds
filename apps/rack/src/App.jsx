import { useState } from 'react'
import { RackCase, RackRow, RackSlot, ModuleFrame, LabeledJack, JackSocket, LED, Toggle, RockerSwitch, IconButton, ParamSheet } from '@kolkrabbi/kol-hardware'
import { Knob, Slider, LabeledControl } from '@kolkrabbi/kol-component'

/* THE RACK TEST BED (user ruling 2026-10-02): a case with a 3U row and a 1U row, modules with
 * headers, labeled controls in BOTH row heights, and the touch hold — hold a knob or a slider
 * still for 500ms on a touch screen and it opens `ParamSheet`, the same value at full width.
 * Nothing is wired: no audio, no routing. The showcase's Rack set mounts this file, so the set
 * and the app cannot drift. */
const ROW = { display: 'flex', width: '100%', height: '100%', gap: 2, alignItems: 'flex-start' }

const START = { freq: 40, fine: 0, rate: 30, level: 70, send: 50, pan: 0, depth: 25 }

export default function App() {
  const [values, setValues] = useState(START)
  const [on, setOn] = useState({ vco: true, lfo: true, vca: true, util: true, mod: true })
  const [sync, setSync] = useState(false)
  const [mute, setMute] = useState(false)
  /* the control being held — its key, and what the control reported (label · min · max · default) */
  const [held, setHeld] = useState(null)

  const set = (key) => (n) => setValues((v) => ({ ...v, [key]: n }))
  /* one control's wiring: its value, its change, and the hold that opens the sheet */
  const ctl = (key) => ({ value: values[key], onChange: set(key), onHold: (p) => setHeld({ key, ...p }) })
  const power = (key) => ({ enabled: on[key], onToggle: () => setOn((o) => ({ ...o, [key]: !o[key] })) })

  return (
    <div className="overflow-x-auto p-6">
      <RackCase hp={48}>
        <RackRow height="3u">
          <div style={ROW}>
            <RackSlot hp={12}>
              <ModuleFrame label="VCO" {...power('vco')}>
                <div className="flex flex-col items-center gap-4">
                  <Knob variant="panel" {...ctl('freq')} label="freq" size="lg" />
                  <Knob variant="panel" {...ctl('fine')} label="fine" bipolar size="sm" />
                  <div className="flex gap-3"><LabeledJack type="in" label="v/oct" /><LabeledJack type="out" label="out" /></div>
                </div>
              </ModuleFrame>
            </RackSlot>
            <RackSlot hp={10}>
              <ModuleFrame label="LFO" {...power('lfo')}>
                <div className="flex flex-col items-center gap-4">
                  <Knob variant="panel" {...ctl('rate')} label="rate" size="md" />
                  <Toggle value={sync} onChange={setSync} label="sync" />
                  <LabeledControl variant="panel" label="clk" gap={4}><LED active={on.lfo} color="yellow" /></LabeledControl>
                  <LabeledJack type="out" label="out" />
                </div>
              </ModuleFrame>
            </RackSlot>
            <RackSlot hp={8}>
              <ModuleFrame label="VCA" {...power('vca')}>
                <div className="flex flex-col items-center gap-4">
                  <Slider variant="panel" {...ctl('level')} label="lvl" direction="vertical" height={120} />
                  <div className="flex gap-3"><LabeledJack type="in" label="in" /><LabeledJack type="out" label="out" /></div>
                </div>
              </ModuleFrame>
            </RackSlot>
          </div>
        </RackRow>
        <RackRow height="1u">
          <div style={ROW}>
            <RackSlot hp={16} u={1}>
              <ModuleFrame label="UTIL" u={1} {...power('util')}>
                <div className="flex items-center justify-around px-2">
                  <LabeledControl variant="panel" label="mute" gap={4}><RockerSwitch on={mute} onToggle={() => setMute((m) => !m)} /></LabeledControl>
                  <LabeledControl variant="panel" label="reset" gap={4}><IconButton icon="refresh" title="reset" momentary /></LabeledControl>
                  <LabeledControl variant="panel" label="out" gap={4}><JackSocket type="out" /></LabeledControl>
                </div>
              </ModuleFrame>
            </RackSlot>
            <RackSlot hp={20} u={1}>
              <ModuleFrame label="MOD" u={1} {...power('mod')}>
                <div className="flex items-center gap-4 px-2">
                  <Knob variant="panel" {...ctl('pan')} label="pan" bipolar size="sm" />
                  <Knob variant="panel" {...ctl('depth')} label="depth" size="sm" />
                  <Slider variant="panel" {...ctl('send')} label="send" />
                </div>
              </ModuleFrame>
            </RackSlot>
          </div>
        </RackRow>
      </RackCase>
      {held && <ParamSheet {...held} value={values[held.key]} onChange={set(held.key)} onClose={() => setHeld(null)} />}
    </div>
  )
}
