import { useState } from 'react'
import { LabeledControl, ToggleSwitch } from '@kolkrabbi/kol-component'

const Row = ({ children }) => (
  <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>{children}</div>
)

export const Default = () => {
  const [on, setOn] = useState(false)
  return (
    <Row>
      <LabeledControl horizontal label="Dark mode" labelWidth="fit-content"><ToggleSwitch checked={on} onChange={setOn} aria-label="Dark mode" /></LabeledControl>
    </Row>
  )
}

export const States = () => {
  const [a, setA] = useState(false)
  const [b, setB] = useState(true)
  return (
    <Row>
      <LabeledControl horizontal label="Off" labelWidth="fit-content"><ToggleSwitch checked={a} onChange={setA} aria-label="Off" /></LabeledControl>
      <LabeledControl horizontal label="On" labelWidth="fit-content"><ToggleSwitch checked={b} onChange={setB} aria-label="On" /></LabeledControl>
    </Row>
  )
}

export const Variants = () => {
  const [a, setA] = useState(true)
  const [b, setB] = useState(true)
  return (
    <Row>
      <LabeledControl horizontal label="Default" labelWidth="fit-content"><ToggleSwitch variant="default" checked={a} onChange={setA} aria-label="Default" /></LabeledControl>
      <LabeledControl horizontal label="Plain" labelWidth="fit-content"><ToggleSwitch variant="plain" checked={b} onChange={setB} aria-label="Plain" /></LabeledControl>
    </Row>
  )
}

export const WithHint = () => {
  const [on, setOn] = useState(false)
  return (
    <Row>
      <LabeledControl horizontal label="Invert" hint="flips output" labelWidth="fit-content"><ToggleSwitch checked={on} onChange={setOn} aria-label="Invert" /></LabeledControl>
    </Row>
  )
}
