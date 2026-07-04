import { useState } from 'react'
import { QuantityInput } from '@kolkrabbi/kol-component'

export default function QuantityInputDemo() {
  const [qty, setQty] = useState(3)
  return (
    <div className="flex flex-col gap-4">
      <QuantityInput value={qty} onChange={setQty} min={1} max={20} size="md" />
      <QuantityInput value={qty} onChange={setQty} min={1} max={20} size="md" controls="split" />
    </div>
  )
}
