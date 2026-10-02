import { useState } from 'react'
import { ChannelStrip, Toggle, IconButton } from '@kolkrabbi/kol-hardware'
import { RotaryDial, Slider } from '@kolkrabbi/kol-component'

export const stage = 'md'

export default function ChannelStripPreview() {
  const [on, setOn] = useState(true)
  const [a, setA] = useState(60)
  const [b, setB] = useState(30)
  const [opacity, setOpacity] = useState(80)
  return (
    <ChannelStrip
      power={<Toggle value={on} onChange={setOn} label="on" horizontal />}
      controls={<div className="grid grid-cols-2 gap-2"><RotaryDial label="INT" value={a} onChange={setA} size={36} /><RotaryDial label="HUE" value={b} onChange={setB} size={36} /></div>}
      actions={<IconButton icon="save" title="save" iconSize={14} />}
      faders={<Slider label="Opacity" min={0} max={100} value={opacity} onChange={setOpacity} />}
    />
  )
}
