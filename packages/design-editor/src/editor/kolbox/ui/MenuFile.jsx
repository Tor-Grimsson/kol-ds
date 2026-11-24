import { Menu } from '@kolkrabbi/kol-component'

/* The file name's menu (Figma plan W9.2; round 3, 10.1): the open file's own rows, never the whole File menu a second
   time. It opens from the file name in the top rail and in LeftRail's header. On the Editor the rows are the engine's
   (editor/MenuBar.jsx `useFileRows`, passed in as `groups`); a pick runs the row's `run`. FILE_GROUPS is only the
   stand-in for the specimen page (#/dev/overlays), which has no engine: the same labels, order and shortcuts. The
   File menu as it was is in _tmp/2026-11-18-menubar/. */
export const FILE_GROUPS = [
  [{ label: 'Save', shortcut: '⌘S' }, { label: 'Save as…', shortcut: '⌘⇧S' }],
  [{ label: 'Rename…' }, { label: 'Duplicate' }],
  [{ label: 'Files…', shortcut: '⌘O' }],
]

export default function MenuFile({ anchor, open, onClose, onSelect, groups = FILE_GROUPS }) {
  return <Menu variant="kolbox" aria-label="File" anchor={anchor} open={open} onClose={onClose} onSelect={(row) => { row.run?.(); onSelect?.(row.label) }} groups={groups} />
}
