import { useMemo, useState } from 'react'
import { createMediaClient } from '@kolkrabbi/kol-media-client'
import { MediaPicker, MediaBrowser, Button } from '@kolkrabbi/kol-component'

export const meta = {
  title: 'Media library',
  description: 'The kol-media bucket in both of its views — the modal picker the editor opens, and the full-page browser a brand book embeds, over one injected client',
  category: 'editor',
  featured: true,
  type: 'reference',
  status: 'active',
  updated: '2026-08-01',
  tags: ['domain/design-system', 'pattern/blocks'],
}
export const stage = 'full'

/* The consolidation of four consumer forks, shown as the two views they each
 * hand-rolled separately:
 *
 *   MediaPicker   — the modal kol-ds-fxr opens from the editor footer
 *   MediaBrowser  — the full page kol-website/brand and kol-client-kolkrabbi
 *                   embed, which in their forked form never learned folders
 *
 * THE CLIENT IS INJECTED. kol-component never imports kol-media-client —
 * ARCHITECTURE §3 keeps the clients tier free of UI dependencies in both
 * directions — so this set does what every real consumer does: builds a client
 * and passes it in. Both views share ONE instance, which is the point.
 *
 * FULL BLEED MEANS FULL BLEED. `stage = 'full'` makes /sets/preview/:slug
 * render this edge-to-edge; the first pass then put a bordered, padded box
 * back around the browser and undid it. The browser owns its own box.
 *
 * Talks to the live bucket over the public list endpoint. Read-only — upload /
 * rename / delete stay in kol-media-admin. */

export default function MediaLibrarySet() {
  const client = useMemo(() => createMediaClient(), [])
  const [pickerOpen, setPickerOpen] = useState(false)
  const [picked, setPicked] = useState(null)

  return (
    <div className="flex h-full min-h-0 w-full flex-col">
      <header className="flex shrink-0 items-center gap-4 border-b border-fg-08 px-5 py-3">
        <Button size="sm" onClick={() => setPickerOpen(true)}>Open picker</Button>
        <span className="kol-helper-12 text-meta">
          The modal view. The page below is the same body without the shell.
        </span>
        {picked && <span className="kol-mono-12 text-meta ml-auto truncate">picked: {picked}</span>}
      </header>

      <div className="min-h-0 flex-1 px-5 py-4">
        <MediaBrowser client={client} />
      </div>

      <MediaPicker
        open={pickerOpen}
        client={client}
        onClose={() => setPickerOpen(false)}
        onPick={(url) => setPicked(url)}
      />
    </div>
  )
}
