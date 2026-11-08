import { MenuBar } from '@kolkrabbi/kol-shell'

/* the app's menu bar inside the browser (plan-2026-11-05-float-editor W1.1) — menus as data; ← / → walk the open menu */
const noop = () => {}
const go = (label) => ({ label, onClick: noop })
const MENUS = [
  { label: 'File', items: [
    { label: 'New', kbd: '⌘N', onClick: noop }, { label: 'Files…', kbd: '⌘O', onClick: noop },
    { label: 'Starters', items: ['Blank', 'Poster'].map(go) }, { divider: true },
    { label: 'Save…', kbd: '⌘S', onClick: noop }, { label: 'Save as…', kbd: '⌘⇧S', onClick: noop }, { divider: true },
    { label: 'Export', items: ['Export SVG', 'Export PNG', 'Batch export…', 'Open output window'].map(go) },
  ] },
  { label: 'Edit', items: [{ label: 'Undo', kbd: '⌘Z', onClick: noop }, { label: 'Redo', kbd: '⌘⇧Z', onClick: noop }] },
  { label: 'View', items: [{ label: 'Show / hide rulers', checked: true, onClick: noop }, go('Preview mode')] },
]

export default function MenuBarPreview() {
  return (
    <div className="w-full overflow-hidden rounded">
      <MenuBar app="FXR" menus={MENUS} end={[{ label: 'Help', items: [{ label: 'Show / hide shortcuts', kbd: '?', onClick: noop }] }]} />
    </div>
  )
}
