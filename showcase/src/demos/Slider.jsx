import { useState } from 'react'
import { Slider } from '@kolkrabbi/kol-component'

export const stage = 'md'

/* One bare inline row: label · track · editable readout. For a stacked
 * label around a label-less control, use LabeledControl instead. */
export default function SliderDemo() {
  const [v, setV] = useState(40)
  return (
    <>
      <Slider min={0} max={100} value={v} onChange={setV} />
      <Slider label="Opacity" min={0} max={100} value={v} onChange={setV} />
    </>
  )
}
