import { useState } from 'react'
import { QuantityStepper } from '@kolkrabbi/kol-component'

export default function QuantityStepperDemo() {
  const [qty, setQty] = useState(2)
  return <QuantityStepper value={qty} onChange={setQty} min={1} max={10} size="md" />
}
