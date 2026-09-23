import { useState } from 'react'
import { MediaLibraryBrowse } from './MediaLibraryPages.jsx'

/**
 * MediaLibraryExplorer — the media surface, and since 2026-09-22 a thin name for it.
 *
 * IT USED TO BE THE MERGE ITSELF: it held a BROWSE · FILES switch and mounted one of two pages,
 * each of which listed the bucket, drew its own header and printed its own count. The user's read
 * of that (2026-09-22) ended it — *"they both just display files … 4 views, not 2 modes each with
 * 2 views"* — so the surface is ONE page now with four views (columns · rows · grid · list), one
 * listing, one header, one count line and one filter bar, and this component only carries the
 * view state for a consumer that wants to own it.
 *
 * `MediaLibraryBrowse` and `MediaLibraryLibrary` remain exported: the first IS the surface, the
 * second is the standalone wall a site embeds without a tree (kol-website's asset page).
 *
 * @param {'columns'|'rows'|'grid'|'list'} view  controlled view; omit and the page reads its own setting
 * @param {Function} onViewChange  (view) => void
 * @param {'columns'|'rows'|'grid'|'list'} defaultView  first view when uncontrolled and nothing is stored
 */
export default function MediaLibraryExplorer({ view, onViewChange, defaultView, ...pageProps }) {
  const [ownView, setOwnView] = useState(view ?? defaultView)
  const current = view ?? ownView
  return (
    <MediaLibraryBrowse
      {...pageProps}
      view={current}
      onViewChange={(v) => { setOwnView(v); onViewChange?.(v) }}
    />
  )
}
