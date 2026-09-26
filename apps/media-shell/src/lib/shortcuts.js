/* ONE ARRAY for the overlay and the settings page (kol-shell's single-source rule). The media
 * surface's own gestures are the DS's; the rail's are AppShell `navKeys`. */
export const SHORTCUTS = [
  { section: 'Go to', items: [
    { id: 'home', label: 'Home', combo: '⌥1' },
    { id: 'browse', label: 'Browse', combo: '⌥2' },
    { id: 'settings', label: 'Settings', combo: ',' },
    { id: 'rail', label: 'Show / hide the rail', combo: '\\' },
  ] },
  { section: 'Browse', items: [
    { id: 'search', label: 'Search', combo: '/' },
    { id: 'palette', label: 'Search anywhere', combo: '⌘K' },
    { id: 'look', label: 'Quick Look', combo: 'Space' },
    { id: 'open', label: 'Open folder', combo: 'Enter' },
    { id: 'up', label: 'Enclosing folder', combo: '⌘↑' },
    { id: 'extend', label: 'Extend selection', combo: '⇧ + arrows' },
  ] },
  { section: 'Documents', items: [
    { id: 'save', label: 'Save the document', combo: '⌘S' },
    { id: 'close', label: 'Close the editor', combo: 'Esc' },
  ] },
  { section: 'This page', items: [
    { id: 'keys', label: 'These shortcuts', combo: '?' },
  ] },
]
