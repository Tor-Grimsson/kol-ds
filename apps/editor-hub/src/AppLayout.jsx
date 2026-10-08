import { useEffect, useRef } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { AppHub, useNavHidden, useSettingsToggle } from '@kolkrabbi/kol-shell'
import { Button, Dropdown } from '@kolkrabbi/kol-component'
import { ThemeToggle } from '@kolkrabbi/kol-framework'
import logomarkUrl from '@kolkrabbi/kol-brand/svg/favicon-01.svg?url'
/* The rail-extras store moved into the package with labs (0.4.0): labs WRITES
   it and this layout READS it, so two module copies meant subscribing to a
   store nothing ever touched. One copy, one store. */
import {
  useRailExtras, RAIL_EXTRA_PREFIX,
  MODES, setMode, withView, loadLibrary,
  useSettingsSections, shortcutsBySection, comboLabel, currentView,
} from '@kolkrabbi/design-editor'

/**
 * AppLayout — the shell tier's layout root: kol-shell's `AppHub` (the Shell and
 * the Hub in one call) wrapping the router's `<Outlet/>`. kol-shell is
 * router-agnostic by design, so the consumer supplies `currentPath` /
 * `onNavigate` and that is the whole wiring.
 *
 * ON THE HUB SINCE 2026-10-07 (kol-fxr's ruling, taken here the same day): Home,
 * Settings and the S sheet are `AppHub`'s pages — `HubHome` and `HubSettings`
 * were rebuilt FROM this app's hand-written `HomePage` / `SettingsPage` (the
 * Hub, 2026-09-26; both retired to `_tmp/2026-10-07-editor-hub-hub-pages/`).
 * What stays per-app is below: the rail rows, the sets, the settings rows, the
 * keys the chromes own. Home's SAVED set reads `loadLibrary()` on every render —
 * the reader design-editor exports for exactly this
 * (`library-reader-for-a-hub-home`): a provider above the shell went stale
 * beside the editor's own, and a provider inside a Hub page is the wrong layer.
 *
 * EVERYTHING SITS UNDER THE RAIL (user ruling 2026-08-27). `railToggleKey`
 * hides it (`\` — H is the editor's layer-visibility key) and the rail comes
 * back on every route change; `touch="drawer"` (kol-shell 0.31.0) takes the
 * rail OFF-CANVAS under 768px — a hamburger top-right brings it in over a
 * scrim, and labs' catalog rows ride it exactly as they do the desktop rail.
 * It was `bare` until 2026-09-01: no shell at all on a coarse pointer, which
 * left a phone's `/labs` with nowhere to render its nav (user: "labs needs
 * both sidebars, just via hamburger menu"). The logomark ships from kol-brand.
 *
 * ⌥-DIGIT IS LOCAL, NOT AppShell's `navKeys` (user, 2026-08-28: "alt 1 should
 * short to home, library 3 4 5"). `navKeys` walks Home and Settings since the
 * Hub, but it numbers the rows AS GIVEN — and labs INSERTS its category rows
 * into `items` under Labs (see railExtras), so ⌥5-9 would jump to
 * Effects/Generative rows on that one route. The digit must stay stable per
 * destination regardless of what a chrome contributes.
 *
 * So: ⌥1 Home · ⌥2 Library · ⌥3 Editor · ⌥4 Labs · ⌥5 Randomiser · ⌥6 Settings
 * — the rail read top to bottom, logomark included. kol-mirror runs the same
 * shape for the same reason (its ⌥1 is HOME too).
 *
 * Matched on `e.code` (`Digit1`…), because Opt+digit yields `¡ ™ £ ¢` as
 * `e.key` on macOS. Option rather than Command: ⌘1-9 is the browser's own tab
 * switch. Never while typing in a field.
 *
 * THE CHROMES OWN THEIR KEYS. Inside a chrome, `S` is the editor's keymap
 * (`kol:show-shortcuts` → its own scoped sheet; labs' S since 0.21.0), and `,`
 * is answered by the chrome's drawer first (`SettingsKey` below). So the Hub's
 * `shortcutsKey` is off on the chrome routes — two window listeners on one key
 * would open two sheets — and AppShell's `settingsKey` is off everywhere.
 *
 * `pageWash` (kol-shell 0.11.0, ShellPageWash — filed from kol-monitor) is the
 * estate's page background rule: AppShell always paints surface-primary as the
 * back of the back, and the wash is a TRANSPARENT fg step on top of it, never a
 * surface swap. `--kol-fg-02` is the rung (user, 2026-08-27) — the Hub's own
 * default. Any route root that is not a `PageShell` reads
 * `var(--kol-shell-page-wash, var(--kol-surface-primary))` itself.
 */

