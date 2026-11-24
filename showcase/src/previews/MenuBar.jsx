import { MenuBar } from '@kolkrabbi/kol-shell'
import { Button } from '@kolkrabbi/kol-component'

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

export const variants = ['bar', 'folio', 'kolbox']

/* folio (Folio batch B): Folio's editor bar, its lists Menu folio under each trigger in place; `children` at the right */
const FOLIO_MENUS = [
  { label: 'File', items: [{ label: 'New', kbd: '⌘N', checked: false, onClick: noop }, { label: 'Save', kbd: '⌘S', checked: false, onClick: noop }, { divider: true }, { label: 'Export', kbd: '', checked: false, onClick: noop }] },
  { label: 'View', items: [{ label: 'Word wrap', kbd: '', checked: true, onClick: noop }, { label: 'Preview', kbd: '', checked: false, disabled: true }] },
]

export default function MenuBarPreview({ variant = 'bar' }) {
  /* kolbox (Folio on kolbox, 2026-11-22): kolbox's bar at the top rail's height, its lists Menu kolbox; `children` at the right */
  if (variant === 'kolbox') return (
    <div className="h-[300px] w-full">
      <MenuBar variant="kolbox" menus={FOLIO_MENUS}><Button variant="kolbox" tone="ghost" iconLeft="search">Find</Button></MenuBar>
    </div>
  )
  if (variant === 'folio') return (
    <div data-folio-theme="light" className="h-[300px] w-full bg-(--kol-folio-paper) font-(family-name:--kol-font-family-float) leading-[1.21] text-(--kol-folio-ink)">
      <MenuBar variant="folio" menus={FOLIO_MENUS}><span className="kol-folio-meta text-(--kol-folio-muted)">Tools</span></MenuBar>
    </div>
  )
  return (
    <div className="w-full overflow-hidden rounded">
      <MenuBar app="FXR" menus={MENUS} end={[{ label: 'Help', items: [{ label: 'Show / hide shortcuts', kbd: '?', onClick: noop }] }]} />
    </div>
  )
}
