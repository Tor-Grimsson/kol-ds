/* /demo-4's per-viewer state (plan W1.2 · W1.3 · W3 · W10 · W11): reading size and family, theme, palette, accent, and
   where each document was left. Kept in this browser (localStorage); every read and write is wrapped — a private
   window or blocked storage leaves the defaults and no error. */
import { createContext, useEffect, useSyncExternalStore } from 'react'

const KEY = 'folio-demo-4'
export const SIZES = [14, 16, 18, 20, 22]
export const ACCENTS = ['green', 'teal', 'blue', 'orange', 'red', 'purple']
/* his starting point (2026-11-04): dark, the KOL palette on cream and #19191D, teal */
const DEFAULTS = { size: 16, family: 'auto', theme: 'dark', palette: 'kol', accent: 'teal', canvas: 'match', editorTree: true, kolLight: '#faf9f5', kolDark: '#19191d', reading: {} }
/* the KOL neutral ramp (kol-theme), the off-whites and the darks he picks from (W11.2) */
/* plus his (2026-11-04): the cream #FAF9F5 with its own highlight #F0F0E9, and a bluer dark #222429 — not on the KOL ramp yet.
   A third entry is that off-white's highlight surface; without one the surface is mixed from paper and ink. */
export const KOL_LIGHTS = [['cream', '#faf9f5', '#f0f0e9'], ['neutral-980', '#fafafa'], ['neutral-973', '#f8f8f8'], ['neutral-949', '#f2f2f2'], ['neutral-933', '#eeeeee']]
export const KOL_DARKS = [['blue-dark', '#222429'], ['neutral-076', '#121215'], ['neutral-106', '#19191d'], ['neutral-137', '#202026'], ['neutral-129', '#212121'], ['neutral-259', '#424242']]

const load = () => {
  try { return { ...DEFAULTS, ...JSON.parse(localStorage.getItem(KEY) ?? '{}') } } catch { return { ...DEFAULTS } }
}
let state = load()
const listeners = new Set()

export function setSettings(patch) {
  state = { ...state, ...(typeof patch === 'function' ? patch(state) : patch) }
  try { localStorage.setItem(KEY, JSON.stringify(state)) } catch { /* storage blocked — the session keeps it */ }
  listeners.forEach((l) => l())
}

const subscribe = (l) => { listeners.add(l); return () => listeners.delete(l) }
/* another window of the library (W18's split frame) wrote — take its state, so neither writes back a stale copy */
if (typeof window !== 'undefined') addEventListener('storage', (e) => { if (e.key === KEY) { state = load(); listeners.forEach((l) => l()) } })
export const useSettings = () => useSyncExternalStore(subscribe, () => state, () => DEFAULTS)
/* the editor's canvas (View → Canvas): light or dark whatever the theme; null outside the editor means the theme */
export const CanvasTheme = createContext(null)

/* W10 — where a document was left: { pct, at } by its key */
export function saveReading(key, pct) {
  setSettings((s) => ({ reading: { ...s.reading, [key]: { pct: Math.round(pct * 1000) / 10, at: Date.now() } } }))
}

/* "2 hours ago", "yesterday", "3 Nov" */
export function ago(t) {
  const m = Math.round((Date.now() - t) / 60000)
  if (m < 1) return 'just now'
  if (m < 60) return `${m} min ago`
  const h = Math.round(m / 60)
  if (h < 24) return `${h} hour${h > 1 ? 's' : ''} ago`
  const d = Math.round(h / 24)
  if (d === 1) return 'yesterday'
  if (d < 7) return `${d} days ago`
  return new Date(t).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

/* a one-key shortcut, like every KOL app (S the shortcut list, comma the settings): the bare key outside a field, Alt+key
   while writing */
export function useSKey(fn, codes = ['KeyS']) {
  useEffect(() => {
    const onKey = (e) => {
      /* the key's character or its physical position — a layout (Icelandic) can move one or the other */
      const char = { KeyS: 's', Comma: ',' }
      const hit = codes.includes(e.code) || codes.some((c) => char[c] === e.key?.toLowerCase())
      if (!hit || e.metaKey || e.ctrlKey) return
      /* plain S outside a field; Alt+S anywhere, even while writing (user, 2026-11-04) */
      const t = e.target
      if (!e.altKey && t?.closest?.('input, textarea, select, [contenteditable="true"]')) return
      e.preventDefault(); fn()
    }
    addEventListener('keydown', onKey)
    return () => removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}

