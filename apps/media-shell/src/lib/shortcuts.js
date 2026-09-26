import { TOOL_SHORTCUTS } from 'media-fixture/wiring'

/* ONE ARRAY for the S sheet and the settings page (kol-shell's single-source rule): the shell's own
 * keys, then THE TOOL'S KEYMAP — the same array apps/media's sheet shows (media-fixture), because it
 * is the same tool answering to the same keys. */
export const SHORTCUTS = [
  { section: 'Go to', items: [
    { id: 'browse', label: 'Browse', combo: '⌥1' },
    { id: 'library', label: 'Library', combo: '⌥3' },
    { id: 'notes', label: 'Notes', combo: '⌥4' },
    { id: 'decks', label: 'Decks', combo: '⌥5' },
    { id: 'settings', label: 'Settings', combo: ',' },
    { id: 'rail', label: 'Show / hide the rail', combo: '\\' },
  ] },
  ...TOOL_SHORTCUTS,
  { section: 'Documents', items: [
    { id: 'save', label: 'Save the document', combo: '⌘S' },
    { id: 'close', label: 'Close the editor', combo: 'Esc' },
  ] },
]
