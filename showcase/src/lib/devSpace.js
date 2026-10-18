import { useCallback, useState } from 'react'

/* THE DEVELOPMENT SPACE IS A WORKBENCH (2026-10-17 — user: "there really isnt a need for it on production …
 * we could just hide/show development via shortcut? d? also we might use </> icon"). On a dev server it is
 * always there; on the site it stays out of the tabs and ⌘K until `D` shows it, remembered for this tab. */
const KEY = 'kol-dev-space'
const stored = () => { try { return sessionStorage.getItem(KEY) === '1' } catch { return false } }

export const devSpaceShown = () => import.meta.env.DEV || stored()

export function useDevSpace() {
  const [shown, setShown] = useState(devSpaceShown)
  const toggle = useCallback(() => {
    if (import.meta.env.DEV) return
    setShown((v) => {
      try { sessionStorage.setItem(KEY, v ? '0' : '1') } catch { /* private mode: this page view only */ }
      return !v
    })
  }, [])
  return [shown, toggle]
}
