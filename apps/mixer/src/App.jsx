import { useState } from 'react'
import { ChannelStrip, Toggle, IconButton, LED, ParamSheet } from '@kolkrabbi/kol-hardware'
import { Knob, Slider, LabeledControl } from '@kolkrabbi/kol-component'

/* THE MIXER TEST BED (user ruling 2026-10-02): a row of channel strips with their knobs and
 * sliders, and the touch hold — hold a knob or a slider still for 500ms on a touch screen and it
 * opens `ParamSheet`, the same value at full width. Nothing is wired: no audio, no routing. The
 * showcase's Mixer set mounts this file, so the set and the app cannot drift. */
const CHANNELS = [
  { name: 'a', hue: 20 },
  { name: 'b', hue: 55 },
  { name: 'c', hue: 80 },
]
const DIALS = [['int', 'int'], ['hue', 'hue'], ['sat', 'sat'], ['con', 'con']]

const START = Object.fromEntries(CHANNELS.flatMap(({ name, hue }) => [
  [`${name}.int`, 60], [`${name}.hue`, hue], [`${name}.sat`, 40], [`${name}.con`, 50], [`${name}.opacity`, 80], [`${name}.mix`, 50],
]))

export default function App() {
  const [values, setValues] = useState(START)
  const [on, setOn] = useState({ a: true, b: true, c: true })
  /* the control being held — its key, and what the control reported (label · min · max · default) */
  const [held, setHeld] = useState(null)

  const set = (key) => (n) => setValues((v) => ({ ...v, [key]: n }))
  /* one control's wiring: its value, its change, and the hold that opens the sheet */
  const ctl = (key) => ({ value: values[key], onChange: set(key), onHold: (p) => setHeld({ key, ...p }) })

  return (
    <div className="flex flex-wrap gap-4 p-6">
      {CHANNELS.map(({ name }) => (
        <ChannelStrip
          key={name}
          width={280}
          power={<Toggle value={on[name]} onChange={(v) => setOn((o) => ({ ...o, [name]: v }))} label={name} horizontal />}
          controls={(
            <div className="grid grid-cols-2 gap-3">
              {DIALS.map(([key, label]) => <Knob key={key} variant="panel" size="md" label={label} {...ctl(`${name}.${key}`)} />)}
            </div>
          )}
          actions={<><IconButton icon="save" title="save" iconSize={14} /><IconButton icon="refresh" title="reset" iconSize={14} momentary /></>}
          faders={(
            <div className="flex flex-col gap-3">
              <Slider variant="panel" label="opac" {...ctl(`${name}.opacity`)} />
              <Slider variant="panel" label="mix" {...ctl(`${name}.mix`)} />
            </div>
          )}
          footer={<LabeledControl variant="panel" label="signal" labelPosition="right" gap={6}><LED active={on[name]} color="green" /></LabeledControl>}
        />
      ))}
      {held && <ParamSheet {...held} value={values[held.key]} onChange={set(held.key)} onClose={() => setHeld(null)} />}
    </div>
  )
}
