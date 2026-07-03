import { useState } from 'react'
import { AsciiCursor, Button } from '@kolkrabbi/kol-component'

export const stage = 'md'

/* Mounted behind a toggle so the overlay (and its window-level click /
 * contextmenu listeners) doesn't hijack the docs page. hideCursor stays
 * on its default (false) here — the native cursor keeps working while
 * the ASCII crosshair shadows it. */
export default function AsciiCursorDemo() {
  const [on, setOn] = useState(false)
  return (
    <div className="flex items-center gap-4">
      <Button onClick={() => setOn((v) => !v)}>{on ? 'Disable ASCII cursor' : 'Enable ASCII cursor'}</Button>
      <p className="kol-mono-12 text-fg-48">Click = firework · right-click = invader · renders nothing on touch or reduced motion</p>
      {on && <AsciiCursor />}
    </div>
  )
}
