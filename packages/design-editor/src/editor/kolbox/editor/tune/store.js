import { useSyncExternalStore } from 'react'

/* THE TUNE MODE'S STATE (plan-2026-11-19 C6.2): which layer the mode is on and what is being tuned. The canvas stage
   and the right rail both read it, so it lives here and not in one of them. `null` when the editor shows the document.
   `peek` (R7.2, H) is how the stage is looked at, not what is made, so it never marks the visit changed. */
let state = null
const subs = new Set()
const emit = () => subs.forEach((f) => f())

export const getTune = () => state
export const setTune = (patch) => { state = state && { ...state, ...(typeof patch === 'function' ? patch(state) : patch), dirty: true }; emit() }
export const startTune = (s) => { state = s; emit() }
export const endTune = () => { state = null; emit() }
export const togglePeek = () => { if (state) { state = { ...state, peek: !state.peek }; emit() } }
export const useTune = () => useSyncExternalStore((f) => { subs.add(f); return () => subs.delete(f) }, getTune)
