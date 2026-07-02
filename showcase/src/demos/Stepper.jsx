import { useState } from 'react'
import { Stepper } from '@kolkrabbi/kol-component'

export default function StepperDemo() {
  const [v, setV] = useState(2)
  return (
    <>
      {['sm', 'md', 'lg'].map((size) => (
        <Stepper key={size} value={v} onChange={(e) => setV(e.target.value)} min={0} max={10} size={size} />
      ))}
    </>
  )
}