export const NAV_ITEMS = [
  { icon: 'nav-library', path: '/library', label: 'Library' },
  { icon: 'desktop', path: '/editor', label: 'Editor' },
  { icon: 'globe', path: '/labs', label: 'Labs' },
  { icon: 'refresh', path: '/randomiser', label: 'Randomiser' },
]

const SETTINGS_PATH = '/settings'
const CHROME_PATHS = new Set(['/editor', '/labs', '/randomiser'])

/* The ⌥-digit order: the rail READ TOP TO BOTTOM, logomark first. Derived from
   the rows above so adding a destination cannot silently renumber the rest —
   the only hardcoded entries are Home (the mark, not a row) and the Hub's
   pinned Settings. */
const KEY_ORDER = ['/', ...NAV_ITEMS.map((n) => n.path), SETTINGS_PATH]

const APP = {
  name: 'Effexor FXR',
  subtitle: 'Pick a chrome. All three run the same engine.',
  logomark: logomarkUrl,
  about: <>A DOM/SVG design compositor — frames, layers, vector tools — with generative, kinetic-type and effects layers on the same engine, served through three chromes: the Editor, Labs, and the Randomiser. Ships as a standalone app and as the embeddable <code>@kolkrabbi/design-editor</code> library.</>,
  links: [
    { label: 'GitHub', url: 'https://github.com/Tor-Grimsson/kol-fxr' },
    { label: 'Kolkrabbi', url: 'https://fxr.kolkrabbi.io' },
    { label: 'Vercel', url: 'https://vercel.com/tor-grimssons-projects/kol-fxr' },
  ],
}

/* HOME'S SETS. RECENT = the three chromes, the starting points; SAVED = the
   library's saved presets (monitor: the empty rack vs all presets). `name` /
   `title` are what the page's search reads. Card media = a photo of the chrome
   (`public/previews/chromes/<id>.png`). Saved presets have no load path outside
   the editor (LibraryPage's ruling), so their cards are static — the library
   page is where they are managed. */
const CHROMES = MODES.map((m) => ({ name: m.id, title: m.label, detail: m.blurb }))

const fmtDate = (ms) =>
  new Date(ms).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })

const savedCards = () => (loadLibrary().preset ?? []).map((p) => ({
  name: p.id,
  title: p.name || 'Untitled preset',
  detail: `${p.layers?.length ?? 0} layers · ${p.aspect ?? '1:1'} · ${fmtDate(p.savedAt)}`,
}))

/* THE SETTINGS MASTHEAD'S PICKER — three chromes where kol-r2b2's row 1 has
   buckets. `tone="sunken"` because the page wears a wash and the control sits
   BELOW its plane. */
const CHROME_PICKS = [
  { value: '', label: 'Open a chrome' },
  { value: 'editor', label: 'Editor' },
  { value: 'labs', label: 'Labs' },
  { value: 'randomiser', label: 'Randomiser' },
]

/* Publishes `--fxr-rail` — the rail's width, or 0 when hidden or absent — so a
   chrome's FIXED layers (the randomiser's overlays) keep clear of it; AppShell
   only offsets in-flow content. No provider (bare mode) = no rail = 0. */
function RailFrame({ children }) {
  const nav = useNavHidden()
  return (
    <div className="contents" style={{ '--fxr-rail': !nav || nav.navHidden ? '0px' : 'var(--kol-shell-rail-width)' }}>
      {children}
    </div>
  )
}

/* `,` and ⌥, — SETTINGS, FROM ANYWHERE (user, 2026-08-28: "open whatever
   settings is available at any time"). A chrome answers it with its drawer
   (EditorShell listens and calls preventDefault on the event); a shell page has
   no drawer, so the SHELL's toggle takes it — which is why this sits inside
   `AppHub` rather than beside it: `useSettingsToggle` reads the shell's own
   context and is a no-op outside it.

   The toggle itself is kol-shell's since 0.25.0 (`SettingsToggleGesture`) and
   reachable since 0.26.0 (`SettingsToggleGestureConsumerSeam`, filed from here)
   — so the return path is the shell's bookkeeping now, not a `lastPage` ref
   here. AppShell's own `settingsKey` is deliberately OFF: this handler is the
   gesture, because only the app knows whether a drawer or the page should answer.

   Matched on `e.code`: Option rewrites `e.key` on macOS (⌥, is `≤`), and the
   physical key is the same one either way. */
function SettingsKey() {
  const toggleSettings = useSettingsToggle()
  const ref = useRef(toggleSettings)
  ref.current = toggleSettings
  useEffect(() => {
    const onKey = (e) => {
      if (e.code !== 'Comma' || e.metaKey || e.ctrlKey) return
      const t = e.target
      if (t?.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t?.tagName)) return
      e.preventDefault()
      const handled = !window.dispatchEvent(new CustomEvent('kol:open-settings', { cancelable: true }))
      if (!handled) ref.current()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])
  return null
}

