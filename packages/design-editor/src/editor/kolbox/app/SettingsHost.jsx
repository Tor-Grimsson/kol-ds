import { useEffect, useRef, useState } from 'react'
import { isTyping, matchCombo, SETTINGS_COMBO } from '../editor/engine.js'
import WindowSettings from '../editor/windows/WindowSettings.jsx'
import WindowShortcuts from '../editor/windows/WindowShortcuts.jsx'
import WindowMediaPicker from '../editor/windows/WindowMediaPicker.jsx'
import { askConfirm } from '../ui/ask.js'
import WindowSignIn from './WindowSignIn.jsx'
import { connected, sessionUser, signInHost, signOut } from '../files/account.js'

/* The shell's own doors, mounted once for the app (round 4, W12), as the real hub's AppHub holds them for every page:
   Settings, the S sheet, Media and Sign in. Anyone opens them with a window event, so a menu row, a search row and a key
   all reach the same window:
     kolbox:settings  Settings (detail: { tab }, 'settings' unless named);
     kolbox:shortcuts the S sheet;
     kolbox:media     the media picker over the screen's media client (the real Media row's MediaLibrary picker: Use
                      closes it, the hub passes no onSelect);
     kolbox:sign-in   the account (files/account.js, plan-2026-11-19 C8): signed out, the Sign in window, which says the
                      account is not connected in this build (the dummy password prompt is gone: no fake login); with a
                      session, "Sign out? Your files stay on this device." (Sign out).
   THE CHROMES ANSWER FIRST, the real hub's rule: Settings and the sheet are first asked of the screen with the engine's
   own cancelable events (kol:open-settings, kol:show-shortcuts); a screen that mounts its windows (the editor, Labs,
   Morph: editor/Windows.jsx) answers and calls preventDefault, and only an unanswered ask opens this host's window. The
   keys: ⌘, from every screen (14.2), S only on a screen with no chrome
   (Home, Library, Dev), as the hub's S key is off on the chrome routes: there the chrome's own S opens its sheet.
   screen: the route shown ('/home', '/editor' …), its keymap's word picked here. onLeave: called when the window opened
   by the #/settings address closes (App puts the screen's address back). */
const VIEW = { '/editor': 'editor', '/labs': 'labs', '/morph': 'labs' }
const CHROMES = new Set(Object.keys(VIEW))
export const viewOf = (screen) => VIEW[screen] ?? 'home'

const send = (name, detail) => () => window.dispatchEvent(new CustomEvent(name, { detail }))
export const openSettings = (tab) => send('kolbox:settings', { tab })()
export const openShortcuts = send('kolbox:shortcuts')
export const openMedia = send('kolbox:media')
export const signIn = send('kolbox:sign-in')

/* signed in is the host's session (files/account.js, the editor's `account` prop) */
export const isSignedIn = () => !!sessionUser()

export default function SettingsHost({ screen, onLeave }) {
  const [open, setOpen] = useState(null)
  const [, setTick] = useState(0)
  const scr = useRef(screen); scr.current = screen
  const view = viewOf(screen)

  useEffect(() => {
    /* ask the screen first; true when nothing there answered */
    const unanswered = (event) => window.dispatchEvent(new CustomEvent(event, { cancelable: true }))
    const settings = (e) => { if (unanswered('kol:open-settings')) setOpen((o) => (o?.id === 'settings' ? null : { id: 'settings', tab: e?.detail?.tab ?? 'settings' })) }
    const sheet = () => { if (unanswered('kol:show-shortcuts')) setOpen((o) => (o?.id === 'shortcuts' ? null : { id: 'shortcuts' })) }
    const media = () => setOpen({ id: 'media' })
    const account = async () => {
      /* signed out: the host's sign-in when it passed an account, else the window that says none is connected */
      if (!sessionUser()) { if (connected()) signInHost(); else setOpen({ id: 'sign-in' }); return }
      if (await askConfirm({ title: 'Sign out? Your files stay on this device.', action: 'Sign out' })) signOut()
      setTick((n) => n + 1)
      /* a screen that shows the account (Home's rail row) re-reads isSignedIn() on this */
      window.dispatchEvent(new CustomEvent('kolbox:account'))
    }
    /* the keys, after the screen's own listeners have had them (a handled key is defaultPrevented by then) */
    const onKey = (e) => {
      /* ⌘, (Ctrl+, off macOS; 14.2) on every screen, in a field too (it types nothing there), never the browser's own */
      if (matchCombo(e, SETTINGS_COMBO)) { e.preventDefault(); if (!e.repeat) settings(); return }
      if (isTyping(e) || e.metaKey || e.ctrlKey || e.altKey || e.repeat) return
      if (!(e.key === 's' && !e.shiftKey && !CHROMES.has(scr.current))) return
      setTimeout(() => { if (!e.defaultPrevented) sheet() })
    }
    const on = { 'kolbox:settings': settings, 'kolbox:shortcuts': sheet, 'kolbox:media': media, 'kolbox:sign-in': account }
    Object.entries(on).forEach(([k, f]) => window.addEventListener(k, f))
    window.addEventListener('keydown', onKey)
    return () => {
      Object.entries(on).forEach(([k, f]) => window.removeEventListener(k, f))
      window.removeEventListener('keydown', onKey)
    }
  }, [])

  /* #/settings, its own address: this host's window over the screen beneath it (App keeps that screen mounted, Home on a
     direct load); closing it puts the screen's address back */
  const atAddress = () => window.location.hash === '#/settings'
  useEffect(() => {
    const on = () => { if (atAddress()) setOpen({ id: 'settings', tab: 'settings' }) }
    on()
    window.addEventListener('hashchange', on)
    return () => window.removeEventListener('hashchange', on)
  }, [])
  const close = () => { setOpen(null); if (atAddress()) onLeave?.() }

  if (open?.id === 'settings') return <WindowSettings onClose={close} view={view} tab={open.tab} />
  if (open?.id === 'shortcuts') return <WindowShortcuts onClose={close} view={view} />
  if (open?.id === 'sign-in') return <WindowSignIn onClose={close} />
  if (open?.id === 'media') return <WindowMediaPicker open onClose={close} onSelect={close} />
  return null
}
