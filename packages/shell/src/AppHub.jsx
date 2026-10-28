import { useEffect, useMemo, useState } from 'react'
/* THE TOGGLE IS THE HUB'S (user 2026-10-24: *"THIS SHOULDNT BE POSSIBLE if you were using a preset"*): kol-framework's
   ThemeToggle, imported by its file so the framework's router-bound chrome never rides along, drawn here with the Hub's
   props on every rail — no app passes a toggle. kol-framework is kol-shell's peer for this (ARCHITECTURE §3: the shell
   consumes component + framework). `useTheme` is the Hub's own setting: reset hands the theme back to the system. */
import ThemeToggle from '@kolkrabbi/kol-framework/src/ThemeToggle.jsx'
import { useTheme } from '@kolkrabbi/kol-framework/src/theme.js'
import AppShell from './AppShell.jsx'
import HubHome from './HubHome.jsx'
import HubSettings from './HubSettings.jsx'
import HubDev from './HubDev.jsx'
import SettingsLinks, { SettingsColophon } from './SettingsLinks.jsx'
import About from './About.jsx'
import { warnJsx } from './warnJsx.js'
import { Icon } from '@kolkrabbi/kol-icons'
import { Avatar, CommandOverlay, LabeledControlSection, MediaLibrary, ModalProvider, RAIL_PRESETS, SettingsFooter, SettingsPanel, SettingsSections, ShortcutsOverlay, TabsRow, shortcutInScope, useModal } from '@kolkrabbi/kol-component'

/* taxonomy-ok: organism — nests AppShell / HubHome / HubSettings / HubDev (relative) + kol-component's CommandOverlay */

