import { useState } from 'react'
import { QuantityInput } from '@kolkrabbi/kol-component'

export default function QuantityInputDemo() {
  const [qty, setQty] = useState(3)
  return (
    <>
      {['sm', 'md', 'lg'].map((size) => (
        <QuantityInput key={size} value={qty} onChange={setQty} min={1} max={20} size={size} />
      ))}
    </>
  )
}
