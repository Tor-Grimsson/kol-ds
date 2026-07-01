import { useState } from 'react'
import { ToggleBracket } from '@kolkrabbi/kol-component'

const Toggle = (props) => {
  const [on, setOn] = useState(false)
  return <ToggleBracket value={on} onToggle={setOn} {...props} />
}

const Column = ({ children }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 260 }}>{children}</div>
)

export const Default = () => (
  <Column>
    <Toggle label="Feature" />
  </Column>
)

export const Plain = () => (
  <Column>
    <Toggle label="Symmetric Editing" variant="plain" />
    <Toggle label="Symmetrical Handles" variant="plain" />
  </Column>
)

export const CustomLabels = () => (
  <Column>
    <Toggle label="Snapping" onLabel="YES" offLabel="NO" />
  </Column>
)
