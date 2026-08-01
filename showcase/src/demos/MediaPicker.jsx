import { useMemo, useState } from 'react'
import { createMediaClient } from '@kolkrabbi/kol-media-client'
import { MediaPicker, Button } from '@kolkrabbi/kol-component'

export const stage = 'md'

/* The modal view — the same body as MediaBrowser inside FullscreenOverlay,
 * plus a pick contract: onPick(url, { contentType }) then closes.
 *
 * Escape steps back ONE level: while the lightbox is open the picker hands its
 * overlay a no-op close, so one keypress closes the preview rather than the
 * whole picker. */
export default function MediaPickerDemo() {
  const client = useMemo(() => createMediaClient(), [])
  const [open, setOpen] = useState(false)
  const [picked, setPicked] = useState(null)

  return (
    <div className="flex flex-col items-center gap-4">
      <Button onClick={() => setOpen(true)}>Open picker</Button>
      {picked && <p className="kol-mono-12 text-meta max-w-full truncate">{picked}</p>}
      <MediaPicker
        open={open}
        client={client}
        onClose={() => setOpen(false)}
        onPick={(url) => setPicked(url)}
      />
    </div>
  )
}
