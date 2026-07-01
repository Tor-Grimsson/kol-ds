import { useState } from 'react'
import { LabeledControl, Slider } from '@kolkrabbi/kol-component'

export const Stacked = () => {
  const [v, setV] = useState(24)
  return (
    <div style={{ maxWidth: 280 }}>
      <LabeledControl label="Distance" hint={v.toFixed(1)}>
        <Slider min={-60} max={60} step={0.1} value={v} onChange={setV} />
      </LabeledControl>
    </div>
  )
}

export const Inline = () => {
  const [v, setV] = useState(50)
  return (
    <div style={{ maxWidth: 280 }}>
      <LabeledControl inline label="Weight">
        <Slider variant="minimal" min={0} max={100} value={v} onChange={setV} />
      </LabeledControl>
    </div>
  )
}

export const InlineWithHint = () => {
  const [v, setV] = useState(8)
  return (
    <div style={{ maxWidth: 280 }}>
      <LabeledControl inline label="Blur" hint={`${v}px`} labelWidth={56}>
        <Slider variant="minimal" min={0} max={40} value={v} onChange={setV} />
      </LabeledControl>
    </div>
  )
}
