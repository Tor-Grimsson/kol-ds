import { useState } from 'react'
import { QuantityInput } from '@kolkrabbi/kol-component'

/* Both control layouts ramp inline; size rides the toolbar picker. `float` (float-everything W2 row 24): the capsule stepper. */
export const variants = ['default', 'float']
export const sizes = ['sm', 'md', 'lg']

export default function QuantityInputPreview({ variant = 'default', size = 'md' }) {
  const [qty, setQty] = useState(3)
  if (variant === 'float') return <QuantityInput variant="float" value={qty} onChange={setQty} min={1} max={20} size={size} />
  return (
    <div className="flex flex-col gap-4">
      <QuantityInput value={qty} onChange={setQty} min={1} max={20} size={size} />
      <QuantityInput value={qty} onChange={setQty} min={1} max={20} size={size} controls="split" />
    </div>
  )
}
