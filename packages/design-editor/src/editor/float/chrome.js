/* Which chrome the shared editor parts render under — `'float'` inside FloatEditorShell, null under EditorShell. The one
 * switch a shared part reads when the float chrome draws something its own way (the canvas selection, the Typography
 * card that takes the text surface out of the inspector). Since C3 (2026-11-19) it is the editor's variant context
 * (../variant.js), which also carries `'kolbox'`; these two names stay so float's calls keep working. */
export { VariantContext as ChromeContext, useVariant as useChrome } from '../variant.js'
