import { useEffect, useRef, useState } from 'react'
import { MediaLibraryBrowse } from './MediaLibraryPages.jsx'
import { useModal } from '../molecules/Modal.jsx'
import useMediaQuery from '../hooks/useMediaQuery.js'

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
 *
 * THE TOOL'S OWN BEHAVIOUR, opt-in (media parity, 2026-09-26 — user: "media in shell is just media in
 * shell.. so there shouldnt really be a reason to diff"). apps/media carried these in its App.jsx, so
 * the same tool one shell over had none of them. They are the product's, so they live with it:
 *
 * @param {boolean}  keys       the view keys — B browse · F files · R rows · C columns · G grid — and N
 *                              (new folder, when `fileActions.createFolder` is given), plus K → `onKinds`.
 *                              Ignored while typing and with ⌘ / Ctrl / ⌥ held
 * @param {boolean}  phoneTabs  below 768 the surface is three tabs — Browse · Files · Kinds (Kinds only
 *                              with `onKinds`); a tab picks the view, Kinds opens the overview and leaves
 *                              the surface where it was
 * @param {Function} onKinds    opens the app's file-formats overview (K, the Kinds tab)
 */
const TABS = [
  { value: 'browse', label: 'Browse', icon: 'folder' },
  { value: 'files', label: 'Files', icon: 'view-list' },
  { value: 'kinds', label: 'Kinds', icon: 'grid' },
]
/* a key → the view it shows and the phone tab that view belongs to (apps/media's map, verbatim) */
const VIEW_KEYS = { b: ['columns', 'browse'], f: ['list', 'files'], r: ['rows', 'browse'], c: ['columns', 'browse'], g: ['grid', 'files'] }

export default function MediaLibraryExplorer({ view, onViewChange, defaultView, keys = false, phoneTabs = false, onKinds, ...pageProps }) {
  const [ownView, setOwnView] = useState(view ?? defaultView)
  const current = view ?? ownView
  const setView = (v) => { setOwnView(v); onViewChange?.(v) }
  const [tab, setTab] = useState('browse')
  const phone = useMediaQuery('(max-width: 767px)')
  const modal = useModal()

  /* the latest props for the key handler, without re-binding it every render */
  const live = useRef()
  live.current = { onKinds, prefix: pageProps.prefix ?? '', createFolder: pageProps.fileActions?.createFolder, modal }
  useEffect(() => {
    if (!keys) return undefined
    const onKey = (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      const el = e.target
      if (el?.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el?.tagName ?? '')) return
      const { onKinds: kinds, prefix, createFolder, modal: m } = live.current
      if (VIEW_KEYS[e.key]) {
        e.preventDefault()
        const [v, t] = VIEW_KEYS[e.key]
        setOwnView(v); onViewChange?.(v); setTab(t)
      } else if (e.key === 'k' && kinds) {
        e.preventDefault(); kinds()
      } else if (e.key === 'n' && createFolder) {
        e.preventDefault()
        m.prompt(`New folder in ${prefix || 'the bucket root'}:`, '', { okLabel: 'Create' }).then((name) => {
          if (name?.trim()) createFolder(`${prefix}${name.trim().replace(/^\/+|\/+$/g, '')}/`)
        })
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [keys]) // eslint-disable-line react-hooks/exhaustive-deps

  const onTabChange = (v) => {
    if (v === 'kinds') { onKinds?.(); return }
    setTab(v)
    setView(v === 'files' ? 'list' : 'columns')
  }
  const tabProps = phoneTabs && phone
    ? { tabs: onKinds ? TABS : TABS.filter((t) => t.value !== 'kinds'), activeTab: tab, onTabChange }
    : {}

  return (
    <MediaLibraryBrowse
      {...pageProps}
      {...tabProps}
      view={current}
      onViewChange={setView}
    />
  )
}
