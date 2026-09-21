/* THE KEYMAP, once. `ShortcutsOverlay` takes this array and the bindings are read from the same
 * one, so a shortcut cannot be shown and not work — both kol-mirror and kol-monitor maintained the
 * list twice and both pairs drifted, which is why the overlay takes a prop at all.
 *
 * `combo` is a DISPLAY string; `key` is what the handler matches. They sit on the same row so the
 * two cannot part company. A row with no `key` is documentation of something bound elsewhere. */

export const SHORTCUTS = [
  {
    section: 'View',
    items: [
      { id: 'browse', label: 'Browse view', combo: 'B', key: 'b' },
      { id: 'files', label: 'Files view', combo: 'F', key: 'f' },
      { id: 'rows', label: 'Folder rows', combo: 'R', key: 'r' },
      { id: 'columns', label: 'Folder columns', combo: 'C', key: 'c' },
      { id: 'kinds', label: 'What is in this bucket', combo: 'K', key: 'k' },
      { id: 'shortcuts', label: 'This sheet', combo: 'S', key: 's' },
    ],
  },
  {
    section: 'Files',
    items: [
      { id: 'context', label: 'Open the context menu', combo: 'Right-click' },
      { id: 'new', label: 'New folder', combo: 'N', key: 'n' },
      { id: 'rename', label: 'Rename', combo: 'Right-click → Rename' },
      { id: 'move', label: 'Move to another folder', combo: 'Right-click → Move to…, or drag onto a folder' },
      { id: 'delete', label: 'Delete (a folder takes its contents)', combo: 'Right-click → Delete' },
      { id: 'upload', label: 'Open the drop zone', combo: 'U', key: 'u' },
    ],
  },
  {
    section: 'Fixture',
    items: [
      { id: 'reset', label: 'Clear changes — back to the seed tree', combo: '⇧R', key: 'R' },
      { id: 'nav', label: 'Walk folders', combo: 'Back / Forward' },
    ],
  },
]

/** Every row that carries a real binding, flattened — what the handler matches against. */
export const BINDINGS = SHORTCUTS.flatMap((s) => s.items).filter((i) => i.key)
