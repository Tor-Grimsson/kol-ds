import { useEffect, useState } from 'react'
import { AppHub, PageShell } from '@kolkrabbi/kol-shell'
import { Button, Dropdown, PageHeader, SettingsChoice, SettingsSwitch, downloadBlob } from '@kolkrabbi/kol-component'
import { Icon } from '@kolkrabbi/kol-icons'
import logomark from '@kolkrabbi/kol-icons/identity/kolkrabbi/kolkrabbi-logomark.svg?url'

/* THE HUB'S REFERENCE APP (the app anatomy, 2026-09-26). Shell + Hub + a placeholder tool,
 * judged on its own: everything on screen except the tool page is kol-shell's `AppHub`. An
 * app on the Hub is this file — an app description, its sets, its keymap, and its tool.
 *
 * HOME IS DATA (HubHomeContract, 2026-10-23): this app hands `HubHome` its files and the handlers,
 * and the Hub draws every card — the same card fxr, mirror and monitor get. The review surface for
 * the Studio shape is `apps/studio-hub`; this app is the Hub alone, as it was.
 *
 * Routing is the hash, so a reload lands where you were:  #/  home · #/tool · #/settings */

const parse = () => decodeURIComponent(location.hash.slice(1)) || '/'

const APP = {
  name: 'Hub',
  subtitle: 'The Hub around a placeholder tool',
  logomark,
  about: 'The reference for the Hub — the pages every KOL app has around its work: Home, Settings, the shortcuts sheet and the walkthrough. The tool is a placeholder.',
  links: [
    { label: 'Design system', url: 'https://ui.kolkrabbi.io' },
    { label: 'Anatomy', url: 'https://ui.kolkrabbi.io/apps/hub/', text: 'apps/hub' },
  ],
}

const ITEMS = [{ icon: 'layers', path: '/tool', label: 'Tool' }]

/* placeholder FILES — Home's contract: `{ id, name, updatedAt, bytes?, cover?, tags?, details? }` plus the keys
 * its filter group reads (`kind`). Fourteen, so RECENT shows its cap of twelve and SAVED every one; one long
 * name and a few without a cover, so the truncation and the placeholder are on the page. The card shows
 * title, date and size and nothing else (his ruling 2026-10-23); the tags and the details are the rail's,
 * opened from the cog. The covers are glyphs, as the walkthrough's art is. */
const DAY = 86400000
const ART = ['layers', 'globe', 'desktop', 'video', 'image', 'cloud']
const TAGS = ['poster', 'social', 'print', 'loop', 'draft']
const SEED = ['Alpha', 'Bravo', 'Charlie', 'Delta', 'Echo', 'Foxtrot', 'Golf', 'Hotel', 'India', 'Juliett', 'Kilo', 'Lima', 'Mike', 'November'].map((t, i) => ({
  id: t.toLowerCase(),
  name: i === 2 ? 'Charlie, a name long enough to truncate' : t,
  updatedAt: Date.parse('2026-10-23T12:00:00Z') - i * DAY,
  bytes: 1200 + i * 7300,
  kind: i % 2 ? 'draft' : 'final',
  tags: [TAGS[i % TAGS.length], TAGS[(i + 2) % TAGS.length]],
  details: [{ label: 'Layers', value: 3 + (i % 5) }, { label: 'Aspect', value: i % 2 ? '4:5' : '1:1' }],
  cover: i % 5 === 3 ? undefined : <Art name={ART[i % ART.length]} size={48} />,
}))

/* placeholder settings — the app's own rows, AS DATA: the page and the gear's drawer render
 * this one array (HubSettings), so the two cannot drift */
const DEFAULTS = { aspect: '4:5', autoplay: false, grid: true }
const PICKS = [
  { value: '', label: 'Open a tool' },
  { value: 'tool', label: 'Tool' },
]

const SHORTCUTS = [
  {
    section: 'Navigate',
    items: [
      { id: 'home', label: 'Home, then the rail', combo: '⌥ 1–9' },
      { id: 'settings', label: 'Settings', combo: ',' },
      { id: 'rail', label: 'Hide the rail', combo: '\\' },
    ],
  },
  {
    section: 'Help',
    items: [{ id: 'sheet', label: 'This sheet', combo: 'S' }],
  },
]

