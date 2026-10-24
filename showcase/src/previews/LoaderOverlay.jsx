import { useState } from 'react'
import { LoaderOverlay, Button } from '@kolkrabbi/kol-component'
import { LoaderIntro } from '@kolkrabbi/kol-foundry'

export const stage = 'hug'

/**
 * LoaderOverlay is fixed and covers the whole viewport (via FullscreenOverlay).
 * Press Play to mount it over everything; the injected full-screen LoaderIntro
 * curtain (foundry, via the `loader` slot) fades in, then click the curtain to
 * slide it up — its `onComplete` unmounts the overlay.
 */
export default function LoaderOverlayPreview() {
  const [open, setOpen] = useState(false)

  return (
    <div className="flex flex-col items-start gap-2">
      <Button onClick={() => setOpen(true)}>Play overlay</Button>
      <span className="kol-mono-12 text-fg-48">Covers the viewport — click the curtain to enter.</span>
      {open && (
        <LoaderOverlay loader={<LoaderIntro dismissOnClick onComplete={() => setOpen(false)} />} />
      )}
    </div>
  )
}
