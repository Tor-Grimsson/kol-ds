import { useState } from 'react'
import { LoaderOverlay, Button } from '@kolkrabbi/kol-component'

export const stage = 'hug'

/**
 * LoaderOverlay is fixed and covers the whole viewport (via FullscreenOverlay).
 * Press Play to mount it over everything; the default full-screen ColorLoader
 * curtain fades in, then click the curtain to slide it up — `onEnter` unmounts
 * the overlay.
 */
export default function LoaderOverlayDemo() {
  const [open, setOpen] = useState(false)

  return (
    <div className="flex flex-col items-start gap-2">
      <Button onClick={() => setOpen(true)}>Play overlay</Button>
      <span className="kol-helper-12 text-fg-48">Covers the viewport — click the curtain to enter.</span>
      {open && <LoaderOverlay onEnter={() => setOpen(false)} />}
    </div>
  )
}
