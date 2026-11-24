import { useEffect, useRef, useState } from 'react'
import { ModalProvider, RailSwitcher, ToastHost, useMediaQuery } from '@kolkrabbi/kol-component'
import { VariantContext } from '../variant.js'
import Editor from './pages/Editor.jsx'
import Labs from './pages/Labs.jsx'
import Morph from './pages/Morph.jsx'
import Randomiser from './pages/Randomiser.jsx'
import { ModalAskHost } from './ui/ask.js'
import SettingsHost from './app/SettingsHost.jsx'
import GateNarrow from './app/GateNarrow.jsx'
import PhoneNav from './app/PhoneNav.jsx'
import MenuMain, { appRows, openSearch } from './ui/MenuMain.jsx'
import { openSettings } from './app/SettingsHost.jsx'
import { useChrome, useChromeKeys, useMainMenuOf, useSwitcherKey } from './app/chrome.js'
import { hostClient } from './host.js'
import { sampleMediaClient } from './app/sampleMedia.js'
import { setMediaClient } from './editor/engine.js'

/* THE EDITOR UNDER THE KOLBOX STYLE (plan-2026-11-19-kolbox-whats-left C3): what `<DesignEditor variant="kolbox">`
 * mounts. The kolbox screens on the hash, as apps/kolbox routes them (its App.jsx, the Editor, Labs and Morph branches):
 * the top rail's mode track writes #/editor, #/labs, #/morph. Around the screen the app-wide hosts apps/kolbox mounts:
 * the one prompt and confirm (ModalAskHost, before the screen, so the draft restore asked on its first effects finds
 * them), the toasts, the shell's doors (Settings, the S sheet, Media, Sign in) and the phone's bottom bar. The Randomiser
 * is #/randomiser (batch 6). Home and Library are the host's pages, never the engine's (batch 7): a host hands them in
 * `pages` and they draw here on their addresses; with '/home' given the bare address opens it (a phone: the Randomiser),
 * as apps/kolbox's App, else the Editor.
 * Every screen sits in the variant context at 'kolbox', which the Settings window reads to show its Style row. */
