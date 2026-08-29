import { useState } from 'react'
import { ToggleCheckbox } from '@kolkrabbi/kol-component'

export const variants = ['default', 'media']

/* `media`: the unchecked box carries the media control's solid plate so it
 * reads over a photo — shown here over a dark gradient */
export default function ToggleCheckboxDemo({ variant = 'default' }) {
  const [on, setOn] = useState(false)
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
