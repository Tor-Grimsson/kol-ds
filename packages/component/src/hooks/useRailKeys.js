import { useEffect, useRef } from 'react'

/**
 * useRailKeys — one keyboard rule for every nav rail (RailShortcutsAllFrames, kol-website 2026-11-04 — user: *"shortcut
 * to collapse expand hide? the studio nav had '\'? … that should also go for site and app rail"*). AppShell, SiteLayout
 * and FloatLayout each call it with their own state setters; the hook owns only the keys.
 *
 *   `\`   expanded ↔ collapsed  → `onCollapse()`
 *   `⇧\`  hide ↔ show          → `onHide()` (the frame restores the state the rail had)
 *
 * Ignored while typing (input, textarea, select, contenteditable), on key repeat, and with ⌘ / ⌃ / ⌥ held. Matched on
 * `e.key` OR the physical key (`e.code`), because ⇧\ yields `|` as `e.key` on a US layout.
 *
 * @param {false|{ collapse?: string|false, hide?: string|false }} [keys]  `false` turns both off; an object rebinds
 *   either (merged over RAIL_KEYS; a falsy entry turns that one off). A key is `'\\'` or `'shift+\\'`. When both name the
 *   same key, `hide` wins — AppShell's `railToggleKey` alias relies on it.
 * @param {{ onCollapse?: Function, onHide?: Function }} handlers
 */
export const RAIL_KEYS = { collapse: '\\', hide: 'shift+\\' }

const CODE_FOR_KEY = { '\\': 'Backslash', '/': 'Slash', ',': 'Comma', '.': 'Period', ';': 'Semicolon', '[': 'BracketLeft', ']': 'BracketRight', '`': 'Backquote' }

const parse = (spec) => {
  const shift = /^shift\+/i.test(spec)
  return { shift, key: shift ? spec.slice(6) : spec }
}

const matches = (e, spec) => {
  if (!spec) return false
  const { shift, key } = parse(spec)
  return e.shiftKey === shift && (e.key === key || (CODE_FOR_KEY[key] != null && e.code === CODE_FOR_KEY[key]))
}

const resolve = (keys) => (keys === false ? null : { ...RAIL_KEYS, ...(keys ?? {}) })

/* the two keys as a shortcuts section (`[{ section, items }]`), for a frame that draws a keymap — empty when off */
export const railShortcuts = (keys) => {
  const k = resolve(keys)
  if (!k) return []
  const label = (spec) => (parse(spec).shift ? `⇧ ${parse(spec).key}` : spec)
  const items = [
    k.collapse && { id: 'rail-collapse', label: 'Expand / collapse the rail', combo: label(k.collapse) },
    k.hide && { id: 'rail-hide', label: 'Hide / show the rail', combo: label(k.hide) },
  ].filter(Boolean)
  return items.length ? [{ section: 'Rail', items }] : []
}

export default function useRailKeys(keys, handlers) {
  const live = useRef(null)
  live.current = { keys: resolve(keys), ...handlers }
  useEffect(() => {
    const onKey = (e) => {
      const { keys: k, onCollapse, onHide } = live.current
      if (!k || e.repeat || e.metaKey || e.ctrlKey || e.altKey) return
      const t = e.target
      if (t?.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t?.tagName)) return
      const fn = matches(e, k.hide) ? onHide : matches(e, k.collapse) ? onCollapse : null
      if (!fn) return
      e.preventDefault()
      fn()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])
}
