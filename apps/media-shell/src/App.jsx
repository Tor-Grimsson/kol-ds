import { useEffect, useState } from 'react'
import { AppShell, PageShell, ShortcutsOverlay, WalkthroughPanel } from '@kolkrabbi/kol-shell'
import { Button, FullscreenOverlay } from '@kolkrabbi/kol-component'
import { Icon } from '@kolkrabbi/kol-icons'
import MediaLibrary from '@kolkrabbi/kol-component/organisms/MediaLibrary'
import { createFixtureClient } from 'media-fixture'
import { useFixtureMedia } from 'media-fixture/wiring'
import Home from './Home.jsx'
import Settings from './Settings.jsx'
import { SHORTCUTS } from './lib/shortcuts.js'

/* MEDIA + KOL-SHELL (plan v2, 2026-09-26). The same media product as apps/media, over the same
 * fixture (the imagined olina setup), inside the app shell the estate's tools share: a rail with
 * Home · Browse · Settings. apps/media stays the tool alone; this app adds only the composition —
 * no media feature lives here that apps/media does not also have.
 *
 * Settings are the fake D1's here (no settings pair passed), which is how a real olina deploy
 * would keep them. Routing is the hash, so a reload lands where you were:
 *   #/  home · #/browse/<folder>  browse · #/smart/<id>  a smart folder · #/settings */

const client = createFixtureClient()
const TITLE = 'MEDIA'

const parse = () => {
  const h = decodeURIComponent(location.hash.slice(1)) || '/'
  if (h.startsWith('/browse')) return { page: 'browse', prefix: h.slice('/browse'.length).replace(/^\//, '') }
  if (h.startsWith('/smart/')) return { page: 'browse', prefix: '', smart: h.slice('/smart/'.length) }
  if (h.startsWith('/settings')) return { page: 'settings' }
  return { page: 'home' }
}
const encode = (path) => `#${encodeURI(path)}`

/* THE FIRST-RUN TOUR (plan v2, P9) — kol-shell's WalkthroughPanel, the card monitor and mirror open
 * on their home pages. Once per browser; Settings → About shows it again. */
const TOUR_KEY = 'kol-media-shell:tour-done'
const art = (name) => <div className="w-full h-full flex items-center justify-center text-oq-24"><Icon name={name} size={160} /></div>
const tourSteps = (close) => [
  { title: 'Home', text: ['What you opened last, what you starred, your smart folders and the edits you have not saved yet — one page, before you go looking.'], illustration: art('home-01') },
  { title: 'Browse', text: ['Columns, rows or a grid of the same files. Space opens Quick Look, Enter opens a folder, right-click holds every verb.', 'Drag files in from the desktop to upload them.'], illustration: art('folder') },
  { title: 'Tags and favourites', text: ['Tag and star files and folders in the preview pane or from the menu. Filter by them, and save a filter as a smart folder.'], illustration: art('hash-01') },
  { title: 'Documents', text: ['New document writes a file: a name, a type, and for markdown a form for its fields. The preview renders as you type.', 'Unsaved edits stay in this browser until you save — nothing half-written leaves the device.'], illustration: art('edit') },
  { actions: <Button size="md" onClick={close}>Get started</Button> },
]

const ITEMS = [
  { icon: 'home-01', path: '/', label: 'Home' },
  { icon: 'folder', path: '/browse', label: 'Browse' },
]
const BOTTOM = [{ icon: 'settings-01', path: '/settings', label: 'Settings' }]

export default function App() {
  const [route, setRoute] = useState(parse)
  useEffect(() => {
    const on = () => setRoute(parse())
    window.addEventListener('hashchange', on)
    return () => window.removeEventListener('hashchange', on)
  }, [])
  const navigate = (path) => { if (location.hash !== encode(path)) location.hash = encode(path); else setRoute(parse()) }
  const setPrefix = (p) => navigate(`/browse${p ? `/${p}` : ''}`)
  const media = useFixtureMedia({ client, title: TITLE, setPrefix })
  const [view, setView] = useState(undefined)
  const [shortcutsOpen, setShortcutsOpen] = useState(false)
  const [tour, setTour] = useState(() => { try { return !localStorage.getItem(TOUR_KEY) } catch { return false } })
  const endTour = () => { setTour(false); try { localStorage.setItem(TOUR_KEY, '1') } catch { /* private mode */ } }

  /* `?` opens the shortcuts sheet — never while typing */
  useEffect(() => {
    const onKey = (e) => {
      const el = e.target
      if (el?.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el?.tagName ?? '')) return
      if (e.key === '?') { e.preventDefault(); setShortcutsOpen((v) => !v) }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const currentPath = route.page === 'browse' ? '/browse' : route.page === 'settings' ? '/settings' : '/'

  return (
    <AppShell items={ITEMS} bottomItems={BOTTOM} currentPath={currentPath} onNavigate={navigate}
      appName="Media" navKeys railToggleKey="\" settingsPath="/settings" settingsKey=",">
      {route.page === 'home' && <Home client={client} media={media} navigate={navigate} />}
      {route.page === 'browse' && (
        <PageShell mode="fixed">
          <div className="h-full py-6 px-6 flex flex-col">
            <MediaLibrary
              variant="explorer"
              {...media.props}
              key={route.smart ?? 'browse'}
              view={view}
              onViewChange={setView}
              prefix={route.prefix}
              onPrefix={setPrefix}
              smartFolder={route.smart}
              autoFocus
              className="gap-10 media-browse"
            />
          </div>
        </PageShell>
      )}
      {route.page === 'settings' && <Settings client={client} media={media} shortcuts={SHORTCUTS} onShowTour={() => setTour(true)} />}
      {tour && (
        <FullscreenOverlay open onClose={endTour} scrim>
          {/* the panel centres itself ABSOLUTELY, so it needs a box to centre in — the overlay's sheet
              hugs its content and would give it none */}
          <div style={{ position: 'relative', width: 'min(1040px, calc(100vw - 48px))', height: 560 }}>
            <WalkthroughPanel steps={tourSteps(endTour)} />
          </div>
        </FullscreenOverlay>
      )}
      {shortcutsOpen && <ShortcutsOverlay shortcuts={SHORTCUTS} onClose={() => setShortcutsOpen(false)} />}
    </AppShell>
  )
}
