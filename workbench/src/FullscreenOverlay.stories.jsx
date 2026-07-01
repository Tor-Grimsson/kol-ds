import { useState } from 'react'
import { FullscreenOverlay, Button } from '@kolkrabbi/kol-component'

export const Toggle = () => {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open overlay</Button>
      <FullscreenOverlay open={open} onClose={() => setOpen(false)}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: 24 }}>
          <span className="kol-mono-12">Fullscreen overlay content</span>
          <span className="kol-helper-12">
            Click the × button, click the backdrop, or press Esc to close.
          </span>
        </div>
      </FullscreenOverlay>
    </>
  )
}
