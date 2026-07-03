import { useState } from 'react'
import { AsciiCursor, Button } from '@kolkrabbi/kol-component'

/* Both stories mount the overlay behind a toggle — it is a window-level
 * singleton (click/contextmenu listeners, contextmenu suppressed), so it
 * shouldn't be live while browsing other stories. Renders nothing under
 * prefers-reduced-motion or on a coarse pointer — toggle a media query
 * emulation in devtools to verify the hard gate. */

const Hint = ({ children }) => (
  <p className="kol-mono-12 text-fg-48">{children}</p>
)

export const Default = () => {
  const [on, setOn] = useState(false)
  return (
    <div className="flex flex-col gap-3 items-start">
      <Button onClick={() => setOn((v) => !v)}>{on ? 'Disable' : 'Enable'}</Button>
      <Hint>Crosshair follows the pointer (diamond over links/buttons) · click = firework · right-click = invader · native cursor stays visible (hideCursor off)</Hint>
      <a href="#ascii-cursor-hover-target" onClick={(e) => e.preventDefault()} className="kol-mono-12 text-fg-64 underline">hover me — crosshair goes diamond</a>
      {on && <AsciiCursor />}
    </div>
  )
}

export const HideCursor = () => {
  const [on, setOn] = useState(false)
  return (
    <div className="flex flex-col gap-3 items-start">
      <Button onClick={() => setOn((v) => !v)}>{on ? 'Disable' : 'Enable'}</Button>
      <Hint>hideCursor — injects page-wide cursor: none while mounted; restores on blur/mouseleave and cleans up on disable</Hint>
      {on && <AsciiCursor hideCursor />}
    </div>
  )
}