const read = () => window.location.hash.replace(/^#/, '')
const SCREENS = { '/editor': 'editor', '/labs': 'labs', '/morph': 'morph', '/randomiser': 'randomiser' }
const phone = () => window.matchMedia('(max-width: 767px)').matches
/* the host page an address names: its key, or a key it sits under ('/library/x' → '/library') */
const hostKey = (pages, path) => Object.keys(pages).find((k) => path === k || path.startsWith(`${k}/`))

/* the page keys, as apps/kolbox's App: Option + digit, matched on e.code (Option rewrites e.key on macOS), never while
   typing, never with Command or Control. The order is apps/kolbox's own (the hub's rail top to bottom: Home, Library, Editor, Labs,
   Randomiser, Morph, Settings), so both hosts answer the same keys; a key for a page the host did not hand in does nothing */
const KEY_ORDER = ['/home', '/library', '/editor', '/labs', '/randomiser', '/morph', '/settings']
/* an old `?view=<screen>` link opens that screen and the query loses `view` (the hub's LegacyViewRedirect); Labs' pick
   (`preset`, `cat`) belongs to Labs, Settings over it and the Randomiser: on any other screen it leaves the address */
function tidy(pages) {
  const url = new URL(window.location.href)
  let p = read()
  const view = url.searchParams.get('view')
  if (view) { url.searchParams.delete('view'); if (!p && (SCREENS[`/${view}`] || pages[`/${view}`])) p = `/${view}` }
  if (!['/labs', '/settings', '/randomiser'].includes(p)) { url.searchParams.delete('preset'); url.searchParams.delete('cat') }
  url.hash = p ? `#${p}` : ''
  if (url.href !== window.location.href) window.history.replaceState(window.history.state, '', url.pathname + url.search + url.hash)
}

/* RAILSWITCHER'S SPACES (plan-2026-11-20-kolbox-everything-left W1.1): Home first, File (the editor) second, decided
   for his review; Media is the Library, opened on its Media tab (W4.2). A space is a row here. Settings at the foot opens the shell's Settings. */
const SPACES = [
  { value: '/home', icon: 'home-01', label: 'Home' },
  { value: '/editor', icon: 'file', label: 'File' },
  { value: '/library', to: '/library/media', icon: 'image', label: 'Media' },
  { value: '/labs', icon: 'globe', label: 'Labs' },
  { value: '/morph', icon: 'swap', label: 'Morph' },
  { value: '/randomiser', icon: 'refresh', label: 'Randomiser' },
]
const FOOT = [{ icon: 'nav-settings', label: 'Settings', onClick: () => openSettings() }]
const MODE = { '/home': 'home', '/library': 'library', '/editor': 'editor', '/labs': 'labs', '/morph': 'morph', '/randomiser': 'randomiser' }
/* the screens that drew the top rail, whose ⌘K it sent (Home, Library and the Randomiser send their own) */
const SEARCH_KEY = new Set(['/editor', '/labs', '/morph'])

/* The switcher on every screen at the left, full height; the screen beside it. Its mark opens the screen's main menu
   (published by the screen, app/chrome.js useMainMenu), else the app's rows. View › Minimize left navigation bar takes
   it away; on the editor the undocked and hidden states take it away too (W2.1). Under 768 the phone's bottom bar is
   the way between spaces, so the switcher steps aside there. */
function Switcher({ shown, available }) {
  const chrome = useChrome()
  const narrow = useMediaQuery('(max-width: 767px)')
  const mark = useRef(null)
  const [open, setOpen] = useState(false)
  const base = hostKey(available, shown) ?? shown
  const editorAway = shown === '/editor' && chrome.ui !== 'docked'
  /* `\` and View › Minimize left navigation bar take it away on every screen (W1.3); the editor then draws the mark in
     its rail header */
  const minimized = !chrome.switcher
  useEffect(() => {
    if (!SEARCH_KEY.has(shown)) return undefined
    const onKey = (e) => {
      if (!(e.metaKey || e.ctrlKey) || e.key.toLowerCase() !== 'k' || e.target?.closest?.('input, textarea, select, [contenteditable]')) return
      e.preventDefault()
      openSearch()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [shown])
  const published = useMainMenuOf()
  if (narrow) return null
  const menu = published ?? { app: appRows({ mode: MODE[base] }) }
  return (
    <>
      {!minimized && !editorAway && (
        <RailSwitcher variant="kolbox" ref={mark} markOpen={open} onMark={() => setOpen((o) => !o)}
          items={SPACES.filter((r) => available[r.value])} foot={FOOT} value={base}
          onSelect={(r) => { window.location.hash = `#${r.to ?? r.value}` }} />
      )}
      <MenuMain anchor={mark} open={open && !minimized && !editorAway} onClose={() => setOpen(false)} menus={menu.menus} app={menu.app ?? appRows({ mode: MODE[base] })} />
    </>
  )
}

export default function KolboxView({ pages = {} }) {
  const [path, setPath] = useState(() => {
    tidy(pages)
    const p = read()
    if (SCREENS[p] || p === '/settings' || hostKey(pages, p) || !pages['/home']) return p
    /* the bare or an unknown address, as apps/kolbox's App: Home, a phone the Randomiser; the address says so */
    const to = phone() ? '/randomiser' : '/home'
    window.history.replaceState(window.history.state, '', `${window.location.pathname}${window.location.search}#${to}`)
    return to
  })
  useEffect(() => {
    const on = () => { tidy(pages); setPath(read()) }
    window.addEventListener('hashchange', on)
    window.addEventListener('popstate', on)
    return () => { window.removeEventListener('hashchange', on); window.removeEventListener('popstate', on) }
  }, [])
  useEffect(() => {
    const onKey = (e) => {
      const m = /^Digit([1-9])$/.exec(e.code)
      if (!m || !e.altKey || e.metaKey || e.ctrlKey || e.target?.closest?.('input, textarea, select, [contenteditable]')) return
      const to = KEY_ORDER[Number(m[1]) - 1]
      if (!to || !(SCREENS[to] || to === '/settings' || pages[to])) return
      e.preventDefault()
      window.location.hash = `#${to}`
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [pages])
  /* #/settings keeps the screen it was opened over, as apps/kolbox's App */
  const under = useRef(pages['/home'] ? '/home' : '/editor')
  if (path !== '/settings') under.current = SCREENS[path] || hostKey(pages, path) ? path : '/editor'
  const shown = under.current
  const screen = SCREENS[shown]
  const Page = pages[hostKey(pages, shown)]
  /* the media every screen reads, Home's and the Library's included: the host's, or the sample library (W4.2) */
  setMediaClient(hostClient() ?? sampleMediaClient)
  useChromeKeys(screen === 'editor')
  useSwitcherKey()
  const available = { ...pages, '/editor': 1, '/labs': 1, '/morph': 1, '/randomiser': 1 }
  return (
    <VariantContext.Provider value="kolbox">
      <ModalProvider variant="kolbox"><ModalAskHost /></ModalProvider>
      <div className="flex h-full" data-kolbox-frame>
        <Switcher shown={shown} available={available} />
        <div className="relative h-full min-w-0 flex-1" data-kolbox-screen>
          {Page ? <Page /> : screen === 'labs' ? <Labs /> : screen === 'morph' ? <Morph /> : screen === 'randomiser' ? <Randomiser />
            : <GateNarrow><Editor /></GateNarrow>}
        </div>
      </div>
      <ToastHost />
      <SettingsHost screen={shown} onLeave={() => window.location.replace(`#${under.current}`)} />
      <PhoneNav path={path} shown={shown} />
    </VariantContext.Provider>
  )
}
