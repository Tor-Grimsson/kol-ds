import { useState } from 'react'
import { QuantityInput } from '@kolkrabbi/kol-component'

/* Both control layouts ramp inline; size rides the toolbar picker. `float` (float-everything W2 row 24): the capsule stepper. */
export const variants = ['default', 'float', 'folio', 'kolbox']
export const sizes = ['sm', 'md', 'lg']

export default function QuantityInputPreview({ variant = 'default', size = 'md' }) {
  const [qty, setQty] = useState(3)
  const [size16, setSize16] = useState(16)
  /* folio (Folio batch A, 2026-11-22): the reader's text size, stepping by 2 */
  if (variant === 'folio') return <div data-folio-theme="light" className="w-48 rounded bg-[var(--kol-folio-paper)] p-4 text-[var(--kol-folio-ink)]"><QuantityInput variant="folio" down="A−" up="A+" downLabel="Smaller text" upLabel="Larger text" value={size16} min={14} max={22} step={2} unit="px" onChange={setSize16} /></div>
  /* kolbox (Folio on kolbox, 2026-11-22): kolbox's field between its − and + icon buttons */
  if (variant === 'kolbox') return <div className="w-48"><QuantityInput variant="kolbox" downLabel="Smaller text" upLabel="Larger text" ariaLabel="Text size" value={size16} min={14} max={22} step={2} unit="px" onChange={setSize16} /></div>
  if (variant === 'float') return <QuantityInput variant="float" value={qty} onChange={setQty} min={1} max={20} size={size} />
  return (
    <div className="flex flex-col gap-4">
      <QuantityInput value={qty} onChange={setQty} min={1} max={20} size={size} />
      <QuantityInput value={qty} onChange={setQty} min={1} max={20} size={size} controls="split" />
    </div>
  )
}
