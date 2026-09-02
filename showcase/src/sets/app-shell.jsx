import { useState } from 'react'
import { Button } from '@kolkrabbi/kol-component'
import {
  AppShell,
  CatalogPage,
  SettingsScaffold,
  SettingsShortcuts,
  SettingsLinks,
  SettingsColophon,
  ShortcutsOverlay,
} from '@kolkrabbi/kol-shell'

export const meta = {
  title: 'App shell',
  description: 'The application tier as kol-monitor, kol-mirror and kol-fxr actually compose it — the 48px rail, its drawer fold, a catalog home and a settings page, over one router-agnostic path in local state',
  category: 'app',
  featured: true,
  type: 'reference',
  status: 'active',
  updated: '2026-09-01',
  tags: ['domain/design-system', 'pattern/blocks'],
}
export const stage = 'full'

/* THE SET THAT DID NOT EXIST — and the gap is why every app-tier defect this
 * repo shipped was found by a consumer on a phone instead of here:
 * `CatalogPage`'s inline `repeat(6, 1fr)` (six 29px columns at 390), the flat
 * 48px page pad (23% of the viewport in gutters), and a drawer trigger that
 * travelled to mid-screen. All three were visible at 390 and nothing in the
 * showcase rendered the tier at 390.
 *
 * WHY IT NEEDED TO BE A SET AND NOT A DEMO. `AppShell` owns the viewport — a
 * fixed rail, a fixed trigger, a scrim at modal z — so mounting it inside the
 * docs chrome puts two fixed rails in one corner. `stage = 'full'` sends it to
 * `/sets/preview/app-shell`, and BlockViewer iframes THAT at 390 / 768 / 1280,
 * where an iframe's width is a real viewport: `clamp(20px, 5vw, 48px)`,
 * `min-[901px]:` and the ContentCollection ceiling all resolve honestly.
 *
 * ROUTER-AGNOSTIC IS THE CONTRACT, so this set does what the package asks of a
 * consumer and nothing more: `currentPath` + `onNavigate` over one `useState`.
 * No router, no route table — the shell never learns what a route is.
 */

/* the mark is a data URI so the set carries no public asset; Logomark fetches
 * and inlines it, which also exercises the sanitize-at-cache-time path */
const MARK = 'data:image/svg+xml,' + encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><rect x="1" y="1" width="18" height="18" rx="3" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M6 13V7l4 4 4-4v6" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>'
)

const ITEMS = [
  { icon: 'nav-home', path: '/', label: 'Presets' },
  { icon: 'nav-library', path: '/library', label: 'Library' },
]
const BOTTOM = [{ icon: 'nav-settings', path: '/settings', label: 'Settings' }]

