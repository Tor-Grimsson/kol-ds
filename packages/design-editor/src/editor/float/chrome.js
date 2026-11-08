import { createContext, useContext } from 'react'

/* Which chrome the shared editor parts render under — `'float'` inside FloatEditorShell, null under EditorShell. The one
 * switch a shared part reads when the float chrome draws something its own way (the canvas selection, the Typography
 * card that takes the text surface out of the inspector). */
export const ChromeContext = createContext(null)
export const useChrome = () => useContext(ChromeContext)
