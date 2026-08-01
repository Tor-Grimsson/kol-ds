import { useMemo } from 'react'
import { createMediaClient } from '@kolkrabbi/kol-media-client'
import { MediaBrowser } from '@kolkrabbi/kol-component'

export const stage = 'full'

/* The full-page view over the live kol-media bucket. The client is INJECTED —
 * kol-component never imports kol-media-client (ARCHITECTURE §3), so every
 * consumer builds one and passes it in, exactly as this demo does.
 *
 * Folders disclose in place (Finder's list model); the grid/list toggle, the
 * animated search and the sort strip are ContentFilters + SegmentedToggle.
 * Without `onSelect` the actions offer Copy URL only — the read-only shape. */
export default function MediaBrowserDemo() {
  const client = useMemo(() => createMediaClient(), [])
  return (
    <div className="h-[32rem] w-full">
      <MediaBrowser client={client} />
    </div>
  )
}
