import { useEffect, useSyncExternalStore } from 'react'

/* THE SHELL'S STATE (plan-2026-11-20-kolbox-everything-left W1.3, W2): what of the chrome is on screen, as Figma's View
   menu holds it, remembered as the rulers are (one key in this profile's storage, kept across reloads).
     switcher  RailSwitcher shown; View › Minimize left navigation bar.
     ui        'docked' (the rails at the edges), 'undocked' (Minimize UI: the rails as two pills over the canvas) or
               'hidden' (Show/Hide UI: the canvas alone). `back` is the state Show/Hide UI returns to.
     floats    the parts shown under the pills while undocked (2.2): { pages, layers, 'rs:<section>' }, each true when on. Docking
               shows everything; undocking again brings back the same choice.
   The screen's main menu (MenuMain's `menus` and `app`) is published by the screen (useMainMenu) so the switcher's mark
   opens it; not stored. */
const KEY = 'kolbox.chrome'
const DEFAULT = { switcher: true, ui: 'docked', back: 'docked', floats: { pages: false, layers: true } }
const read = () => { try { return { ...DEFAULT, ...JSON.parse(localStorage.getItem(KEY)) } } catch { return { ...DEFAULT } } }

let state = read()
let snap = { ...state }
const subs = new Set()
const emit = () => { snap = { ...state }; subs.forEach((f) => f()) }
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(state)) } catch { /* storage blocked */ } }
const set = (patch) => { state = { ...state, ...patch }; save(); emit() }

export const useChrome = () => useSyncExternalStore((f) => { subs.add(f); return () => subs.delete(f) }, () => snap)

export const toggleSwitcher = () => set({ switcher: !state.switcher })
/* Minimize UI: docked and undocked swap; from hidden it undocks */
export const toggleMinimize = () => set({ ui: state.ui === 'undocked' ? 'docked' : 'undocked' })
/* Show/Hide UI: hidden returns to the state it was pressed in */
export const toggleHidden = () => set(state.ui === 'hidden' ? { ui: state.back } : { ui: 'hidden', back: state.ui })
export const toggleFloat = (k) => set({ floats: { ...state.floats, [k]: !state.floats[k] } })

/* a screen hands the switcher its main menu while it is mounted: its own little store, read by the switcher alone, so a
   screen that reads the shell's state does not re-render on its own menu */
let menu = null
const menuSubs = new Set()
const menuEmit = () => menuSubs.forEach((f) => f())
export const useMainMenuOf = () => useSyncExternalStore((f) => { menuSubs.add(f); return () => menuSubs.delete(f) }, () => menu)
export function useMainMenu(m) {
  useEffect(() => { menu = m; menuEmit() })
  useEffect(() => () => { menu = null; menuEmit() }, [])
}

/* the keys (Figma's on his keyboard, [35]): § Show/Hide UI, ⇧⌘§ Minimize UI. The § key is matched on its glyph and on
   its place (`IntlBackslash`, where a Mac ISO board reports it), since Shift rewrites the glyph. Never while typing. */
const isSection = (e) => e.key === '§' || e.key === '±' || e.code === 'IntlBackslash'
const typing = (t) => t?.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(t?.tagName)
/* `\` (W1.3, his key from other tools): RailSwitcher hidden and shown, on every kolbox screen; ⇧\ stays the screen's own
   rail key (Home's rail, the editor's left rail, Labs' rails). Matched on the key's place, never while typing. */
export function useSwitcherKey() {
  useEffect(() => {
    const onKey = (e) => {
      if (e.code !== 'Backslash' || e.shiftKey || e.metaKey || e.ctrlKey || e.altKey || typing(e.target)) return
      e.preventDefault()
      toggleSwitcher()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])
}

export function useChromeKeys(on = true) {
  useEffect(() => {
    if (!on) return undefined
    const onKey = (e) => {
      if (!isSection(e) || typing(e.target) || e.altKey) return
      const mod = e.metaKey || e.ctrlKey
      if (mod && e.shiftKey) { e.preventDefault(); toggleMinimize() }
      else if (!mod && !e.shiftKey) { e.preventDefault(); toggleHidden() }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [on])
}
