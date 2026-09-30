import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'

/**
 * Frontmatter — shown or hidden, per KIND of page (2026-09-30, the names audit: *"frontmatter can
 * be hidden by default, but shown with shortcut … top level home landing pages default hide it,
 * making them more ceremonial"*). A home starts hidden, a content page starts shown; `F` flips the
 * kind you are on, and the choice is remembered per kind.
 */
const KEY = 'kol-showcase-frontmatter'
const DEFAULTS = { home: false, page: true }
const Ctx = createContext(null)

const read = () => {
  try { return { ...DEFAULTS, ...JSON.parse(localStorage.getItem(KEY) || '{}') } } catch { return DEFAULTS }
}

export function FrontmatterProvider({ children }) {
  const [visible, setVisible] = useState(read)
  const current = useRef('page')
  const toggle = useCallback(() => {
    setVisible((v) => {
      const next = { ...v, [current.current]: !v[current.current] }
      try { localStorage.setItem(KEY, JSON.stringify(next)) } catch { /* private mode */ }
      return next
    })
  }, [])
  return <Ctx.Provider value={{ visible, current, toggle }}>{children}</Ctx.Provider>
}

/** `useFrontmatter('home' | 'page')` → whether this page shows its frontmatter. */
export function useFrontmatter(kind = 'page') {
  const ctx = useContext(Ctx)
  useEffect(() => { if (ctx) ctx.current.current = kind }, [ctx, kind])
  return ctx ? ctx.visible[kind] : DEFAULTS[kind]
}

export const useFrontmatterToggle = () => useContext(Ctx)?.toggle ?? (() => {})
