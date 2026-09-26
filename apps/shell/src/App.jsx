import { useEffect, useState } from 'react'
import { AppHub, PageShell } from '@kolkrabbi/kol-shell'
import { Button, Dropdown, PageHeader, SettingsChoice, SettingsSwitch } from '@kolkrabbi/kol-component'
import { ThemeToggle } from '@kolkrabbi/kol-framework'
import { Icon } from '@kolkrabbi/kol-icons'
import logomark from '@kolkrabbi/kol-brand/svg/favicon-01.svg?url'

/* THE HUB'S REFERENCE APP (the app anatomy, 2026-09-26). Shell + Hub + a placeholder tool,
 * judged on its own: everything on screen except the tool page is kol-shell's `AppHub`. An
 * app on the Hub is this file — an app description, its sets, its keymap, and its tool.
 *
 * Routing is the hash, so a reload lands where you were:  #/  home · #/tool · #/settings */

const parse = () => decodeURIComponent(location.hash.slice(1)) || '/'

const APP = {
  name: 'Shell',
  subtitle: 'The Hub around a placeholder tool',
  logomark,
  about: 'The reference for the Hub — the pages every KOL app has around its work: Home, Settings, the shortcuts sheet and the walkthrough. The tool is a placeholder.',
  links: [
    { label: 'Design system', url: 'https://ui.kolkrabbi.io' },
    { label: 'Anatomy', url: 'https://ui.kolkrabbi.io/apps/shell/', text: 'apps/shell' },
  ],
}

const ITEMS = [{ icon: 'layers', path: '/tool', label: 'Tool' }]

/* placeholder sets — RECENT is the one empty start, SAVED a handful of things made */
const RECENT = [{ name: 'empty', title: 'Empty tool', detail: 'Start from nothing' }]
const SAVED = ['Alpha', 'Bravo', 'Charlie', 'Delta', 'Echo'].map((t, i) => ({
  name: t.toLowerCase(), title: t, detail: `Saved ${i + 1} d ago`, kind: i % 2 ? 'draft' : 'final',
  date: `2026-09-${String(25 - i).padStart(2, '0')}`, size: `${(i + 1) * 120} KB`,
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
    { title: 'Get started', actions: (close) => <Button variant="grey" size="md" onClick={() => { close(); navigate('/tool') }}>Open the tool</Button> },
  ]

  return (
    <AppHub
      app={APP}
      items={ITEMS}
      currentPath={path}
      onNavigate={navigate}
      shortcuts={SHORTCUTS}
      walkthrough={walkthrough}
      themeToggle={<ThemeToggle fill="none" label={false} size="sm" />}
      home={{
        items: (view) => (view === 'recent' ? RECENT : SAVED),
        filtersTitle: 'All Items',
        filterGroups: [{ label: 'Kind', key: 'kind', values: ['draft', 'final'] }],
        toCard: (item, { layout }) => ({ key: item.name, title: item.title, detail: item.detail, date: item.date, size: item.size, media: <Art name="layers" size={layout === 'list' ? 20 : 48} />, onClick: () => navigate('/tool') }),
        actions: <Button variant="grey" size="md" onClick={() => navigate('/tool')}>New</Button>,
      }}
      settings={{
        sections,
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
