import { useState } from 'react'
import { ChannelStrip, Toggle, IconButton, LED } from '@kolkrabbi/kol-hardware'
import { RotaryDial, Slider, LabeledControl } from '@kolkrabbi/kol-component'

export const meta = {
  title: 'Mixer',
  description: 'The parts a channel mixer is built from',
  category: 'hardware',
  featured: true,
  type: 'reference',
  status: 'active',
  updated: '2026-10-01',
  tags: ['domain/hardware', 'pattern/structure'],
}
export const stage = 'full'

/* THE MIXER, AS ITS PARTS (2026-10-01 — user: "channel strip is … part of mirror system more
 * channel mixer based. but still hardware. it would be its own collection"). A channel strip per
 * source: power, a grid of dials, a column of actions, the sliders, a footer. What the dials do is
 * the consumer's. */
function Channel({ name, hue }) {
  const [on, setOn] = useState(true)
  const [v, setV] = useState({ int: 60, hue, sat: 40, con: 50 })
  const [opacity, setOpacity] = useState(80)
  const [mix, setMix] = useState(50)
  const dial = (key, label) => <RotaryDial label={label} value={v[key]} onChange={(n) => setV((s) => ({ ...s, [key]: n }))} size={36} />
  return (
    <ChannelStrip
      width={280}
      power={<Toggle value={on} onChange={setOn} label={name} horizontal />}
      controls={<div className="grid grid-cols-2 gap-2">{dial('int', 'INT')}{dial('hue', 'HUE')}{dial('sat', 'SAT')}{dial('con', 'CON')}</div>}
      actions={<><IconButton icon="save" title="save" iconSize={14} /><IconButton icon="refresh" title="reset" iconSize={14} momentary /></>}
      faders={<>
        <Slider label="Opacity" min={0} max={100} value={opacity} onChange={setOpacity} readout="value" />
        <Slider label="Mix" min={0} max={100} value={mix} onChange={setMix} readout="value" />
      </>}
      footer={<LabeledControl variant="panel" label="signal" labelPosition="right" gap={6}><LED active={on} color="green" /></LabeledControl>}
    />
  )
}

export default function MixerSet() {
  return (
    <div className="flex flex-wrap gap-4 p-6">
      <Channel name="a" hue={20} />
      <Channel name="b" hue={55} />
      <Channel name="c" hue={80} />
    </div>
  )
}
