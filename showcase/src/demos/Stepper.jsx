import { useState } from 'react'
import { Stepper } from '@kolkrabbi/kol-component'

export default function StepperDemo() {
  const [v, setV] = useState(2)
  return <Stepper value={v} onChange={setV} min={0} max={10} />
}
