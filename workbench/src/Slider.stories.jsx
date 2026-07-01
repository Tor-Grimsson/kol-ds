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

export const Variants = () => {
  const [a, setA] = useState(40)
  const [b, setB] = useState(60)
  const [c, setC] = useState(80)
  return (
    <Column>
      <Slider variant="default" label="Default" value={a} onChange={setA} />
      <Slider variant="minimal" label="Minimal" value={b} onChange={setB} />
      <Slider variant="subtle" label="Subtle" value={c} onChange={setC} />
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
        variant="minimal"
        formatValue={(v) => `${v.toFixed(1)}×`}
      />
      <Slider
        label="Opacity"
        min={0}
        max={100}
        step={1}
        value={pct}
        onChange={setPct}
        variant="minimal"
        formatValue={(v) => `${Math.round(v)}%`}
      />
    </Column>
  )
}
