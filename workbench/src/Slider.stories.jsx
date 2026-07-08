import { useState } from 'react'
import { Slider } from '@kolkrabbi/kol-component'

const Column = ({ children }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 280 }}>{children}</div>
)

export const Default = () => {
  const [v, setV] = useState(50)
  return (
    <Column>
      <Slider label="Opacity" min={0} max={100} value={v} onChange={setV} />
    </Column>
  )
}

export const Formatted = () => {
  const [speed, setSpeed] = useState(1)
  const [pct, setPct] = useState(50)
  return (
    <Column>
      <Slider
        label="Speed"
        min={0.1}
        max={5}
        step={0.1}
        value={speed}
        onChange={setSpeed}
        formatValue={(v) => `${v.toFixed(1)}×`}
      />
      <Slider
        label="Opacity"
        min={0}
        max={100}
        step={1}
        value={pct}
        onChange={setPct}
        formatValue={(v) => `${Math.round(v)}%`}
      />
    </Column>
  )
}
