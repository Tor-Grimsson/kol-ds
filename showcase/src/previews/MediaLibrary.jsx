/* THE MEDIA TOOL, as apps/media runs it: `MediaLibrary variant="explorer"` over the fixture's fake bucket — browse, preview, upload, trash.
 * It is the app's own entry file, mounted in a frame — the preview and the app cannot drift. */
export { default } from '../../../apps/media/src/App.jsx'

/* a whole tool: it runs in its own document, at this height */
export const frame = 760
