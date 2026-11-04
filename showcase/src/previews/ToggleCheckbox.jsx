import { useState } from 'react'
import { ToggleCheckbox } from '@kolkrabbi/kol-component'

export const variants = ['default', 'media', 'float']

/* `media`: the unchecked box carries the media control's solid plate so it
 * reads over a photo — shown here over a dark gradient.
 * `float` (float-everything W2 row 22): the 18 plate, checked the bare glyph */
export default function ToggleCheckboxPreview({ variant = 'default' }) {
  const [on, setOn] = useState(false)
  const [snap, setSnap] = useState(true)
  if (variant === 'float') {
    return (
      <div className="flex items-center gap-6">
        <ToggleCheckbox variant="float" label="Snap" checked={snap} onChange={setSnap} />
        <ToggleCheckbox variant="float" label="Grid" checked={on} onChange={setOn} />
      </div>
    )
  }
  if (variant === 'media') {
    return (
      <div className="relative h-40 w-64 overflow-hidden rounded-[var(--kol-radius-sm)]" style={{ background: 'linear-gradient(135deg, #2a2a30, #8a8a94)' }}>
        <div className="kol-frame-control kol-frame-control--top-left">
          <ToggleCheckbox variant="media" checked={on} onChange={setOn} aria-label="Select" />
        </div>
      </div>
    )
  }
  return <ToggleCheckbox label="ACCEPT" checked={on} onChange={setOn} />
}
