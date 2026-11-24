/* THE CLIPBOARD (plan-2026-11-19-kolbox-whats-left C4.4): layers and frames are kept in the app, one clip per session,
 * so a copy survives a page switch and pastes on any page; the text of what was copied goes to the system clipboard
 * through the browser's copy event (state.jsx), so another app gets words and a paste from another app makes a text
 * layer. state.jsx does the writes (copySelected, pasteLayers); this holds the clip and the reads. */
import { CANVAS_VIRTUAL_W } from '../shell/Canvas'
import { findLayerDeep } from './helpers'

let clip = null

const clone = (v) => { try { return structuredClone(v) } catch { return JSON.parse(JSON.stringify(v)) } }

/* the selection → what a copy keeps, in document order: each selected layer, and a selected frame with its layers */
export function copySet(layers, ids) {
  const want = new Set(ids)
  const frames = new Set(layers.filter((l) => l.type === 'frame' && want.has(l.id)).map((l) => l.id))
  const top = layers.filter((l) => want.has(l.id) || (l.frameId && frames.has(l.frameId)))
  /* a layer picked inside a group is copied as itself */
  const nested = ids.filter((id) => !layers.some((l) => l.id === id)).map((id) => findLayerDeep(layers, id)).filter(Boolean)
  return clone([...top, ...nested])
}

/* the words a copy puts on the system clipboard: the text layers' text, else the layers' names */
export function clipText(set) {
  const words = set.filter((l) => l.type === 'text' && l.text).map((l) => l.text)
  return (words.length ? words : set.map((l) => l.name || l.type)).join('\n')
}

export function setClip(layers) {
  clip = { layers, text: clipText(layers) }
  return clip
}
export const getClip = () => clip

/* a screen point → the page's units (the stage the layers live on: CanvasArea's clientToVirtual) */
export function clientToPage(x, y) {
  const node = document.querySelector('.kol-editor-canvas [data-canvas-frame] [data-tool]')
  if (!node) return null
  const r = node.getBoundingClientRect()
  const s = r.width / CANVAS_VIRTUAL_W || 1
  return { x: (x - r.left) / s, y: (y - r.top) / s }
}
