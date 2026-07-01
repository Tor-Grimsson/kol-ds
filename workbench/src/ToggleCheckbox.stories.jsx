import { useState } from 'react'
import { ToggleCheckbox } from '@kolkrabbi/kol-component'

const Row = ({ children }) => (
  <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>{children}</div>
)

export const Default = () => {
  const [checked, setChecked] = useState(false)
  return (
    <Row>
      <ToggleCheckbox label="Enable" checked={checked} onChange={setChecked} />
    </Row>
  )
}

export const States = () => {
  const [a, setA] = useState(false)
  const [b, setB] = useState(true)
  return (
    <Row>
      <ToggleCheckbox label="Unchecked" checked={a} onChange={setA} />
      <ToggleCheckbox label="Checked" checked={b} onChange={setB} />
    </Row>
  )
}

export const WithHint = () => {
  const [checked, setChecked] = useState(true)
  return (
    <Row>
      <ToggleCheckbox label="Sync" hint="follows host" checked={checked} onChange={setChecked} />
    </Row>
  )
}

export const NodeLabel = () => {
  const [checked, setChecked] = useState(false)
  return (
    <Row>
      <ToggleCheckbox
        label={<span className="kol-mono-12 tracking-[0.08em]">Grid</span>}
        checked={checked}
        onChange={setChecked}
      />
    </Row>
  )
}
