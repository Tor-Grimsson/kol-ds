import { createContext, useContext, useState, useCallback } from 'react'

/**
 * Sidebar grouping mode — the persisted `Atomic ⇄ Function` axis toggle
 * (taxonomy audit D1). Both axes ride on every registry entry already, so
 * this only picks which one draws the section headers. Default: function
 * (how people look for a component). Persisted to localStorage.
 */
const KEY = 'kol-showcase-grouping'
/* atomic is the default (user ruling 2026-07-30) — function is the opt-in. */
const DEFAULT = 'atomic'
const GroupingContext = createContext(null)

export function GroupingProvider({ children }) {
  const [mode, setModeState] = useState(() => {
    try { return localStorage.getItem(KEY) === 'function' ? 'function' : DEFAULT } catch { return DEFAULT }
  })
  const setMode = useCallback((m) => {
    setModeState(m)
    try { localStorage.setItem(KEY, m) } catch { /* private mode / no storage */ }
  }, [])
  return <GroupingContext.Provider value={{ mode, setMode }}>{children}</GroupingContext.Provider>
}

export function useGrouping() {
  return useContext(GroupingContext) || { mode: DEFAULT, setMode: () => {} }
}
