import { useState } from 'react'
import { ToggleCheckbox } from '@kolkrabbi/kol-component'

export default function ToggleCheckboxDemo() {
  const [on, setOn] = useState(false)
  return <ToggleCheckbox label="Accept" checked={on} onChange={setOn} />
}
