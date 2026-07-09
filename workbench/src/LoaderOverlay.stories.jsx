import { useState } from 'react'
import { LoaderOverlay, Button } from '@kolkrabbi/kol-component'
import { ColorLoader } from '@kolkrabbi/kol-foundry'

/* LoaderOverlay is fixed and covers the viewport (FullscreenOverlay backdrop),
 * so it's mounted behind a toggle. Loader slot: inject the full-screen
 * ColorLoader curtain (foundry) — click it to slide up and fire onComplete
 * (unmounts). Custom: any children mount in place of the loader. */

export const Default = () => {
  const [open, setOpen] = useState(false)
  return (
    <div className="flex flex-col items-start gap-2">
      <Button onClick={() => setOpen(true)}>Open loader overlay</Button>
      <span className="kol-mono-12 text-fg-48">Click the curtain to enter.</span>
      {open && (
        <LoaderOverlay loader={<ColorLoader dismissOnClick onComplete={() => setOpen(false)} />} />
      )}
    </div>
  )
}

export const CustomChildren = () => {
  const [open, setOpen] = useState(false)
  return (
    <div className="flex flex-col items-start gap-2">
      <Button onClick={() => setOpen(true)}>Open with custom content</Button>
      {open && (
        <LoaderOverlay>
          <div className="flex flex-col items-center gap-4">
            <span className="kol-mono-12 text-fg-inverse">Custom overlay content</span>
            <Button onClick={() => setOpen(false)}>Dismiss</Button>
          </div>
        </LoaderOverlay>
      )}
    </div>
  )
}
