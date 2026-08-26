import { createContext, useContext } from 'react'

// Nav-hidden context — own file so AppShell exports only components
// (react-refresh constraint, learned in both source repos). Pages with a full
// sidebar of their own (monitor's rack, mirror's studio) set this to replace
// the global rail with their own nav header row. Load-bearing seam — keep it
// a context.
export const NavHiddenContext = createContext(null)
export const useNavHidden = () => useContext(NavHiddenContext)
