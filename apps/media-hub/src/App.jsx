import { useEffect, useState } from 'react'
import { AppHub, PageShell } from '@kolkrabbi/kol-shell'
import { MEDIA_SETTINGS_BASE } from '@kolkrabbi/kol-component'
import MediaLibrary from '@kolkrabbi/kol-component/organisms/MediaLibrary'
import logomark from '@kolkrabbi/kol-brand/svg/favicon-01.svg?url'
import { createFixtureClient } from 'media-fixture'
import { useFixtureMedia, useMediaTool, DEFAULTS } from 'media-fixture/wiring'
import { useSettings } from './Settings.jsx'
import { SHORTCUTS } from './lib/shortcuts.js'

/* MEDIA ON THE HUB — Shell + Hub + the media tool, and nothing else (apps review 2026-09-29: the
 * rail had grown Library · Notes · Decks · Brand, four other tools and a Home, in an app named for
 * one). The tool is the same MediaLibrary apps/media shows alone, and it is what LOADS:
 *
 *   Browse   /  (and /browse/<folder>)   the column browser
 *   Settings /settings                   the Hub's — the ONE settings place
 *
 * NO HOME (AppHub `home` is opt-in): the mark goes to the tool. The Library catalog and its
 * walkthrough are quarantined to _tmp/2026-09-29-media-hub-library/; notes, decks and brand run
 * in their own apps and come back here as opt-ins once they are ready to (creating and editing
 * text files is developed in notes first).
 *
 * ONE SETTINGS: the tool's gear hands over to the Hub's page (`onOpenSettings`), and that page has
 * no gear of its own — it was three surfaces for one settings object.
 *
 * ON A PHONE the rail is the Shell's bottom bar (AppHub's default since 2026-09-29) — no hamburger.
 * Routing is the hash. */

const client = createFixtureClient()
const TITLE = 'MEDIA'

const parse = () => decodeURIComponent(location.hash.slice(1)) || '/'
const encode = (path) => `#${encodeURI(path)}`

const ITEMS = [
  { icon: 'folder', path: '/browse', label: 'Browse' },
]

export default function App() {
  const [path, setPath] = useState(parse)
  useEffect(() => {
    const on = () => setPath(parse())
    window.addEventListener('hashchange', on)
    return () => window.removeEventListener('hashchange', on)
  }, [])
  const navigate = (p) => { if (location.hash !== encode(p)) location.hash = encode(p); else setPath(parse()) }
  const setPrefix = (p) => navigate(`/browse${p ? `/${p}` : ''}`)
  const media = useFixtureMedia({ client, title: TITLE, setPrefix })
  const bucket = media.bucketId

  /* the per-bucket display settings — the fixture's defaults (the SAME ones apps/media opens on),
   * then what was saved; loaded on a bucket switch, saved on every change */
  const defaultsFor = (b) => ({ ...MEDIA_SETTINGS_BASE, ...(DEFAULTS[b] ?? {}) })
  const [viewSettings, setViewSettings] = useState(() => defaultsFor(bucket))
  useEffect(() => {
    let live = true
    client.loadSettings(bucket).then((got) => live && setViewSettings({ ...defaultsFor(bucket), ...(got ?? {}) }))
    return () => { live = false }
  }, [bucket]) // eslint-disable-line react-hooks/exhaustive-deps
  const setView = (next) => { setViewSettings(next); client.saveSettings(bucket, next) }
  const resetView = () => { setViewSettings(defaultsFor(bucket)); client.saveSettings(bucket, null) }

  const settings = useSettings({ client, media, view: viewSettings, setView, resetView })
  /* THE SAME TOOL as apps/media (media-fixture's `useMediaTool`): keys, the drawer footer, file
   * formats — and its theme chip is the Settings masthead's toggle */
  const tool = useMediaTool({ client, media })

  /* `/` IS Browse — the rail lights Browse there, and the mark goes there */
  const currentPath = path === '/' ? '/browse' : path
  const prefix = path.startsWith('/browse') ? path.slice('/browse'.length).replace(/^\//, '') : ''

  return (
    <AppHub
      app={{
        name: 'Media',
        subtitle: media.bucket.label,
        logomark,
        about: 'The media product on the KOL design system — a bucket, the database beside it, and the pages every KOL app has around the work.',
        links: [
          { label: 'Design system', url: 'https://ui.kolkrabbi.io' },
          { label: 'Tool alone', url: 'https://ui.kolkrabbi.io/apps/media/', text: 'apps/media' },
        ],
      }}
      items={ITEMS}
      currentPath={currentPath}
      onNavigate={navigate}
      shortcuts={SHORTCUTS}
      themeToggle={tool.themeChip}
      settings={settings}
      /* the tool's MEDIA voice on every page — Settings wore the mono title beside it (review #4) */
      masthead="display"
      /* NO WASH ON THE TOOL, only there (user, 2026-09-26: "I was just talking about browser"): the
       * browser was designed and ruled on bare surface-primary (apps/media), its controls toned for
       * that ground — a washed plane wants sunken controls (ControlToneSunken). The Hub's pages keep
       * the fg-02 wash every Hub app has. The shell follows the tool, and only where the tool is. */
      shell={{ pageWash: currentPath.startsWith('/browse') ? null : 'var(--kol-fg-02)' }}
    >
      {/* the tool sits in the Hub's page padding like every other page (user: "why different padding?") */}
      <PageShell mode="fixed">
        <MediaLibrary
          variant="explorer"
          {...media.props}
          {...tool.props}
          settings={viewSettings}
          onSettingsChange={setView}
          prefix={prefix}
          onPrefix={setPrefix}
          autoFocus
          onOpenSettings={() => navigate('/settings')}
          className="gap-10 media-browse"
        />
        {tool.overlay}
      </PageShell>
    </AppHub>
  )
}
