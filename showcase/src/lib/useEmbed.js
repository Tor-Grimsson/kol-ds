import { useLocation } from 'react-router-dom'

/**
 * useEmbed — the ONE embed flag. `?embed=1` on any showcase URL renders the
 * page's MAIN CONTENT ONLY: no TopBar, no sidebar, no TOC rail. For iframing
 * showcase pages into other repos (the website embeds /components the way it
 * already embeds the kol-ds-fxr editor).
 *
 * It reads as LAYOUT state, not per-page state: the two chrome hosts (TopBar,
 * DocLayout) consult it, so every page that renders through them is embeddable
 * with no page-file changes. Deliberately defined by ABSENCE — embed doesn't
 * render an alternate chrome, it skips chrome — so the pending navigation
 * rework has nothing here to keep in sync.
 *
 * LATCHED per document: once a document boots embedded it stays embedded, so
 * following an in-frame link (component → component) can't pop the host's
 * chrome into the iframe mid-session. A fresh document (new URL, no flag) is
 * un-embedded again — the latch is module scope, not storage.
 *
 * NOT a CSS class: chrome is *mounted*, so hiding it visually would still
 * reserve the sidebar rail, the TOC rail, and their sticky scroll containers.
 * Content padding is KEPT (`--kol-pad-section-*`) — the host iframe usually
 * wants the page's own rhythm; only chrome is dropped.
 */

let latched = false

export default function useEmbed() {
  const { search } = useLocation()
  if (!latched) {
    const raw = new URLSearchParams(search).get('embed')
    latched = raw !== null && raw !== '0' && raw !== 'false'
  }
  return latched
}
