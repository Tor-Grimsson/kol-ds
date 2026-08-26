import { useCallback, useEffect, useState } from 'react'

/**
 * usePlaceholders — the ONE gate for placeholder / empty-state prose
 * (GatedEmptyState, filed from kol-fxr 2026-08-15).
 *
 * The ticket's ruling, and the reason this is one concept rather than three:
 * the filing repo had invented "helper text" vs "empty state" vs "hint" as
 * separate ideas, and that is precisely what let the prose creep back — each
 * kind had its own home and none had an off switch. There is one kind here,
 * it is called a placeholder, and it is OFF until asked for.
 *
 * WHAT THE DS OWNS: the preference, its persistence, and the `.kol-placeholder`
 * suppression rule in kol-utilities.css.
 * WHAT THE CONSUMER OWNS: the keybind. A design system that grabs a global
 * key collides with every app that already used it — kol-fxr's own `H` is
 * already `toggle-visibility` in its editor keymap, which is exactly the
 * collision the DS must not ship. Call `toggle` from whatever key you like.
 *
 * The hiding is CSS, not a render branch, so it covers a consumer's OWN prose
 * the moment they put `.kol-placeholder` on it — not just <EmptyState gated>.
 * One rule, no re-render, nothing to thread through a tree.
 */

const STORAGE_KEY = 'kol-placeholders'
const ATTR = 'data-kol-placeholders'

const root = () => document.documentElement

/* Module-level subscribers: a settings checkbox and a keybind are usually two
 * different components calling this hook, and per-component useState would let
 * them disagree about a preference there is only one of. The CSS never
 * desyncs (it reads the attribute), but the reported `shown` would. */
const listeners = new Set()

function read() {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'on'
  } catch {
    return false // storage blocked → stay off, which is the default anyway
  }
}

function write(on) {
  if (on) root().setAttribute(ATTR, '')
  else root().removeAttribute(ATTR)
  try {
    localStorage.setItem(STORAGE_KEY, on ? 'on' : 'off')
  } catch { /* storage blocked — the attribute still holds for this session */ }
  listeners.forEach((fn) => fn(on))
}

export default function usePlaceholders() {
  const [shown, setShown] = useState(false)

  /* Boot from storage and stamp the attribute. Default OFF is the ruling, so
   * an absent key and a blocked localStorage both land on the same answer. */
  useEffect(() => {
    const on = read()
    if (on) root().setAttribute(ATTR, '')
    setShown(on)
    listeners.add(setShown)
    return () => listeners.delete(setShown)
  }, [])

  /* Read-then-flip off storage rather than state: a keybind handler bound once
   * would otherwise close over the first render's value and toggle from stale. */
  const toggle = useCallback(() => write(!read()), [])
  const set = useCallback((on) => write(!!on), [])

  return { shown, toggle, setShown: set }
}
