/* THE HUB, as apps/hub runs it: Home, Settings, the shortcuts sheet and the walkthrough around a placeholder tool. Its rail is fixed to the window and its keys listen on it, which is why it sits in a frame.
 * It is the app's own entry file, mounted in a frame — the preview and the app cannot drift. */
export { default } from '../../../apps/hub/src/App.jsx'

/* a whole tool: it runs in its own document, at this height */
export const frame = 720
