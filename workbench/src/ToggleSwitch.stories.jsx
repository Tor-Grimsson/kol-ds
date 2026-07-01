import { useState } from 'react'
import { ToggleSwitch } from '@kolkrabbi/kol-component'

const Row = ({ children }) => (
  <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>{children}</div>
)

export const Default = () => {
  const [on, setOn] = useState(false)
  return (
    <Row>
      <ToggleSwitch label="Dark mode" checked={on} onChange={setOn} />
    </Row>
  )
}

export const States = () => {
  const [a, setA] = useState(false)
  const [b, setB] = useState(true)
  return (
    <Row>
      <ToggleSwitch label="Off" checked={a} onChange={setA} />
      <ToggleSwitch label="On" checked={b} onChange={setB} />
    </Row>
  )
}

export const Variants = () => {
  const [a, setA] = useState(true)
  const [b, setB] = useState(true)
  return (
    <Row>
      <ToggleSwitch variant="default" label="Default" checked={a} onChange={setA} />
      <ToggleSwitch variant="plain" label="Plain" checked={b} onChange={setB} />
    </Row>
  )
}

export const WithHint = () => {
  const [on, setOn] = useState(false)
  return (
    <Row>
      <ToggleSwitch label="Invert" hint="flips output" checked={on} onChange={setOn} />
    </Row>
  )
}
