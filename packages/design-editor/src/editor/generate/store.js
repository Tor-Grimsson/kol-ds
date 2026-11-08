/**
 * The generator tools' ONE state (plan-2026-11-05-float-editor W7.6) — per tool (generate · repeat · type) the engine's flat
 * params, the layer they were applied to, and Live. The Rail form and the expanded settings dialog both read and write it,
 * so ↗ and back never lose an edit. Module-level: the tools outlive whichever form is open.
 */
import { useSyncExternalStore } from 'react'

const states = {}
const subs = new Set()
const emit = () => subs.forEach((f) => f())

export function getTool(id) { return states[id] }
export function setTool(id, next) {
  states[id] = { live: true, layerId: null, ...states[id], ...(typeof next === 'function' ? next(states[id]) : next) }
  emit()
}
/* the tool's state, seeded once with `init()` (the engine defaults) */
export function useTool(id, init) {
  if (!states[id]?.params) states[id] = { live: true, layerId: null, ...states[id], params: init() }
  return useSyncExternalStore((f) => { subs.add(f); return () => subs.delete(f) }, () => states[id])
}

/* open a tool's form — the Rail (the float editor's Tools menu) or the dialog (the Rail's ↗); `kol:open-generator-window`
 * (`detail.window`, `detail.form`) is the same from anywhere */
export const openTool = (tool, form = 'rail') => setUi(form === 'dialog' ? { dialog: tool } : { rail: tool })

/* open a tool on a layer it drew (a generate or repeat layer): its params become the tool's, Apply updates it */
export function editLayer(tool, layer, form = 'rail') {
  const { id, type, children, ...params } = layer
  setTool(tool, { params, layerId: id })
  openTool(tool, form)
}

/* the open forms: one tool's Rail and one tool's dialog at a time */
let ui = { rail: null, dialog: null }
const uiSubs = new Set()
export const getUi = () => ui
export function setUi(next) { ui = { ...ui, ...next }; uiSubs.forEach((f) => f()) }
export const useToolUi = () => useSyncExternalStore((f) => { uiSubs.add(f); return () => uiSubs.delete(f) }, () => ui)
