import { SettingsShortcuts } from '@kolkrabbi/kol-shell'

export const stage = 'full'

const SECTIONS = [
  { section: 'Transport', items: [{ id: 'play', label: 'Play / pause', combo: 'Space' }, { id: 'loop', label: 'Loop', combo: 'L' }] },
  { section: 'View', items: [{ id: 'rail', label: 'Toggle rail', combo: '\\' }, { id: 'zoom', label: 'Zoom to fit', combo: '⇧ 1' }] },
  { section: 'Layers', items: [{ id: 'hide', label: 'Hide layer', combo: 'H' }, { id: 'dup', label: 'Duplicate', combo: '⌘ D' }] },
  { section: 'File', items: [{ id: 'save', label: 'Save', combo: '⌘ S' }, { id: 'export', label: 'Export', combo: '⌘ E' }] },
]

/* six columns, two sections per column, column-first */
export default function SettingsShortcutsDemo() {
  return <SettingsShortcuts sections={SECTIONS} />
}