/**
 * AppHub — An app's shell and hub in one. Shell + Hub in one call; the app passes its Tool as children (the app anatomy,
 * `docs/documentation/04-compositions/16-app-anatomy.md`, 2026-09-26).
 *
 * monitor, mirror and fxr each assembled this by hand: the same AppShell props, the same
 * Home on CatalogPage, the same Settings on SettingsScaffold, a local ⌥-digit handler
 * apiece and a local shortcuts-sheet key — so their small things drifted. The Hub is
 * those decisions made once. An app describes itself and supplies its tool.
 *
 * ROUTES: `homePath` (default `/`) is Home, `settingsPath` is Settings, every other path renders
 * `children` — the tool. A tool that should be what LOADS moves Home off `/` (media-hub, user
 * 2026-09-26: "the point of this is not to bury media, the column browser is what we want loaded"):
 * `homePath="/library"`, a rail row for it, and the mark still goes to `/` — the tool.
 * Router-agnostic like AppShell: pass `currentPath` + `onNavigate`, and your router's element
 * (`<Outlet/>`) as children.
 *
 * KEYS: `,` toggles Settings · `S` toggles the shortcuts sheet · `⇧S` the shortcuts rail · `\` hides the rail ·
 * ⌥1…9 walks the rail top to bottom, mark first, Settings last · ⌘K / Ctrl+K the search modal. None fire while typing.
 *
 * ⌘K IS ONE MODAL (user 2026-10-23, HubHomeContract's review: *"no search command k"*; one modal, not two): the
 * `CommandOverlay` in search mode over Files (Home's `files`, Enter opens one through `home.onOpen`), Pages (the
 * mark, the rail rows, the pinned rows; Enter navigates) and Shortcuts (this page's keymap as folds, read-only).
 * `S` opens the same overlay in shortcuts mode, every section expanded.
 *
 * MEDIA AND SIGN IN ARE THE HUB'S ROWS (user 2026-10-23: *"they all have media and sign in … its about unification
 * and simplification"*): fxr, mirror and monitor each hand-wired both through `shell.bottomItems`. `media` and
 * `signIn` pin them at the rail's foot — Media, Sign in, Settings — as sentinels, never routes: Media opens the DS
 * picker over the consumer's client, Sign in asks for the password in the DS dialog and hands it to the consumer. `shell.bottomItems` still replaces
 * the whole foot, as it always did.
 *
 * @param {'light'|'dark'} defaultTheme  THE APP'S DEFAULT THEME (AppHubDefaultTheme, kol-mirror 2026-10-24 — *"make this repo dark mode
 *                              default"*): reset and the toggle's system choice land on it instead of the OS (kol-framework ≥0.55.0
 *                              reads `data-theme-default`, which the Hub stamps). `app.defaultTheme` says the same. Omit it and
 *                              nothing changes
 * @param {Object}   app        `{ name, subtitle, logomark (svg url), about (string | paragraphs), links [{label,url}], docs [{ label, paragraphs }] }` —
 *                              `docs` is the rail's Docs tab, an app's explanatory prose as data (SettingsRailDocsTab, 2026-10-24)
 * @param {Array}    items      the tool's rail rows `{ icon, path, label }` — Home is the mark, Settings is pinned
 * @param {string}   currentPath · {Function} onNavigate · {ElementType} iconComponent   as AppShell
 * @param {string}   homePath   where Home lives (default `/`); anything else puts the tool at `/`
 * @param {Object}   home       HubHome's props — Home's DATA (`files`, `template`, `onOpen`, the verbs, `action`,
 *                              `filterGroups`, `views`, …; HubHomeContract 2026-10-23: the Hub draws every card).
 *                              OPT-IN (apps review 2026-09-29): no `home`, no Home page — `homePath` renders the
 *                              tool and the mark goes there (media-hub: the column browser IS the app)
 * @param {Array}    walkthrough  the steps Home's Walkthrough button opens
 * @param {Object}   settings   OPT-IN like AppShell's `bottomItems` (apps review 2026-09-29: *"not sure it makes sense
 *                              to neccessarily have settings manditory part of the rail"*) — no `settings`, no rail
 *                              row, no route, no `,` key. THREE TIERS, opt-in (review 2, § 6.3 — *"most of the time you
 *                              will only need a siderail … if you are super heavy then you might want a page, then when
 *                              the page is getting heavy you might want filters"*):
 *                              THE RAIL (the default, studio-hub's) — the Settings row and `,` open `SettingsPanel` over
 *                              `sections` (SettingsSections' rows AS DATA — typed rows, `type: 'choice' | 'switch'` with
 *                              their options and values, or a text `value`; the Hub draws every control, label, value and
 *                              note in its own class and tone), the theme toggle and reset in its footer. ONE SHAPE ON
 *                              EVERY RAIL (user 2026-10-24: *"is there no criteria of what information goes into settings
 *                              rail?"* · *"not 2 lines"*): the tab row is exactly Settings · Shortcuts · About · Docs —
 *                              the three drawn by the Hub from `shortcuts`, `app.about` + `app.links` (the links under About,
 *                              SettingsRailDocsTab 2026-10-24) and `app.docs` (an app's prose, `[{ label, paragraphs }]`), on studio-hub as
 *                              on every hub; an app has NO tab of its own (a fifth word does not fit the rail on one
 *                              line) — its rows all go under Settings as sections, and the rail scrolls. Reset is live on
 *                              every rail: it hands the theme back to the system (the Hub's own setting), then runs the
 *                              app's `drawer.onReset` when it has one. NO JSX REACHES THE RAIL
 *                              (*"THIS SHOULDNT BE POSSIBLE if you were using a preset"*): `content`, a tab's `content`
 *                              and a row's `render` are ignored here with a dev warning — the page tier keeps them. No
 *                              route, no page.
 *                              `page: true` — HubSettings at `settingsPath` (its props: `sections`, `content`, `picker`,
 *                              `comboLabel`, …): the row and `,` navigate to it, its gear opens the drawer; two columns
 *                              from `lg`, no filter bar. `filters: true` (with `page`) — the page keeps its `ContentFilters`
 *                              bar, its tabs (`tabs`, ABOUT, REPO) and its search
 * @param {Object}   dev        HubDev's props (`tabs`, `title`, `subtitle`) + `path` (default `/dev`). OPT-IN, and only on
 *                              a dev server (`import.meta.env.DEV`; `always: true` overrides) — a `code` row after
 *                              the app's own rows (CompareGridDevTab · HubDevChrome, kol-monitor)
 * @param {Object}   media      `{ client, accept?, onSelect?(url, { contentType, kind }) }` — the Media row at the rail's
 *                              foot, opening `MediaLibrary variant="picker"` (the column browser with the preview pane,
 *                              Cancel and Use — mirror's) over `client` (kol-media-client's shape, or the media
 *                              fixture's). OPT-IN: no `media`, no row
 * @param {Object}   signIn     `{ signedIn, user?, onProfile?, onPress }` — the user row at the rail's foot. OPT-IN: no
 *                              `signIn`, no row. THE ACCOUNT (HubAccountRow, kol-fxr 2026-10-28 — user: *"I am the only user.
 *                              and we will treat me THE ONLY USER as a proper user"* · *"why does it say password for library
 *                              sync? … stupid."*): with `user: { name, avatar? }` the row is an account — signed out it reads
 *                              Sign in and the DS dialog asks Email and Password, then `onPress({ email, password })`; signed
 *                              in it draws the avatar (the initial when none) and the name, and opens `onProfile()` (the
 *                              app's profile page, which owns sign-out). Without `user` it is the shared-password row it was:
 *                              a `user` glyph and "Sign in" out, `cloud` and "Signed in" in; the password prompt, then
 *                              `onPress(password)`; signed in, the sign-out confirm, then `onPress(null)`
 * @param {Array}    shortcuts  `[{ section, items: [{ id, label, combo }] }]` — the sheet AND Settings
 * @param {*}        themeToggle  RETIRED 2026-10-24 — the Hub draws kol-framework's `ThemeToggle` itself, the same on every
 *                              rail (*"wrong themetoggle"* — two apps had written `tone="sunken"`); a value passed here
 *                              is ignored with a dev warning
 * @param {string}   shortcutsKey  default `s`; `null` turns the sheet key off (a tool that owns S)
 * @param {string}   shortcutsRailKey  default `S` (⇧S) — the same keymap in the right rail (`ShortcutsOverlay variant="rail"`),
 *                              this page's sections; `null` turns it off. The rail was hand-built in kol-monitor (2026-10-18)
 * @param {'display'|'mono'} masthead  the app's one masthead (AppShell's) — set, Home and Settings follow it; unset
 *                              (the default), they keep the Hub's mono title (2026-09-29)
 * @param {Object}   shell      any AppShell prop, spread last (`touch`, `pageWash`, `drawerOpenOn`, `railComponent`, …)
 *
 * THE DIALOGS ARE THE DS'S (plan-2026-10-23-studio-hub-review-2 § 0.1): the Hub mounts `ModalProvider`, so the file
 * rail's Delete confirm, the Rename prompt and the Sign in prompt are the DS dialog, never the browser's. A consumer's
 * own provider above it keeps working — `useModal` reads the nearest.
 */