export default function AppLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const sections = useSettingsSections()

  /* A route can hand the rail its own rows (labs' categories) — one rail, not
     a second component per chrome. Their paths are sentinels, so they dispatch
     instead of routing. */
  const extras = useRailExtras()

  /* Every hop is an SPA transition since 2026-08-27 — the chromes are lazy
     routes that mount and unmount like any page. */
  const onNavigate = (path) => {
    if (path?.startsWith(RAIL_EXTRA_PREFIX)) {
      /* A labs pick swaps the layer without a route change, and the touch
         drawer only closes itself on `currentPath` — so it stayed open over
         the thing just picked. The scrim is the DS's own close control; press
         it. ponytail: DOM poke — replace with a shell seam if kol-shell ships
         one (a drawer that closes on any onNavigate, or a setDrawerOpen). */
      if (extras.dispatch?.(path)) document.querySelector('.kol-shell-drawer-scrim')?.click()
      return
    }
    navigate(path)
  }

  /* Remember the pick, then leave for the chrome. */
  const enter = (id) => { setMode(id); navigate(withView(id)) }

  /* ⌥1…⌥6 — the rail top to bottom, HOME included. See the docblock for why
     this is local rather than AppShell's `navKeys`. */
  const navRef = useRef(onNavigate)
  navRef.current = onNavigate
  useEffect(() => {
    const onKey = (e) => {
      const t = e.target
      if (t?.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t?.tagName)) return

      const m = /^Digit([1-9])$/.exec(e.code)
      if (!m || !e.altKey || e.metaKey || e.ctrlKey) return
      const path = KEY_ORDER[Number(m[1]) - 1]
      if (!path) return
      e.preventDefault()
      navRef.current(path)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const inChrome = CHROME_PATHS.has(location.pathname)

  return (
    <AppHub
      app={APP}
      /* Labs' category rows sit DIRECTLY UNDER Labs, not after the whole nav —
         they belong to that destination, and appending them put them below
         Randomiser. `KEY_ORDER` is derived from NAV_ITEMS, not from this, so
         ⌥-digit is unaffected by where they land. */
      items={extras.items.length
        ? NAV_ITEMS.flatMap((n) => (n.path === '/labs' ? [n, ...extras.items] : [n]))
        : NAV_ITEMS}
      currentPath={location.pathname}
      onNavigate={onNavigate}
      settingsPath={SETTINGS_PATH}
      /* Scoped by `currentView()` — null on a shell page, so the full map
         renders, which is the right answer for a settings page reached from the
         rail rather than from an editor. */
      shortcuts={shortcutsBySection(currentView())}
      shortcutsKey={inChrome ? null : 's'}
      themeToggle={<ThemeToggle fill="none" tone="sunken" label={false} size="sm" />}
      home={{
        items: (view) => (view === 'recent' ? CHROMES : savedCards()),
        filtersTitle: 'All Chromes',
        toCard: (c, { view: v }) => ({
          key: c.name,
          title: c.title,
          detail: c.detail,
          media: v === 'recent' ? <img src={`/previews/chromes/${c.name}.png`} alt={c.title} /> : undefined,
          onClick: v === 'recent' ? () => enter(c.name) : undefined,
        }),
        /* ponytail: New File is a placeholder — the editor has no "new document"
           door outside its own File menu yet; wire it when one exists. */
        actions: <Button tone="grey" size="md" onClick={() => {}}>New File</Button>,
      }}
      /* ponytail: placeholder steps — monitor's five-step tour has no fxr copy yet. */
      walkthrough={[
        { title: '1. Pick a chrome', text: ['Placeholder.'] },
        { title: 'Get Started', actions: (close) => <Button tone="grey" size="md" onClick={() => { close(); enter('editor') }}>Open Editor</Button> },
      ]}
      /* THE ROWS ARE NOT AUTHORED HERE. `@kolkrabbi/design-editor` owns the
         sections and the editor's drawer renders the same ones, so the page and
         the in-place panel cannot drift the way the two topbar menus once did.
         The gear opens the Hub's drawer over the same rows. */
      settings={{
        sections,
        drawer: true,
        splitShortcuts: true,
        comboLabel,
        picker: (
          <Dropdown
            className="w-48"
            tone="sunken"
            options={CHROME_PICKS}
            value=""
            onChange={(v) => v && navigate(`/${v}`)}
            aria-label="Open a chrome"
          />
        ),
      }}
      shell={{
        railToggleKey: '\\',
        touch: 'drawer',
        railSections: 'enter',
        /* the two keys the chromes own — see the docblock */
        navKeys: false,
        settingsKey: undefined,
      }}
    >
      <SettingsKey />
      <RailFrame>
        <Outlet />
      </RailFrame>
    </AppHub>
  )
}
