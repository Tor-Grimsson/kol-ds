import { useSyncExternalStore } from 'react'
import { toggleTimelinePinned } from '../engine.js'

/* The editor's layout in kolbox (round 3, 4.1): which rails are open and what is shown over them. The left rail open or
   collapsed (Window › Show / hide rail, `\`, the rail header's button), the transport toolbar (Window › Left rail ›
   Transport), the open window (Windows.jsx's ids) and the timeline (the engine's own pin, `timelinePinned`, read
   through `pinned`). Window › Workspace saves, restores and resets that set by name.
   Its own store, not the engine's (state/workspace.js): the engine's records the real editor's pane arrangement
   (tabs in panes, collapsed panes, heights), which kolbox does not draw, and normalises anything else away. Same
   storage habit as the engine's: the saved set under one key, kept across reloads. */
const SAVED_KEY = 'kol.kolbox.workspaces'
const DEFAULT = { leftCollapsed: false, transport: false, window: null }

const read = () => { try { return JSON.parse(localStorage.getItem(SAVED_KEY)) ?? {} } catch { return {} } }
let state = { ...DEFAULT }
let saved = read()
let snapshot = { ...state, saved }
const subs = new Set()
const emit = () => { snapshot = { ...state, saved }; subs.forEach((f) => f()) }

export const useLayout = () => useSyncExternalStore((f) => { subs.add(f); return () => subs.delete(f) }, () => snapshot)

/* a patch or a function of the current state */
export function setLayout(next) {
  const patch = typeof next === 'function' ? next(state) : next
  if (Object.keys(patch).every((k) => state[k] === patch[k])) return
  state = { ...state, ...patch }
  emit()
}
export const toggleLeftRail = () => setLayout((s) => ({ leftCollapsed: !s.leftCollapsed }))

/* the timeline is the engine's pin; set it only when it differs */
const setPinned = (on, pinned) => { if (!!on !== !!pinned) toggleTimelinePinned() }

const record = (pinned) => ({ leftCollapsed: state.leftCollapsed, transport: state.transport, window: state.window, timeline: !!pinned })
const same = (a, b) => a && b && ['leftCollapsed', 'transport', 'window', 'timeline'].every((k) => (a[k] ?? null) === (b[k] ?? null))

export function saveWorkspace(name, pinned) {
  saved = { ...saved, [name]: record(pinned) }
  try { localStorage.setItem(SAVED_KEY, JSON.stringify(saved)) } catch { /* quota or private mode */ }
  emit()
}
export function applyWorkspace(name, pinned) {
  const w = saved[name]
  if (!w) return
  setLayout({ leftCollapsed: !!w.leftCollapsed, transport: !!w.transport, window: w.window ?? null })
  setPinned(w.timeline, pinned)
}
export function resetWorkspace(pinned) {
  setLayout({ ...DEFAULT })
  setPinned(false, pinned)
}
/* the saved name whose set is the current one (Window › Workspace's check) */
export const currentWorkspaceName = (layout, pinned) => Object.keys(layout.saved).find((n) => same(layout.saved[n], { ...layout, timeline: !!pinned })) ?? null