const SETTINGS_ROW = (path) => [{ icon: 'nav-settings', path, label: 'Settings' }]
/* the foot's two sentinels (fxr's `#media` and `#sign-in`, made the Hub's) — a press opens, never routes */
const MEDIA_PATH = '#media'
const SIGN_IN_PATH = '#sign-in'
/* the signed-in account row's glyph is the user (HubAccountRow): a name no set ships, drawn by the rail's icon component as
 * the Avatar at the glyph's 20; a phone's pill and More draw the `user` glyph in its place */
const ACCOUNT_GLYPH = '__hub-account'
/* the drawer tier's Settings row — a sentinel too: it opens the drawer, it never routes */
const SETTINGS_DRAWER = '#settings'

const typing = (t) => t?.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t?.tagName)
const match = (label, q) => !q || String(label ?? '').toLowerCase().includes(q.toLowerCase())

/* THE TOGGLE'S PROPS ARE THE HUB'S — studio-hub's `fill="none" label={false} size="sm"`, nothing else */
const toggle = <ThemeToggle variant="button" fill="none" label={false} size="sm" tone="default" />

/* THE RAIL'S NAMED TABS — drawn here, from what the Hub already holds, so a consumer passes a word and no JSX */
const RAIL_TABS = {
  shortcuts: {
    label: 'Shortcuts',
    draw: ({ shortcuts }) => <SettingsSections divided sections={shortcuts.map((s) => ({ label: s.section, rows: (s.items ?? []).map((k, i) => ({ id: k.id ?? `${i}:${k.label}`, label: k.label, value: k.combo ?? k.keys })) }))} />,
  },
  about: {
    label: 'About',
    /* the links draw under About (SettingsRailDocsTab, kol-mirror 2026-10-24): Repo's list folds in here, so the row's
     * fourth word can be Docs and it stays one line */
    draw: ({ app }) => (
      <div className="flex flex-col gap-8">
        {app.about && <LabeledControlSection label={app.name}><About about={app.about} /></LabeledControlSection>}
        {app.links?.length > 0 && <LabeledControlSection label="Links"><SettingsLinks links={app.links} /></LabeledControlSection>}
        <SettingsColophon />
      </div>
    ),
  },
  docs: {
    label: 'Docs',
    /* an app's explanatory prose AS DATA — `app.docs: [{ label, paragraphs }]`, each a section in About's voice, out of
     * the settings sections' notes (user, on mirror's rail: *"settings are so overloaded with information that its hard to
     * navigate … we should just start a documentation tab for it"*). No JSX: `About` warns on a node */
    draw: ({ app }) => (
      <div className="flex flex-col gap-8">
        {app.docs.map((d, i) => <LabeledControlSection key={d.label ?? i} label={d.label}><About about={d.paragraphs ?? d.text} /></LabeledControlSection>)}
      </div>
    ),
  },
}
/* the rail's rows: typed, text, or nothing — a `render` row is JSX and is dropped here with a warning */
const railSections = (sections = []) => sections.map((s) => ({
  ...s,
  rows: (s.rows ?? []).filter((r) => { if (r.render && !r.type) { warnJsx('settings.sections[].render', 'Name the control: { type: "choice", options, value, onChange } or { type: "switch", on, onChange }.'); return false } return true }),
}))
const warnRailJsx = (key) => warnJsx(`settings.${key}`, 'The rail takes rows: sections, and tabs as { value, label, sections }.')

