import { useState } from 'react'
import { Button, Menu, MenuTrigger } from '@kolkrabbi/kol-component'
import { CONTROL_TONES, ALIGNS, toneWrap } from '../lib/controls.js'

/* Index card: the closed trigger — the open panel is portalled to <body> (see previews/MenuItem.jsx) */
export function Card() {
  return <Menu items={[]} trigger={({ open, props }) => <MenuTrigger open={open} icon="filter-lines" {...props}>Filter</MenuTrigger>} />
}

/* the base: a MenuTrigger and rows as data — a MenuLabel, rows with icons, the dot (the current pick) and key caps, a MenuDivider, a flyout
 * (MenuFlyout) and a disabled row with its reason; `search` puts the field above the rows */
export const variants = ['rows', 'search', 'float', 'kolbox', 'folio']
export const tones = CONTROL_TONES
export const aligns = ALIGNS

const noop = () => {}
const ROWS = [
  { heading: 'Graph interval' },
  { label: 'Hours', kbd: 'H', onClick: noop },
  { label: 'Days', kbd: 'D', current: true, indicator: 'dot', onClick: noop },
  { divider: true },
  { label: 'Location', icon: 'pushpin', items: [{ label: 'Country', onClick: noop }, { label: 'City', onClick: noop }] },
  { label: 'Screen size', icon: 'monitor', disabled: true, tooltip: 'Not available' },
  { label: 'Export stats', trailing: 'download', onClick: noop },
]
const PROPS = ['Author', 'Category', 'Plan', 'Theme'].map((label) => ({ label, onClick: noop }))
/* the float list (float-everything W4 rows 46–52): a section label, a current row, a kbd row, a flyout, a rule, a destructive row, a disabled row */
const FLOAT_ROWS = [
  { heading: 'Output format' },
  { label: 'Orbit field', current: true, indicator: 'check', onClick: noop },
  { label: 'New file', kbd: '⌘N', onClick: noop },
  { label: 'Arrange', items: [{ label: 'Bring to front', onClick: noop }, { label: 'Send to back', onClick: noop }] },
  { divider: true },
  { label: 'Delete layer', icon: 'trash', tone: 'danger', onClick: noop },
  { label: 'Match scene rate', disabled: true, tooltip: 'No scene' },
]

/* kolbox (W31.2 batch 4): kolbox's menu open beside its anchor, a group title, a check, a key cap, a tag, a child menu */
const KOLBOX_GROUPS = [
  [{ label: 'New file', shortcut: '⌘N' }, { label: 'Open…', shortcut: '⌘O' }],
  { title: 'View', rows: [{ label: 'Rulers', check: true }, { label: 'Outlines', check: false, tag: 'beta' }] },
  [{ label: 'Export', submenu: [[{ label: 'PNG' }, { label: 'SVG' }]] }, { label: 'Print', disabled: true }],
]
function KolboxMenu() {
  const [anchor, setAnchor] = useState(null)
  const [open, setOpen] = useState(true)
  return (
    <div className="flex min-h-[380px] w-full items-start justify-center">
      <span ref={setAnchor}><Button variant="kolbox" pressed={open} onClick={() => setOpen(!open)}>Menu</Button></span>
      {anchor && <Menu variant="kolbox" anchor={anchor} open={open} onClose={() => setOpen(false)} groups={KOLBOX_GROUPS} aria-label="File" placement="right-start" />}
    </div>
  )
}

/* folio (Folio batch B): Folio's list under its trigger, in place; a check, keys, a rule, a disabled row */
const FOLIO_ITEMS = [
  { label: 'Undo', onClick: noop, kbd: '⌘Z', checked: false }, { label: 'Redo', kbd: '⇧⌘Z', checked: false, disabled: true }, { divider: true },
  { label: 'Word wrap', onClick: noop, kbd: '', checked: true },
]
function FolioMenu() {
  const [open, setOpen] = useState(true)
  return (
    <div data-folio-theme="light" className="flex min-h-[380px] w-full items-start justify-center bg-(--kol-folio-paper) p-6 font-(family-name:--kol-font-family-float) leading-[1.21] text-(--kol-folio-ink)">
      <span className="relative">
        <button type="button" aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen(!open)} className="kol-menubar-trigger--folio flex h-[32px] items-center rounded-[4px] px-[14px]">Edit</button>
        <Menu variant="folio" open={open} onClose={() => setOpen(false)} aria-label="Edit" items={FOLIO_ITEMS} panelClassName="absolute left-0 top-[calc(100%+4px)]" />
      </span>
    </div>
  )
}

export default function MenuPreview({ variant = 'rows', tone, align = 'start' }) {
  if (variant === 'kolbox') return <KolboxMenu />
  if (variant === 'folio') return <FolioMenu />
  const float = variant === 'float'
  return (
    <div className={`flex min-h-[380px] w-full items-start justify-center ${toneWrap(tone)}`}>
      <Menu key={variant + align} align={align} defaultOpen stayOpen minWidth={variant === 'search' ? 280 : float ? 230 : 224} variant={float ? 'float' : undefined} offset={float ? 8 : undefined}
        search={variant === 'search' ? {} : undefined} items={variant === 'search' ? PROPS : float ? FLOAT_ROWS : ROWS}
        trigger={({ open, props }) => <MenuTrigger open={open} variant={float ? 'float' : undefined} {...props}>{variant === 'search' ? 'Properties' : 'Menu'}</MenuTrigger>} />
    </div>
  )
}
