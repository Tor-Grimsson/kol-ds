import { useEffect, useState } from 'react'
import { AppHub, PageShell } from '@kolkrabbi/kol-shell'
import { Button, MEDIA_SETTINGS_BASE } from '@kolkrabbi/kol-component'
import { Icon } from '@kolkrabbi/kol-icons'
import MediaLibrary from '@kolkrabbi/kol-component/organisms/MediaLibrary'
import logomark from '@kolkrabbi/kol-brand/svg/favicon-01.svg?url'
import { createFixtureClient } from 'media-fixture'
import { useFixtureMedia, useMediaTool, useNotesTool, useDecksTool, DEFAULTS } from 'media-fixture/wiring'
import { useLibrary } from './Library.jsx'
import { Notes } from '@kolkrabbi/kol-notes'
import { Decks } from '@kolkrabbi/kol-deck'
import { useSettings } from './Settings.jsx'
import { SHORTCUTS } from './lib/shortcuts.js'

/* MEDIA ON THE HUB (the app anatomy, 2026-09-26). Shell + Hub are kol-shell's `AppHub`; the tool is
 * the same MediaLibrary apps/media shows alone, and it is what LOADS (user: "the point of this is not
 * to bury media, the column browser is what we want loaded"). The rail:
 *
 *   Browse   /  (and /browse/<folder>)   the column browser
 *   Library  /library                    the Hub's Home — RECENT · FAVOURITES · DRAFTS
 *   Notes    /notes  (and /notes/<slug>)  kol-notes — the same tool as apps/notes (2026-09-27)
 *   Decks    /decks  (and /decks/<slug>)  kol-deck — the same tool as apps/presentation (2026-09-27)
 *   Settings /settings                   the Hub's, with media's rows; the drawer carries the theme
 *
 * THREE TOOLS, ONE SHELL. Notes and Decks are the packages' components over media-fixture's shared
 * wiring (`useNotesTool`, `useDecksTool`), exactly as the tool-alone apps render them — nothing is
 * copied here, so work on either tool lands in this app on its next reload.
 *
 * ONE SETTINGS OBJECT per bucket, held here and saved through the client (the fake D1; olina's D1
 * live): the browse page's gear, the settings page and its drawer all edit it. Routing is the hash. */

const client = createFixtureClient()
const TITLE = 'MEDIA'

const parse = () => decodeURIComponent(location.hash.slice(1)) || '/'
const encode = (path) => `#${encodeURI(path)}`

const ITEMS = [
  { icon: 'folder', path: '/browse', label: 'Browse' },
  { icon: 'layers', path: '/library', label: 'Library' },
  { icon: 'edit', path: '/notes', label: 'Notes' },
  { icon: 'rectangle', path: '/decks', label: 'Decks' },
]

/* the walkthrough — opt-in from the Library's button, its X inside the card (the Hub's) */
const art = (name) => <div className="w-full h-full flex items-center justify-center text-oq-24"><Icon name={name} size={160} /></div>
const WALKTHROUGH = [
  { title: 'Browse', text: ['Columns, rows or a grid of the same files. Space opens Quick Look, Enter opens a folder, right-click holds every verb.', 'Drag files in from the desktop to upload them.'], illustration: art('folder') },
  { title: 'Library', text: ['What you opened last, what you starred, and the edits you have not saved yet — one page, before you go looking.'], illustration: art('layers') },
  { title: 'Tags and favourites', text: ['Tag and star files and folders in the preview pane or from the menu. Filter by them in Browse.'], illustration: art('hash-01') },
  { title: 'Notes', text: ['Your notes, and New note. A note opens in the page: its fields, the markdown, and the preview rendering as you type. Attach puts a bucket file in it.', 'Unsaved edits stay in this browser until you save — nothing half-written leaves the device.'], illustration: art('edit') },
  { title: 'Decks', text: ['Presentations. Open one to edit its slides, press Present to play it, and export PDF, PNG or PPTX from File.'], illustration: art('rectangle') },
  { title: 'Get started', actions: (close) => <Button variant="grey" size="md" onClick={close}>Get started</Button> },
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

  const { home, fileCount } = useLibrary({ client, media, navigate })
  const settings = useSettings({ client, media, view: viewSettings, setView, resetView })
  /* THE SAME TOOL as apps/media (media-fixture's `useMediaTool`): keys, phone tabs, the drawer
   * footer, file formats — and its theme chip is the Hub drawer's toggle too, so every drawer matches */
  const tool = useMediaTool({ client, media })
  const notes = useNotesTool({ client, refreshKey: media.refreshKey })
  const decks = useDecksTool({ client })

  /* `/` IS Browse — the rail lights Browse there, and the mark goes there */
  const currentPath = path === '/' ? '/browse' : path
  /* an open note / deck is the section's tail: /notes/<slug>, /decks/<slug> — the rail lights the section */
  const section = currentPath.match(/^\/(notes|decks)(?:\/(.+))?$/)
  const railPath = section ? `/${section[1]}` : currentPath
  const openIn = (name) => (section?.[1] === name ? section[2] ?? null : null)
  const openChange = (name) => (slug) => navigate(slug ? `/${name}/${slug}` : `/${name}`)
  const prefix = path.startsWith('/browse') ? path.slice('/browse'.length).replace(/^\//, '') : ''

  return (
    <AppHub
      app={{
        name: 'Media',
        subtitle: `${media.bucket.label} · ${fileCount} files`,
        logomark,
        about: 'The media product on the KOL design system — a bucket, the database beside it, and the pages every KOL app has around the work.',
        links: [
          { label: 'Design system', url: 'https://ui.kolkrabbi.io' },
          { label: 'Tool alone', url: 'https://ui.kolkrabbi.io/apps/media/', text: 'apps/media' },
        ],
      }}
      items={ITEMS}
      homePath="/library"
      currentPath={railPath}
      onNavigate={navigate}
      shortcuts={SHORTCUTS}
      walkthrough={WALKTHROUGH}
      themeToggle={tool.themeChip}
      home={home}
      settings={settings}
      /* NO WASH ON THE TOOL, only there (user, 2026-09-26: "I was just talking about browser"): the
       * browser was designed and ruled on bare surface-primary (apps/media), its controls toned for
       * that ground — a washed plane wants sunken controls (ControlToneSunken). The Hub's pages keep
       * the fg-02 wash every Hub app has. The shell follows the tool, and only where the tool is. */
      shell={{ pageWash: currentPath.startsWith('/browse') ? null : 'var(--kol-fg-02)' }}
    >
      {section?.[1] === 'notes' ? <Notes {...notes.props} open={openIn('notes')} onOpenChange={openChange('notes')} />
        : section?.[1] === 'decks' ? <Decks {...decks.props} open={openIn('decks')} onOpenChange={openChange('decks')} railLeft="var(--kol-shell-rail-width, 48px)" />
        : (
        /* the tool sits in the Hub's page padding like every other page (user: "why different padding?") */
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
            className="gap-10 media-browse"
          />
          {tool.overlay}
        </PageShell>
      )}
    </AppHub>
  )
}