export default function App() {
  const [path, setPath] = useState(parse)
  useEffect(() => {
    const on = () => setPath(parse())
    window.addEventListener('hashchange', on)
    return () => window.removeEventListener('hashchange', on)
  }, [])
  const navigate = (p) => { location.hash = encodeURI(p) }
  const [prefs, setPrefs] = useState(DEFAULTS)
  const set = (k) => (v) => setPrefs((p) => ({ ...p, [k]: v }))
  /* the files live here; the verbs write them and the Hub re-draws */
  const [files, setFiles] = useState(SEED)
  const sections = [
    { label: 'Defaults', rows: [
      { label: 'Default aspect', render: () => <SettingsChoice options={['1:1', '4:5', '16:9'].map((v) => ({ value: v, label: v }))} value={prefs.aspect} onChange={set('aspect')} ariaLabel="Default aspect" /> },
      { label: 'Show grid', render: () => <SettingsSwitch on={prefs.grid} onChange={set('grid')} /> },
    ] },
    { label: 'Transport', rows: [
      { label: 'Autoplay', render: () => <SettingsSwitch on={prefs.autoplay} onChange={set('autoplay')} /> },
    ] },
  ]

  const walkthrough = [
    { title: '1. Home', text: ['What you opened last and what you saved — RECENT and SAVED — one page, before you go looking.'], illustration: <Art name="home-01" /> },
    { title: '2. Tool', text: ['The work itself. Every app on the Hub brings its own; this one is a placeholder.'], illustration: <Art name="layers" /> },
    { title: '3. Keys', text: ['⌥1 is Home, then the rail in order. Comma opens Settings and closes it again. S shows every shortcut.'], illustration: <Art name="nav-settings" /> },
    { title: 'Get started', actions: (close) => <Button tone="grey" size="md" onClick={() => { close(); navigate('/tool') }}>Open the tool</Button> },
  ]

  return (
    <AppHub
      app={APP}
      items={ITEMS}
      currentPath={path}
      onNavigate={navigate}
      shortcuts={SHORTCUTS}
      walkthrough={walkthrough}
      home={{
        files,
        onOpen: () => navigate('/tool'),
        onTags: (f, tags) => setFiles((fs) => fs.map((x) => (x.id === f.id ? { ...x, tags } : x))),
        /* the file as JSON — the cover is a node, not data */
        onDownload: ({ cover: _cover, ...f }) => downloadBlob(new Blob([JSON.stringify(f, null, 2)], { type: 'application/json' }), `${f.name}.json`),
        onRename: (f, name) => setFiles((fs) => fs.map((x) => (x.id === f.id ? { ...x, name, updatedAt: Date.now() } : x))),
        onDuplicate: (f) => setFiles((fs) => [{ ...f, id: `${f.id}-${Date.now().toString(36)}`, name: `${f.name} copy`, updatedAt: Date.now() }, ...fs]),
        onRemove: (f) => setFiles((fs) => fs.filter((x) => x.id !== f.id)),
        filterGroups: [{ label: 'Kind', key: 'kind', values: ['draft', 'final'], exclusive: true }],
        action: { label: 'New', onClick: () => navigate('/tool') },
      }}
      /* the Hub's Dev row, on every rail on a dev server even with nothing in it (user 2026-10-24: "its not optional") */
      dev={{ tabs: [] }}
      settings={{
        sections,
        /* the page tier with its filters — the page as it was (settings tiers, 2026-10-23) */
        page: true,
        filters: true,
        tone: 'secondary',
        themeIn: 'drawer',
        drawer: { onReset: () => setPrefs(DEFAULTS) },
        picker: <Dropdown className="w-40" options={PICKS} value="" onChange={(v) => v && navigate(`/${v}`)} aria-label="Open a tool" />,
      }}
    >
      <PageShell>
        <PageHeader title="Tool" subtitle="The work area — each app brings its own" size="sm" voice="mono" />
      </PageShell>
    </AppHub>
  )
}

function Art({ name, size = 160 }) {
  return <div className="w-full h-full flex items-center justify-center text-oq-24"><Icon name={name} size={size} /></div>
}
