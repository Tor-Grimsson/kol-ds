import { createContext, useContext } from 'react'

/* THE EDITOR'S STYLE, one `variant` (plan-2026-11-19-kolbox-whats-left C3): which look the shared editor parts render
 * under. `'float'` inside FloatEditorShell and FloatLabs, `'kolbox'` under the kolbox style (DesignEditor
 * variant="kolbox", or the Style row in Settings), null under the default EditorShell. Was float's ChromeContext
 * (float/chrome.js re-exports it under that name, so float's calls read the same context). The theme is its own
 * choice (`data-theme-variant` on <html>); the style never writes it. */
export const VariantContext = createContext(null)
export const useVariant = () => useContext(VariantContext)

/* the Style row's choices; the app setting `style` holds the value ('default' when unset) */
export const STYLE_OPTIONS = [{ value: 'default', label: 'Default' }, { value: 'kolbox', label: 'Kolbox' }]
