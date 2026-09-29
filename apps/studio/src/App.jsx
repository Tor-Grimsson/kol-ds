import { useEffect, useState } from 'react'
import { AppStudio } from '@kolkrabbi/kol-shell'
import { Button, SettingsChoice, SettingsSwitch } from '@kolkrabbi/kol-component'
import { ThemeToggle } from '@kolkrabbi/kol-framework'
import { Icon } from '@kolkrabbi/kol-icons'
import logomark from '@kolkrabbi/kol-brand/svg/favicon-01.svg?url'

/* THE STUDIO'S REFERENCE APP (apps review §6c-4, 2026-09-29). kol-shell's `AppStudio` — the
 * workstation fxr · mirror · monitor each hand-build — around placeholder pages. Everything on
 * screen except the page bodies is the Studio: the order, the keys, the mono masthead, the bar.
 * monitor.kolkrabbi.io is the reference, so the placeholders are a patch workstation:
 *
 *   #/          Home      RECENT · SAVED, New patch, Walkthrough
 *   #/library   Library   the patches and the modules
 *   #/create    Create    a Catalog-headed composer
 *   #/use       Use       the tool, full-bleed
 *   #/stage     Stage     an opt-in page
 *   #/settings  Settings
 *
 * Routing is the hash, so a reload lands where you were. */

const parse = () => decodeURIComponent(location.hash.slice(1)) || '/'

const APP = {
  name: 'Studio',
  subtitle: 'The workstation shape, around placeholder pages',
  logomark,
  about: 'The reference for the Studio — the Hub plus the pages a workstation has: a Library of what it makes, a page that composes a new one, the tool itself, and whatever else the app needs. The pages are placeholders.',
  links: [
    { label: 'Design system', url: 'https://ui.kolkrabbi.io' },
    { label: 'Reference', url: 'https://monitor.kolkrabbi.io', text: 'monitor.kolkrabbi.io' },
  ],
}

const KINDS = ['generator', 'effect', 'utility']
const PATCHES = ['Drift', 'Scanline', 'Feedback', 'Bloom', 'Tunnel', 'Grain', 'Echo', 'Lattice'].map((t, i) => ({
  name: t.toLowerCase(), title: t, detail: `${3 + (i % 5)} modules, ${2 + i} connections`, kind: KINDS[i % 3],
  date: `2026-09-${String(28 - i).padStart(2, '0')}`,
}))
const MODULES = ['Clock', 'LFO', 'Envelope', 'Mixer', 'Scope', 'Output'].map((t, i) => ({
  name: t.toLowerCase(), title: t, detail: `${4 + i * 2}HP — ${i % 2 ? '3U' : '1U'}`, kind: KINDS[(i + 1) % 3],
}))
const RECENT = [{ name: 'empty', title: 'Empty patch', detail: 'Start from nothing', kind: 'utility' }]

const SHORTCUTS = [
  { section: 'Navigate', items: [
    { id: 'home', label: 'Home, then the rail', combo: '⌥ 1–9' },
    { id: 'settings', label: 'Settings', combo: ',' },
    { id: 'rail', label: 'Hide the rail', combo: '\\' },
  ] },
  { section: 'Help', items: [{ id: 'sheet', label: 'This sheet', combo: 'S' }] },
]

const DEFAULTS = { fps: '60', autoplay: true }

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
  const [libView, setLibView] = useState('patches')

  const card = (item, { layout }) => ({
    key: item.name, title: item.title, detail: item.detail, date: item.date,
    media: <Art name="layers" size={layout === 'list' ? 20 : 48} />, onClick: () => navigate('/use'),
  })

  const walkthrough = [
    { title: '1. Library', text: ['What the tool makes and what it is made from — patches and modules — in one Catalog.'], illustration: <Art name="nav-library" /> },
    { title: '2. Create', text: ['Compose a new one: the header names it, the page under it is the editor.'], illustration: <Art name="nav-create" /> },
    { title: '3. Use', text: ['The tool itself, full-bleed. ⌥1 is Home, then the rail in order; S shows every key.'], illustration: <Art name="nav-rack" /> },
    { title: 'Get started', actions: (close) => <Button variant="grey" size="md" onClick={() => { close(); navigate('/create') }}>New patch</Button> },
  ]

  return (
    <AppStudio
      app={APP}
      currentPath={path}
      onNavigate={navigate}
      shortcuts={SHORTCUTS}
      walkthrough={walkthrough}
      themeToggle={<ThemeToggle fill="none" label={false} size="sm" />}
      home={{
        items: (view) => (view === 'recent' ? RECENT : PATCHES),
        filtersTitle: 'All Patches',
        filterGroups: [{ label: 'Kind', key: 'kind', values: KINDS }],
        toCard: card,
        actions: <Button variant="grey" size="md" onClick={() => navigate('/create')}>New patch</Button>,
      }}
      library={{
        header: { title: 'Library', subtitle: 'Patches and the modules they are made from' },
        items: libView === 'patches' ? PATCHES : MODULES,
        views: [{ value: 'patches', label: 'PATCHES' }, { value: 'modules', label: 'MODULES' }],
        view: libView,
        onViewChange: setLibView,
        filtersTitle: libView === 'patches' ? 'All Patches' : 'All Modules',
        filterGroups: [{ label: 'Kind', key: 'kind', values: KINDS }],
        toCard: card,
      }}
      create={{
        header: { title: 'Create', subtitle: 'Compose a new patch — the editor sits under this header' },
        children: <Placeholder name="nav-create" text="The composer — each app brings its own" />,
      }}
      use={{
        children: (
          <div className="h-dvh flex items-center justify-center">
            <Placeholder name="nav-rack" text="The tool, full-bleed — each app brings its own" />
          </div>
        ),
      }}
      pages={[{ path: '/stage', icon: 'video', label: 'Stage', children: <div className="p-12"><Placeholder name="video" text="An opt-in page — monitor's Stage" /></div> }]}
      settings={{
        sections: [
          { label: 'Output', rows: [
            { label: 'Frame rate', render: () => <SettingsChoice options={['30', '60'].map((v) => ({ value: v, label: `${v} fps` }))} value={prefs.fps} onChange={set('fps')} ariaLabel="Frame rate" /> },
            { label: 'Autoplay', render: () => <SettingsSwitch on={prefs.autoplay} onChange={set('autoplay')} /> },
          ] },
        ],
        tone: 'secondary',
        themeIn: 'drawer',
        drawer: { onReset: () => setPrefs(DEFAULTS) },
      }}
    />
  )
}

function Placeholder({ name, text }) {
  return (
    <div className="flex flex-col items-center gap-4 text-oq-24">
      <Icon name={name} size={64} />
      <span className="kol-helper-12 text-meta">{text}</span>
    </div>
  )
}

function Art({ name, size = 160 }) {
  return <div className="w-full h-full flex items-center justify-center text-oq-24"><Icon name={name} size={size} /></div>
}
