import { useMemo, useState } from 'react'
import { createMediaClient } from '@kolkrabbi/kol-media-client'
import { MediaPicker, MediaLibrary, Button } from '@kolkrabbi/kol-component'

export const stage = 'md'

/* The modal view — the same body as MediaBrowser inside FullscreenOverlay,
 * plus a pick contract: onPick(url, { contentType }) then closes.
 *
 * Escape steps back ONE level: while the lightbox is open the picker hands its
 * overlay a no-op close, so one keypress closes the preview rather than the
 * whole picker. */
export const variants = ['default', 'float']

/* float (W6 row 87): the asset window — a fixture client, so it lists without a bucket */
const COVER = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="44" height="54"><defs><radialGradient id="g" cx=".55" cy=".5" r=".5"><stop offset="0" stop-color="#f6e7b0"/><stop offset=".45" stop-color="#c98a3a"/><stop offset="1" stop-color="#2a2622"/></radialGradient></defs><rect width="44" height="54" fill="url(#g)"/></svg>')}`
const FIXTURE = {
  listMedia: async () => [{ key: 'luminous-portrait.png', size: 1843200, contentType: 'image/png', lastModified: '2026-11-01T10:00:00Z' }],
  mediaUrl: () => COVER,
}

function FloatPicker() {
  const [open, setOpen] = useState(true)
  if (!open) return <Button variant="float" tone="secondary" size="md" onClick={() => setOpen(true)}>Scene assets</Button>
  return <MediaLibrary variant="float" open client={FIXTURE} title="Scene assets" onClose={() => setOpen(false)} onSelect={() => {}} onImport={() => {}} importLabel="Import image" />
}

export default function MediaPickerPreview({ variant = 'default' }) {
  if (variant === 'float') return <FloatPicker />
  return <ModalPicker />
}

function ModalPicker() {
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