const thumb = (h, label) => 'data:image/svg+xml,' + encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="420"><rect width="600" height="420" fill="hsl(${h} 18% 22%)"/><rect x="24" y="24" width="552" height="372" fill="none" stroke="hsl(${h} 30% 45%)" stroke-width="2"/><text x="300" y="222" font-family="monospace" font-size="34" fill="hsl(${h} 30% 62%)" text-anchor="middle">${label}</text></svg>`
)

const PRESETS = [
  { name: 'empty-7u', title: 'Empty 7U', detail: '7U — power, perf, patch', img: thumb(210, '7U') },
  { name: 'feedback', title: 'Feedback Loop', detail: '11U — 3 modules, 6 cables', img: thumb(20, '11U') },
  { name: 'ramp', title: 'Ramp Bank', detail: '7U — 4 modules, 9 cables', img: thumb(150, '7U') },
  { name: 'keyer', title: 'Luma Keyer', detail: '4U — 2 modules, 3 cables', img: thumb(280, '4U') },
]
const SAVED = [
  { name: 's1', title: 'Session 04', detail: '11U · edited 31 Aug 2026', img: thumb(330, '11U') },
  { name: 's2', title: 'Session 03', detail: '7U · edited 27 Aug 2026', img: thumb(190, '7U') },
]
const VIEWS = [{ value: 'recent', label: 'RECENT' }, { value: 'saved', label: 'SAVED' }]

/* ONE array, both surfaces. The scaffold's own docstring names this as the pair
 * that drifted in two repos at once — each maintained the settings list and the
 * overlay list separately. `SettingsShortcuts` and `ShortcutsOverlay` read the
 * same sectioned shape, so there is nothing to keep in step. */
const SHORTCUTS = [
  { section: 'Transport', items: [{ id: 'play', label: 'Play / pause', combo: 'Space' }, { id: 'loop', label: 'Loop', combo: 'L' }] },
  { section: 'View', items: [{ id: 'rail', label: 'Toggle rail', combo: '\\' }, { id: 'fit', label: 'Zoom to fit', combo: '⇧ 1' }] },
  { section: 'Rack', items: [{ id: 'add', label: 'Add module', combo: '⌥ then 1–5' }, { id: 'clear', label: 'Clear patch', combo: '⌘ ⌫' }] },
  { section: 'File', items: [{ id: 'save', label: 'Save preset', combo: '⌘ S' }, { id: 'open', label: 'Open settings', combo: ',' }] },
]

const SETTINGS_TABS = [
  { value: 'shortcuts', label: 'SHORTCUTS', title: 'Settings', subtitle: 'Keys, links and build' },
  { value: 'about', label: 'ABOUT', title: 'Settings', subtitle: 'Keys, links and build' },
]

export default function AppShellSet() {
  const [path, setPath] = useState('/')
  const [view, setView] = useState('recent')
  const [shortcuts, setShortcuts] = useState(false)

  const catalog = (title, subtitle, items) => (
    <CatalogPage
      header={{ size: 'sm', voice: 'mono', title, subtitle }}
      items={items}
      filtersTitle="All presets"
      views={VIEWS}
      view={view}
      onViewChange={setView}
      toCard={(p) => ({ key: p.name, title: p.title, detail: p.detail, media: <img src={p.img} alt="" />, onClick: () => {} })}
      actions={<>
        <Button variant="grey" size="md">New rack</Button>
        <Button variant="grey" size="md" onClick={() => setShortcuts(true)}>Shortcuts</Button>
      </>}
    />
  )

  return (
    <>
      <AppShell
        items={ITEMS}
        bottomItems={BOTTOM}
        logomark={{ svgUrl: MARK, title: 'Monitor' }}
        currentPath={path}
        onNavigate={setPath}
        /* the seams a composed page is the only place to see: `touch` PER ROUTE
         * — home is navigation, so it keeps the collapsed rail visible with the
         * tap opener (`shell`), every content route folds it to the drawer
         * (ShellRailCollapsedWithTapOpen: the consumer switches the mode, the
         * shell needs nothing else); `\` toggles, ⌥1–9 walks the rows (mark
         * first), and the settings row TOGGLES rather than strands. */
        touch={path === '/' ? 'shell' : 'drawer'}
        railToggleKey="\\"
        navKeys
        settingsPath="/settings"
        settingsKey=","
        appName="Monitor"
      >
        {path === '/settings' ? (
          <SettingsScaffold
            tabs={SETTINGS_TABS}
            defaultTab="shortcuts"
            header={{ size: 'sm', voice: 'mono' }}
            renderContent={(tab) => (tab === 'shortcuts'
              ? <SettingsShortcuts sections={SHORTCUTS} />
              : <div className="flex flex-col gap-8">
                  <SettingsLinks links={[{ label: 'GitHub', url: 'https://github.com/Tor-Grimsson/kol-ds' }, { label: 'Kolkrabbi', url: 'https://kolkrabbi.io' }]} />
                  <SettingsColophon year={2026} />
                </div>)}
          />
        ) : path === '/library'
          ? catalog('Library', 'Saved sessions and shared racks', SAVED)
          : catalog('Monitor', 'Video synthesis workstation', view === 'recent' ? PRESETS : SAVED)}
      </AppShell>
      {shortcuts && <ShortcutsOverlay shortcuts={SHORTCUTS} onClose={() => setShortcuts(false)} />}
    </>
  )
}
