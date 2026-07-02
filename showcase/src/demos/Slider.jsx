import { useState } from 'react'
import { Slider } from '@kolkrabbi/kol-component'

export const stage = 'md'

/* Bare first, then the built-in inline label, then the variant set.
 * Slider's `label` is part of its single-row anatomy (label · track ·
 * editable readout) — for a stacked label around a label-less control,
 * use LabeledControl instead. */
export default function SliderDemo() {
  const [v, setV] = useState(40)
  return (
    <>
      <Slider min={0} max={100} value={v} onChange={setV} />
      <Slider label="Opacity" min={0} max={100} value={v} onChange={setV} />
      <Slider label="Opacity" min={0} max={100} value={v} onChange={setV} variant="minimal" />
      <Slider label="Opacity" min={0} max={100} value={v} onChange={setV} variant="subtle" />
    </>
  )
}
