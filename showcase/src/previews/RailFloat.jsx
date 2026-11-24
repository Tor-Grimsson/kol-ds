import { useState } from 'react'
import { RailFloat, LabeledControl, Slider, ToggleSwitch } from '@kolkrabbi/kol-component'

export const stage = 'hug'

/* the float Rail shell: header, body, fold — open and folded side by side */
export default function RailFloatPreview() {
  const [v, setV] = useState(64)
  const [on, setOn] = useState(true)
  return (
    <div className="dark flex flex-wrap items-start gap-6">
      <RailFloat title="Layer" foldable>
        <LabeledControl variant="float" horizontal label="Visible">
          <div className="flex w-full justify-end"><ToggleSwitch variant="float" checked={on} onChange={setOn} aria-label="Visible" /></div>
        </LabeledControl>
        <LabeledControl variant="float" label="Opacity" hint={`${v}%`}>
          <Slider variant="float" aria-label="Opacity" value={v} onChange={setV} />
        </LabeledControl>
      </RailFloat>
      <RailFloat title="Layer" foldable defaultFolded />
    </div>
  )
}
