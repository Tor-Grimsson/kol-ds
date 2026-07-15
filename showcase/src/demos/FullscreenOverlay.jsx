import { useState } from 'react'
import { Button, FullscreenOverlay } from '@kolkrabbi/kol-component'

export const stage = 'hug'

/**
 * FullscreenOverlay is the raw dialog shell — fixed backdrop (.kol-overlay),
 * centered sheet (.kol-overlay-sheet), optional × chrome (.kol-overlay-close).
 * Esc and backdrop click always close; `closeButton` only toggles the ×.
 */
export default function FullscreenOverlayDemo() {
  const [open, setOpen] = useState(false)
  const [closeButton, setCloseButton] = useState(true)

  const launch = (withClose) => {
    setCloseButton(withClose)
    setOpen(true)
  }

  return (
    <div className="flex flex-col items-start gap-2">
      <div className="flex flex-wrap items-center gap-3">
        <Button onClick={() => launch(true)}>Open overlay</Button>
        <Button variant="outline" onClick={() => launch(false)}>
          Open without close button
        </Button>
      </div>
      <span className="kol-helper-12 text-fg-48">
        Esc or a backdrop click closes either way — the × is chrome, not the only exit.
      </span>
      <FullscreenOverlay open={open} onClose={() => setOpen(false)} closeButton={closeButton}>
        <div className="flex max-w-md flex-col gap-4 p-8">
          <h2 className="kol-sans-heading-03">Sheet content</h2>
          <p className="kol-sans-body-02 text-fg-64">
            Anything can live in the sheet — the overlay owns the backdrop, Escape
            handling, body scroll lock, and the optional close button. The content
            area is yours.
          </p>
          <p className="kol-mono-12 text-fg-48">
            {closeButton ? 'closeButton: true — × rendered top right' : 'closeButton: false — Esc / backdrop only'}
          </p>
          <div>
            <Button variant="outline" size="sm" onClick={() => setOpen(false)}>
              Done
            </Button>
          </div>
        </div>
      </FullscreenOverlay>
    </div>
  )
}
