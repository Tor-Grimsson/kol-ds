import { useEffect, useRef, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { AppStudio, PageShell, useNavHidden, useSettingsToggle } from '@kolkrabbi/kol-shell'
import { PageHeader } from '@kolkrabbi/kol-component'
import { downloadBlob } from '@kolkrabbi/kol-component'
/* THE SETTINGS ROWS ARE TYPED DATA over the editor's own store (2026-10-24): the package exports its rows as `render`
   closures drawing their own sunken Dropdown — the hole the rail refuses now — so this layout names the same six
   settings as data and the Hub draws the controls. kol-fxr's AppSettings takes the same shape on adoption. */
import { useAppSettings, setAppSetting } from '../../../packages/design-editor/src/editor/lib/appSettings.js'
import { ASPECTS } from '../../../packages/design-editor/src/editor/shell/aspects.js'
import { pack } from '../../../packages/design-editor/src/editor/packs.js'
import { transport } from '../../../packages/design-editor/src/editor/params/transport.js'
import logomarkUrl from '@kolkrabbi/kol-icons/identity/kolkrabbi/kolkrabbi-logomark.svg?url'
import { createFixtureClient } from 'media-fixture'
import { cover, title } from '../../studio-hub/src/covers.js'
import Library from './pages/Library.jsx'
/* The rail-extras store moved into the package with labs (0.4.0): labs WRITES
   it and this layout READS it, so two module copies meant subscribing to a
   store nothing ever touched. One copy, one store. */
import {
  useRailExtras, RAIL_EXTRA_PREFIX,
  setMode, withView, loadLibrary,
  shortcutsBySection, comboLabel, currentView,
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

/* THE RAIL IS FXR'S (user 2026-10-24, fxr.kolkrabbi.io: *"this is how FXR rail should look … labs is the one you enter
 * instead of entering chrome. chrome was just done in studio-hub to show the system for labs"*): Library · Editor · Labs ·
 * Randomiser · Morph. Labs ENTERS (its categories hold sections — Effects expands inside), the rest are rows; the Chrome
 * section and its page of 2026-10-23 are gone (the old layout is in _tmp/2026-10-24-create-on-studiocreate/). The
 * chromes own the phone's bottom edge. Morph is a row with a placeholder page until the mirrored editor carries its route. */
const CHROME_ROWS = [
  { icon: 'desktop', path: '/editor', label: 'Editor', bar: false },
  { icon: 'globe', path: '/labs', label: 'Labs', bar: false },
  { icon: 'refresh', path: '/randomiser', label: 'Randomiser', bar: false },
  { icon: 'swap', path: '/morph', label: 'Morph', bar: false },
]
export const NAV_ITEMS = [
  { icon: 'nav-library', path: '/library', label: 'Library' },
  ...CHROME_ROWS,
]

const SETTINGS_PATH = '/settings'
const CHROME_PATHS = new Set(['/editor', '/labs', '/randomiser', '/morph'])

/* The ⌥-digit order: the rail READ TOP TO BOTTOM, logomark first. Derived from
   the rows above so adding a destination cannot silently renumber the rest —
   the only hardcoded entries are Home (the mark, not a row) and the Hub's
   pinned Settings. */
const KEY_ORDER = ['/', ...NAV_ITEMS.map((n) => n.path), SETTINGS_PATH] /* Home, Library, Editor, Labs, Randomiser, Morph, Settings */

/* the editor's six settings, typed; the store's defaults for the rail's reset (kol-fxr's AppSettings owns the originals) */
const ASPECT_OPTIONS = ASPECTS.map((a) => ({ value: a.id, label: a.label })).filter((o) => o.value !== 'custom')
const LOOP_LENGTH_OPTIONS = [2, 4, 8, 12, 16].map((n) => ({ value: n, label: `${n} s` }))
const SETTING_DEFAULTS = { defaultAspect: '4:5', defaultTheme: 'kol', autoplay: false, clipToFrame: true, labsModDots: false, defaultLoopSeconds: 4 }
function useSettings() {
  const s = useAppSettings()
  return {
    sections: [
      { label: 'Defaults', rows: [
        { label: 'Default aspect', type: 'choice', options: ASPECT_OPTIONS, value: s.defaultAspect, onChange: (v) => setAppSetting('defaultAspect', v) },
        ...(pack('generators') ? [{ label: 'Loop theme', type: 'choice', options: pack('generators').THEME_OPTIONS, value: s.defaultTheme, onChange: (v) => setAppSetting('defaultTheme', v) }] : []),
        { label: 'Clip to frame', type: 'switch', on: s.clipToFrame, onChange: (v) => setAppSetting('clipToFrame', v) },
        { label: 'Modulation dots', type: 'switch', on: s.labsModDots, onChange: (v) => setAppSetting('labsModDots', v) },
      ] },
      { label: 'Transport', rows: [
        { label: 'Autoplay', type: 'switch', on: s.autoplay, onChange: (v) => setAppSetting('autoplay', v) },
        { label: 'Loop length', type: 'choice', options: LOOP_LENGTH_OPTIONS, value: s.defaultLoopSeconds, onChange: (n) => { setAppSetting('defaultLoopSeconds', n); transport.setLoopSeconds(n) } },
      ] },
    ],
    drawer: { onReset: () => { Object.entries(SETTING_DEFAULTS).forEach(([k, v]) => setAppSetting(k, v)); transport.setLoopSeconds(SETTING_DEFAULTS.defaultLoopSeconds) } },
  }
}

const APP = {
  name: 'FXR', /* kol-fxr's (AppLayout.jsx:116) */
  subtitle: 'Pick a chrome. All three run the same engine.',
  logomark: logomarkUrl,
  about: 'A DOM/SVG design compositor — frames, layers, vector tools — with generative, kinetic-type and effects layers on the same engine, served through three chromes: the Editor, Labs, and the Randomiser. Ships as a standalone app and as the embeddable @kolkrabbi/design-editor library.',
  links: [
    { label: 'GitHub', url: 'https://github.com/Tor-Grimsson/kol-fxr' },
    { label: 'Kolkrabbi', url: 'https://fxr.kolkrabbi.io' },
    { label: 'Vercel', url: 'https://vercel.com/tor-grimssons-projects/kol-fxr' },
  ],
}

/* HOME'S FILES (HubHomeContract, 2026-10-23): the Hub draws the cards; this app hands it DATA. The
   files are the library's saved presets, read through `loadLibrary()` on every render (library-reader-
   for-a-hub-home: a provider above the shell goes stale beside the editor's own); a preset's cover is
   the `thumb` captured at save (plan 39 § 3.1); its layers and aspect are `details`, shown in the rail
   the cog opens (the card is title, date, size — his ruling 2026-10-23). New File is the action button,
   not a card (files only). A saved preset has no load path outside the editor
   (LibraryPage's ruling), so a click opens the editor. The editor mirrored here exports no storage
   writes — `renameStored` · `duplicateStored` · `removeStored` are fxr's own, ahead of the mirror — so
   the cards carry no verbs until the mirror is refreshed; a verb not passed is not drawn. */
const presetOf = (id) => (loadLibrary().preset ?? []).find((p) => p.id === id)
/* THE REVIEW SEED (user 2026-10-23: *"editor hub has no cards"*): a fresh browser has no saved presets, so Home drew
 * nothing. With none saved, twelve dummy presets stand in — the same covers studio-hub draws — and leave the moment a
 * real preset is saved. Nothing is written to the library. */
const DAY = 86400000
/* THE CHROME IS A MARK ON THE CARD (user 2026-10-24): a file is saved as the chrome it was made with — an Editor file, a
 * Labs file, a Randomiser file (a simplified Labs file), a Morph file (a transition between files). They show together;
 * the mark is the chrome's glyph in the cover's corner, and the rail reads Chrome · Editor. Never a filter. */
const CHROMES = {
  editor: { icon: 'desktop', label: 'Editor', of: 'Chrome' },
  labs: { icon: 'globe', label: 'Labs', of: 'Chrome' },
  randomiser: { icon: 'refresh', label: 'Randomiser', of: 'Chrome' },
  morph: { icon: 'swap', label: 'Morph', of: 'Chrome' },
}
const chromeOf = (p) => CHROMES[String(p?.chrome ?? p?.view ?? p?.source ?? 'editor').toLowerCase()] ?? CHROMES.editor
const SEED_NAMES = ['neon-grid', 'poster-a', 'kinetic-type', 'halftone', 'glitch-wash', 'ribbon', 'noise-field', 'stencil', 'wave-text', 'collage', 'scanlines', 'monogram']
const SEED = SEED_NAMES.map((slug, i) => ({
  id: `seed-${slug}`,
  name: title(slug),
  updatedAt: Date.parse('2026-10-23T12:00:00Z') - i * DAY,
  bytes: 1800 + i * 940,
  cover: cover(i + 30),
  tags: [['poster', 'social', 'test', 'loop'][i % 4]],
  mark: Object.values(CHROMES)[i % 4],
  details: [{ label: 'Layers', value: 2 + (i % 6) }, { label: 'Aspect', value: ['1:1', '4:5', '16:9'][i % 3] }],
}))
const filesOf = (saved) => {
  const list = saved.map((p) => ({
    id: p.id,
    name: p.name || 'Untitled preset',
    mark: chromeOf(p),
    details: [{ label: 'Layers', value: p.layers?.length ?? 0 }, { label: 'Aspect', value: p.aspect ?? '1:1' }],
    updatedAt: p.updatedAt ?? p.savedAt,
    bytes: new Blob([JSON.stringify(p)]).size,
    cover: p.thumb,
  }))
  return list.length ? list : SEED
}
/* EVERY VERB, OVER THIS APP'S OWN STATE (user 2026-10-24: *"why isnt there a trash icon in cards in library? how can you
 * manage your library?"* — the hubs passed no handlers, so the card had no cog, no trash, and the rail no pencil). The
 * files live here, seeded from the library or the review seed and re-read when the library's presets change; Rename,
 * Duplicate, Delete, tags and the note write this state, the way studio-hub's do. The editor mirrored here exports no
 * storage writes, so a verb on a real preset is this session's until fxr's `renameStored` · `duplicateStored` ·
 * `removeStored` arrive with the next refresh of the mirror. */
function useFiles() {
  const saved = loadLibrary().preset ?? []
  const key = saved.map((p) => p.id).join()
  const [files, setFiles] = useState(() => filesOf(saved))
  useEffect(() => { setFiles(filesOf(loadLibrary().preset ?? [])) }, [key])
  return [files, setFiles]
}
/* LABS ALWAYS CARRIES ITS CATEGORIES (user 2026-10-24: at Home, Chrome EXPANDED instead of entering, because Labs' rows
 * were leaves — its categories reached the rail only after a labs pick: *"its literally in THE STUDIO-HUB"*). The five
 * sections and their groups are read off the editor's labs catalog with no layer and no handlers — the shape, not the
 * picks — so by the one rule Chrome enters, Labs enters, Effects expands, at Home and on /labs alike. Lazily, like the
 * chromes: the catalog pulls the engines, which the shell tier never carries. A press on a group before labs is mounted
 * opens /labs and runs the pick once LabsNav has published its dispatch (`pendingPick`). */
const noop = () => {}
function useLabsRows() {
  const [rows, setRows] = useState([])
  useEffect(() => {
    let on = true
    import('../../../packages/design-editor/src/editor/labs/catalog.js').then(({ buildLabsCatalog, SECTION_ICONS }) => {
      if (!on) return
      const items = []
      buildLabsCatalog({ layer: null, setOnly: noop, addFilter: noop, patchFilter: noop, carriedSource: () => ({}) }).forEach((entry) => {
        if (entry.id.startsWith('sec:')) { items.push({ icon: SECTION_ICONS[entry.id.slice(4)] ?? 'square', path: `${RAIL_EXTRA_PREFIX}${entry.id}`, label: entry.label, sub: [] }); return }
        const row = { icon: entry.icon, path: `${RAIL_EXTRA_PREFIX}${entry.id}`, label: entry.label }
        const section = items[items.length - 1]
        if (section?.sub) section.sub.push(row); else items.push(row)
      })
      setRows(items)
    })
    return () => { on = false }
  }, [])
  return rows
}
/* the Media row's client — the media fixture, as studio-hub's (fxr's real client arrives with its bump) */
const fixtureClient = createFixtureClient()


/* Morph — a row with a placeholder page until the mirrored editor carries its route (fxr has it) */
function MorphPage() {
  return (
    <PageShell className="gap-10">
      <PageHeader level="app" title="Morph" subtitle="A transition between files. The mirrored editor carries no Morph route yet." />
    </PageShell>
  )
}

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
  const settings = useSettings()

  /* A route can hand the rail its own rows (labs' categories) — one rail, not
     a second component per chrome. Their paths are sentinels, so they dispatch
     instead of routing. */
  const extras = useRailExtras()
  const labsRows = useLabsRows()
  /* the Sign in row — a dummy session, as studio-hub's; the reference accepts any password */
  const [signedIn, setSignedIn] = useState(false)
  const [files, setFiles] = useFiles()

  /* Remember the pick, then leave for the chrome. */
  const enter = (id) => { setMode(id); navigate(withView(id)) }

  /* a labs pick pressed before labs is mounted — run when LabsNav publishes its dispatch */
  const pendingPick = useRef(null)
  useEffect(() => {
    const p = pendingPick.current
    if (p && extras.dispatch) { pendingPick.current = null; extras.dispatch(p) }
  }, [extras])

  /* Every hop is an SPA transition since 2026-08-27 — the chromes are lazy
     routes that mount and unmount like any page. */
  const onNavigate = (path) => {
    if (path?.startsWith(RAIL_EXTRA_PREFIX)) {
      if (!extras.dispatch) { pendingPick.current = path; enter('labs'); return }
      /* A labs pick swaps the layer without a route change, and the touch
         drawer only closes itself on `currentPath` — so it stayed open over
         the thing just picked. The scrim is the DS's own close control; press
         it. ponytail: DOM poke — replace with a shell seam if kol-shell ships
         one (a drawer that closes on any onNavigate, or a setDrawerOpen). */
      if (extras.dispatch(path)) document.querySelector('.kol-shell-drawer-scrim')?.click()
      return
    }
    navigate(path)
  }

  /* HOME'S DATA, AND THE ONE FILE CARD (studio-hub's shape): Library draws the same card from the same handlers */
  const edit = (id, patch) => setFiles((fs) => fs.map((x) => (x.id === id ? { ...x, ...patch } : x)))
  const home = {
    files,
    onOpen: () => enter('editor'),
    onDownload: (f) => { const { cover: _c, ...data } = presetOf(f.id) ?? f; downloadBlob(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }), `${f.name}.json`) },
    onRename: (f, name) => edit(f.id, { name, updatedAt: Date.now() }),
    onDuplicate: (f) => setFiles((fs) => [{ ...f, id: `${f.id}-${Date.now().toString(36)}`, name: `${f.name} copy`, updatedAt: Date.now() }, ...fs]),
    onRemove: (f) => setFiles((fs) => fs.filter((x) => x.id !== f.id)),
    onTags: (f, tags) => edit(f.id, { tags }),
    onNote: (f, note) => edit(f.id, { note }),
    /* the rail's Upload image (2.2): the picked picture becomes the file's cover */
    onCover: (f, src) => edit(f.id, { cover: src }),
    /* ponytail: New File opens the editor — the editor has no "new document" door outside its own
       File menu yet (fxr's opens the four-door chooser); wire it when the mirror carries one. */
    action: { label: 'New File', onClick: () => enter('editor') },
  }

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
    <>
    <SettingsKey />
    <AppStudio
      app={APP}
      currentPath={location.pathname}
      onNavigate={onNavigate}
      /* Scoped by `currentView()` — null on a shell page, so the full map
         renders, which is the right answer for a settings page reached from the
         rail rather than from an editor. */
      shortcuts={shortcutsBySection(currentView())}
      shortcutsKey={inChrome ? null : 's'}
      home={home}
      /* THE LIBRARY IS WHAT FXR SHIPS (user 2026-10-24) — every labs and randomiser preset, ten morph files, ten editor
         files, by chrome, on the one card, each with its page (pages/Library.jsx); Home above is the user's saves */
      library={{ children: <Library /> }}
      /* the chromes are the router's routes, rendered through the Outlet; Labs always carries its categories — the live
         rows (with their picks) on /labs, the catalog's shape everywhere else — so Labs enters and Effects expands */
      pages={CHROME_ROWS.map((c) => ({
        ...c,
        children: c.path === '/morph' ? <MorphPage /> : <RailFrame><Outlet /></RailFrame>,
        ...(c.path === '/labs' ? { sub: extras.items.length ? extras.items : labsRows } : {}),
      }))}
      /* ponytail: placeholder steps — monitor's five-step tour has no fxr copy yet. */
      walkthrough={[
        { title: '1. Pick a chrome', text: ['Placeholder.'] },
        { title: 'Get Started', actions: [{ label: 'Open Editor', onClick: () => enter('editor') }] },
      ]}
      /* the Hub's rows at the rail's foot — Media (the picker over the fixture) and Sign in — as studio-hub has them */
      media={{ client: fixtureClient }}
      signIn={{ signedIn, onPress: (password) => setSignedIn(password != null) }}
      /* THE ROWS ARE NOT AUTHORED HERE. `@kolkrabbi/design-editor` owns the
         sections and the editor's drawer renders the same ones, so the page and
         the in-place panel cannot drift the way the two topbar menus once did.
         The gear opens the Hub's drawer over the same rows. */
      /* the rail over the editor's own sections — studio-hub's tier (user 2026-10-24); the chrome picker left with the page,
         the Chrome section in the rail is the way in */
      /* the six settings as typed rows over the editor's store, reset in the footer; no Theme row — the Hub's toggle is the one */
      settings={{ ...settings, comboLabel }}
      /* the Hub's Dev row, on every rail on a dev server even with nothing in it (user 2026-10-24: "its not optional") */
      dev={{ tabs: [] }}
      /* the rail is AppStudio's preset; these two keys stay the chromes' — see the docblock */
      shell={{
        railToggleKey: '\\',
        navKeys: false,
        settingsKey: undefined,
      }}
    />
    </>
  )
}