export default function AppHub(props) {
  return <ModalProvider><HubFrame {...props} /></ModalProvider>
}

function HubFrame({
  app = {},
  /* the app's default theme (AppHubDefaultTheme, kol-mirror 2026-10-24): what reset and the toggle's system fall back to */
  defaultTheme,
  items = [],
  currentPath,
  onNavigate,
  iconComponent,
  home,
  walkthrough,
  settings,
  dev,
  media,
  signIn,
  shortcuts = [],
  themeToggle,
  settingsPath = '/settings',
  homePath = '/',
  shortcutsKey = 's',
  shortcutsRailKey = 'S',
  masthead,
  shell,
  children,
}) {
  const [sheet, setSheet] = useState(false)
  const [rail, setRail] = useState(false)
  const [search, setSearch] = useState(false)
  const [query, setQuery] = useState('')
  const [mediaOpen, setMediaOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  /* the walkthrough's open state lives here so the phone bar's More sheet can open it too */
  const [touring, setTouring] = useState(false)
  /* the settings TIER: a page only when asked for, the drawer otherwise */
  const { page: settingsPage = false, filters: settingsFilters = false, ...settingsProps } = settings ?? {}
  const settingsDrawer = !!settings && !settingsPage
  const [settingsTab, setSettingsTab] = useState('settings')
  const modal = useModal()
  const theme = useTheme()
  /* THE DEFAULT THEME IS A ROOT ATTRIBUTE kol-framework's theme reads (`data-theme-default`): reset (`theme.clear()`)
   * and the toggle's alt-click hand the page to it, not to the OS — a dark-first app stays dark on a light-mode Mac */
  const themeDefault = defaultTheme ?? app.defaultTheme
  useEffect(() => {
    if (!themeDefault) return undefined
    document.documentElement.dataset.themeDefault = themeDefault
    return () => { delete document.documentElement.dataset.themeDefault }
  }, [themeDefault])
  if (themeToggle != null) warnJsx('themeToggle', 'The Hub draws the theme toggle itself; drop the prop.')
  /* THE RAIL'S TABS, the same four on every hub: Settings · Shortcuts · About · Docs, the three from what the app already
   * passes — Repo's links sit under About since SettingsRailDocsTab (kol-mirror 2026-10-24: *"settings are so overloaded with
   * information … we should just start a documentation tab for it"*), so the fourth word is the app's prose, `app.docs`, drawn
   * when it has any; an app's `tabs` are not drawn — its rows belong under Settings (dev warns) */
  if (settingsDrawer && settings.tabs?.length) warnJsx('settings.tabs', 'The rail has no app tabs — put the rows under settings.sections.')
  const railTabs = settingsDrawer ? [
    ...(shortcuts.length ? [{ value: 'shortcuts', label: RAIL_TABS.shortcuts.label, named: RAIL_TABS.shortcuts }] : []),
    ...((app.about || app.links?.length) ? [{ value: 'about', label: RAIL_TABS.about.label, named: RAIL_TABS.about }] : []),
    ...(app.docs?.length ? [{ value: 'docs', label: RAIL_TABS.docs.label, named: RAIL_TABS.docs }] : []),
  ] : []
  if (settingsDrawer && settings.content != null) warnRailJsx('content')
  const railRows = settingsDrawer ? railSections(settings.sections) : []
  /* reset, live everywhere: the theme back to the system, then the app's own */
  const reset = () => { theme.clear(); settings.drawer?.onReset?.() }
  /* SIGN IN ASKS IN THE DS DIALOG (review 2, § 5.2 — fxr's RailSignIn, verbatim copy): signed out, the password prompt —
   * empty cancels — then `onPress(password)`; signed in, the sign-out confirm, then `onPress(null)` */
  const askSignIn = async () => {
    if (!signIn) return
    /* an account: signed in opens the profile; signed out asks email and password */
    if (signIn.user || signIn.onProfile) {
      if (signIn.signedIn) { signIn.onProfile?.(); return }
      const got = await modal.form('Sign in', [
        { id: 'email', placeholder: 'Email', type: 'email', autoComplete: 'username' },
        { id: 'password', placeholder: 'Password', type: 'password', autoComplete: 'current-password' },
      ], { okLabel: 'Sign in' })
      if (got?.email && got?.password) signIn.onPress?.({ email: got.email.trim(), password: got.password })
      return
    }
    if (signIn.signedIn) {
      const ok = await modal.confirm('Sign out of the library sync? Saves stay on this device only.', { okLabel: 'Sign out' })
      if (ok) signIn.onPress?.(null)
      return
    }
    const pw = await modal.prompt('Password for the library sync:', '')
    if (pw) signIn.onPress?.(pw)
  }

  /* ⌘K / Ctrl+K — the search modal, from any Hub page; never while typing */
  useEffect(() => {
    const onKey = (e) => {
      if (e.key.toLowerCase() !== 'k' || !(e.metaKey || e.ctrlKey) || e.shiftKey || e.altKey || e.repeat || typing(e.target)) return
      e.preventDefault()
      setSearch((v) => !v)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  /* `,` — the drawer tier's key (the page tier's is AppShell's, which routes); never while typing */
  useEffect(() => {
    if (!settingsDrawer) return undefined
    const onKey = (e) => {
      if (!(e.key === ',' || e.code === 'Comma') || e.metaKey || e.ctrlKey || e.altKey || e.repeat || typing(e.target)) return
      e.preventDefault()
      setSettingsOpen((v) => !v)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [settingsDrawer])

  /* ⇧S — the keymap in the rail. Its own listener: the `S` listener ignores Shift, so the two never both fire */
  useEffect(() => {
    if (!shortcutsRailKey) return undefined
    const onKey = (e) => {
      if (e.key !== shortcutsRailKey || !e.shiftKey || e.metaKey || e.ctrlKey || e.altKey || e.repeat) return
      const t = e.target
      if (t?.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t?.tagName)) return
      e.preventDefault()
      setRail((v) => !v)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [shortcutsRailKey])

  useEffect(() => {
    if (!shortcutsKey) return undefined
    const onKey = (e) => {
      if (e.key !== shortcutsKey || e.shiftKey || e.metaKey || e.ctrlKey || e.altKey || e.repeat) return
      const t = e.target
      if (t?.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t?.tagName)) return
      e.preventDefault()
      setSheet((v) => !v)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [shortcutsKey])

  /* the dev page is a dev server's only — a production build never routes it or draws its row */
  const devOn = !!dev && (dev.always || !!import.meta.env?.DEV)
  const devPath = dev?.path ?? '/dev'
  const { path: _dp, always: _da, ...devProps } = dev ?? {}
  /* HOME'S BUTTONS ON A PHONE (user 2026-10-23: *"put new and walkthrough in the more button … crowded under the files"*):
   * with the bar, New and Walkthrough ride the top of its More sheet on Home and the page's foot row goes; with the drawer
   * (no More), they stay on the page */
  const barOn = ['bar', 'pill'].includes(shell?.touch ?? RAIL_PRESETS.app.phone)
  const onHome = home && currentPath === homePath
  const homeActions = onHome && barOn ? [
    ...(home.action ? [{ label: home.action.label, icon: 'plus', onPress: home.action.onClick }] : []),
    ...(walkthrough?.length ? [{ label: touring ? 'Close walkthrough' : 'Walkthrough', icon: 'book-open', onPress: () => setTouring((t) => !t) }] : []),
  ] : []
  /* SIGNED OUT (HubHomeSignedOut, 2026-10-28): Home is the stage, no files; the desk's round + carries Sign in beside New File
   * and Walkthrough; on a phone the pill is the app's chromes and More is the rail (frame A2) */
  const signedOutHome = onHome && (home.signedOut ?? (home.stage != null && !(home.files?.length)))
  const signInAction = signIn && !signIn.signedIn ? { label: 'Sign in', icon: 'user', onPress: () => askSignIn() } : undefined
  const page = onHome
    ? <HubHome app={app} iconComponent={iconComponent} walkthrough={walkthrough} {...home} touring={touring} onTouringChange={setTouring} actionsInBar={barOn} signInAction={signInAction} />
    : settingsPage && currentPath === settingsPath
      ? <HubSettings app={app} shortcuts={shortcuts} themeToggle={toggle} filters={settingsFilters} {...settingsProps} drawer={settingsProps.drawer ?? true} />
      : devOn && (currentPath === devPath || currentPath?.startsWith(`${devPath}/`))
        ? <HubDev storageKey={`kol-dev-tab:${app.name ?? 'app'}`} {...devProps} />
        : children
  /* the Dev row closes the app's own rows — under Stage in monitor (HubDevChrome, kol-monitor 2026-10-18 — user:
   * *"why did the dev tab move? it was fine where it was. below stage"*); Settings keeps the bottom alone */
  const rows = devOn ? [...items, { icon: 'code', path: devPath, label: 'Dev' }] : items
  /* the pinned foot: Media, Sign in, Settings — each only when the app passes it */
  const bottom = [
    ...(media ? [{ icon: 'image', path: MEDIA_PATH, label: 'Media' }] : []),
    ...(signIn ? [signIn.signedIn && signIn.user
      ? { icon: ACCOUNT_GLYPH, path: SIGN_IN_PATH, label: signIn.user.name ?? 'Account' }
      : { icon: signIn.signedIn ? 'cloud' : 'user', path: SIGN_IN_PATH, label: signIn.signedIn ? 'Signed in' : 'Sign in' }] : []),
    ...(settings ? SETTINGS_ROW(settingsDrawer ? SETTINGS_DRAWER : settingsPath) : []),
  ]
  /* the phone bar lists Home as a tab — the rail draws it as the mark, the bar has no mark */
  const barItems = [...(home ? [{ icon: 'home-01', path: homePath, label: 'Home' }] : []), ...rows, ...bottom.map((r) => (r.icon === ACCOUNT_GLYPH ? { ...r, icon: 'user' } : r))]
  /* the rail's glyphs, with the account's avatar where its row is */
  const user = signIn?.signedIn ? signIn.user : null
  const railIcon = useMemo(() => {
    if (!user) return iconComponent
    const Base = iconComponent ?? Icon
    const initial = (user.name ?? '?').trim().charAt(0).toUpperCase()
    return function HubRailIcon({ name, ...rest }) {
      return name === ACCOUNT_GLYPH ? <Avatar initial={initial} src={user.avatar} alt="" size="xs" /> : <Base name={name} {...rest} />
    }
  }, [iconComponent, user?.name, user?.avatar]) // eslint-disable-line react-hooks/exhaustive-deps
  /* the two sentinels open, everything else routes — the rail, the bar, ⌥-digits and ⌘K all come through here */
  const go = (path, ...rest) => {
    if (path === MEDIA_PATH) { setMediaOpen(true); return }
    if (path === SIGN_IN_PATH) { askSignIn(); return }
    if (path === SETTINGS_DRAWER) { setSettingsOpen((v) => !v); return }
    return onNavigate?.(path, ...rest)
  }

  /* ⌘K's rows: Files, Pages, Shortcuts — the pages are the rail as drawn, mark first */
  const pages = [...(home ? [{ icon: 'home-01', path: homePath, label: 'Home' }] : []), ...rows, ...bottom]
    .map((r) => ({ id: `page:${r.path}`, label: r.label, group: 'Pages', icon: r.icon, path: r.path }))
  const files = (home?.files ?? []).map((f) => ({ id: `file:${f.id}`, label: f.name, group: 'Files', icon: 'file', file: f }))
  const keymap = shortcuts.filter((s) => shortcutInScope(s, currentPath))
  const suggestions = [
    ...files, ...pages,
    /* every Shortcuts fold starts OPEN, as the S sheet's do (review 2, § 6.1 — *"search still says expand all … should say
     * collapse all and be already expanded"*): the footer reads Collapse all on open */
    ...keymap.map((s) => ({ id: `cat:${s.section}`, label: s.section, group: 'Shortcuts', open: true, items: (s.items ?? []).map((it, i) => ({ id: it.id ?? `${i}:${it.label}`, label: it.label, hint: it.combo ?? it.keys, keepOpen: true })) })),
  ]
  const results = [
    ...files.filter((r) => match(r.label, query)),
    ...pages.filter((r) => match(r.label, query)),
    ...keymap.flatMap((s) => (s.items ?? []).filter((it) => match(it.label, query)).map((it, i) => ({ id: `key:${s.section}:${it.id ?? i}`, label: it.label, group: 'Shortcuts', hint: it.combo ?? it.keys, keepOpen: true }))),
  ]
  const closeSearch = () => { setSearch(false); setQuery('') }
  const pick = (item) => {
    if (item.file) { home?.onOpen?.(item.file); return }
    if (item.path) go(item.path)
  }

  return (
    <AppShell
      items={rows}
      bottomItems={bottom}
      barItems={signedOutHome && home.chromes?.length ? home.chromes.map((c) => ({ id: c.label, label: c.label, icon: c.icon, onPress: c.onPress })) : barItems}
      barActions={homeActions}
      phoneNav={signedOutHome && home.chromes?.length ? { sheetItems: [...rows, ...bottom.map((r) => ({ ...r, icon: r.icon === ACCOUNT_GLYPH ? 'user' : r.icon, foot: true }))], moreKeepsOpen: true } : undefined}
      logomark={app.logomark ? { svgUrl: app.logomark, title: app.name } : undefined}
      currentPath={currentPath}
      onNavigate={go}
      iconComponent={railIcon}
      appName={app.name}
      railToggleKey={'\\'}
      settingsPath={settingsPage ? settingsPath : undefined}
      settingsKey={settingsPage ? ',' : undefined}
      navKeys
      /* THE RAIL IS THE `app` PRESET (2026-10-24) and the phone nav is its shape — the pill; `shell={{ touch: 'drawer' }}`
       * still gets the drawer, `shell={{ rail }}` another rail */
      rail="app"
      touch={RAIL_PRESETS.app.phone}
      masthead={masthead}
      pageWash="var(--kol-fg-02)"
      {...shell}
    >
      {page}
      {/* THE SHEET IS THE ⌘K MODAL WITH NO FIELD (ShortcutsOverlayCategories, kol-monitor 2026-10-18 — user: *"I said
        * no search, I didnt say DONT USE THE FUCKIN MODAL OVERLAY"*): this page's sections as categories under
        * "Shortcuts", each drilling in to its keys; `S` toggles, Esc closes; ⇧S is the rail's. Reverses 0.68.0's swap. */}
      <CommandOverlay open={sheet} mode="shortcuts" shortcuts={shortcuts} currentPath={currentPath} onClose={() => setSheet(false)} />
      {/* ⌘K — the same overlay in search mode over Files, Pages and Shortcuts */}
      <CommandOverlay open={search} suggestions={suggestions} results={results} query={query} onQueryChange={setQuery} onSelect={pick} onClose={closeSearch} placeholder="Search files, pages and shortcuts" selectLabel="Open" />
      {rail && <ShortcutsOverlay variant="rail" shortcuts={shortcuts} currentPath={currentPath} onClose={() => setRail(false)} />}
      {/* the Media row's door — the picker mirror opens (kol-mirror App.jsx:280; review 2, § 5.1: *"incorrect media, did
        * you not look at mirror"*): the column browser with the preview pane, Cancel and Use, over the consumer's client */}
      {media && (
        <MediaLibrary variant="picker" open={mediaOpen} client={media.client} accept={media.accept} onClose={() => setMediaOpen(false)} onSelect={(url, meta) => { setMediaOpen(false); media.onSelect?.(url, meta) }} />
      )}
      {/* THE RAIL tier — studio-hub's, the template (user 2026-10-24: *"In studio what kind of settings tier is there? ITS A
        * RAIL"*): `sections` in the rail, the theme toggle (the Hub's props) and reset in its footer; with `tabs`, a text
        * TabsRow under the header — Settings first, then the app's (Monitor: Shortcuts, About, Repo; Mirror: Performance)
        * — like the labs rail's levels, never a page. Rows only: the Hub draws every string, so no rail can wear a class
        * the template does not */}
      {settingsDrawer && (
        <SettingsPanel
          open={settingsOpen}
          variant="rail"
          title={settings.drawer?.title ?? 'Settings'}
          onClose={() => setSettingsOpen(false)}
          /* the footer on every rail: the toggle, and a live reset */
          footer={<SettingsFooter onReset={reset}>{toggle}</SettingsFooter>}
        >
          {/* the tab row wraps in the 380 rail — five tabs (Mirror's Performance beside the Hub's three) overran it */}
          {railTabs.length > 0 && (
            <TabsRow look="text" size={12} tracked className="flex-wrap gap-x-6 gap-y-2" tabs={[{ id: 'settings', label: 'Settings' }, ...railTabs.map((t) => ({ id: t.value, label: t.label }))]} value={settingsTab} onChange={setSettingsTab} ariaLabel="Settings tabs" />
          )}
          {settingsTab === 'settings'
            ? (railRows.length > 0 && <SettingsSections sections={railRows} divided />)
            : railTabs.find((x) => x.value === settingsTab)?.named?.draw({ app, shortcuts })}
        </SettingsPanel>
      )}
    </AppShell>
  )
}
