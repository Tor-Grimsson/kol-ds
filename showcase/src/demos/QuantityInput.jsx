import { useState } from 'react'
import { QuantityInput } from '@kolkrabbi/kol-component'

/* Both control layouts ramp inline; size rides the toolbar picker. */
export const sizes = ['sm', 'md', 'lg']

export default function QuantityInputDemo({ size = 'md' }) {
  const [qty, setQty] = useState(3)
  return (
    <div className="flex flex-col gap-4">
      <QuantityInput value={qty} onChange={setQty} min={1} max={20} size={size} />
      <QuantityInput value={qty} onChange={setQty} min={1} max={20} size={size} controls="split" />
    </div>
  )
}
