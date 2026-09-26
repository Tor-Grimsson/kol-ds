/* THE MEDIA TOOL'S KEYMAP, once — moved here from apps/media (2026-09-26) so apps/media-shell's sheet
 * lists the same keys the same tool answers to. `ShortcutsOverlay` takes this array and the bindings are read from the same
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
      { id: 'grid', label: 'File grid', combo: 'G', key: 'g' },
      { id: 'search', label: 'Search this bucket', combo: '/ or ⌘K' },
      { id: 'filters', label: 'Filter bar', combo: 'Funnel in the crumb row' },
      { id: 'kinds', label: 'File formats', combo: 'K', key: 'k' },
      { id: 'shortcuts', label: 'This sheet', combo: 'S', key: 's' },
    ],
  },
  {
    /* THE HOW-TO (user 2026-09-23: *"every shortcut and these kind of function need to constantly be
     * added to s"*). Documentation rows — the keys are bound in the DS pages, not here. */
    section: 'Navigate',
    items: [
      { id: 'arrows', label: 'Move the selection', combo: '↑ ↓ ← → — in every view' },
      { id: 'expand', label: 'Rows: expand / collapse a folder', combo: '→ / ←' },
      { id: 'parent', label: 'Enclosing folder', combo: '⌘↑ or ⇧Enter' },
      { id: 'open', label: 'Open — a folder, or Quick Look on a file', combo: '⌘↓ or double-click · Enter opens a folder' },
      { id: 'crumb', label: 'Copy the path', combo: 'Click the current crumb' },
    ],
  },
  {
    section: 'Select',
    items: [
      { id: 'click', label: 'Select one', combo: 'Click' },
      { id: 'add', label: 'Add to / remove from the selection', combo: '⌘-click' },
      { id: 'range', label: 'Select a run', combo: '⇧-click' },
      { id: 'extend', label: 'Extend the selection', combo: '⇧ + arrows — ↑↓ in rows and columns, all four in the grid' },
      { id: 'band', label: 'Drag-select', combo: 'Drag from empty space (rows: beside the name)' },
      { id: 'clear', label: 'Clear the selection', combo: 'Click empty space' },
      { id: 'quicklook', label: 'Quick Look', combo: 'Space — pages the selection when there is one' },
      { id: 'ql-step', label: 'Quick Look: next / previous', combo: '← → or ‹ › in the window' },
      { id: 'ql-size', label: 'Quick Look: resize the window', combo: 'Drag its bottom-right corner' },
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
      { id: 'upload', label: 'Upload into a folder', combo: 'Right-click → Upload…, or drag files onto a folder' },
      { id: 'copy', label: 'Copy URL · Download', combo: 'Right-click, or the Quick Look header' },
      { id: 'trash', label: 'Trash — restore what you deleted', combo: 'Trash icon beside search' },
      { id: 'tile-size', label: 'Grid: tile size', combo: 'Slider at the end of the count line' },
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
