import { ContextMenu, MenuRow, MenuFlyout, Icon, useContextMenu } from '@kolkrabbi/kol-component'
import { CONTROL_TONES, ALIGNS, toneWrap } from '../lib/controls.js'

export const stage = 'sm'

const ROWS = ['brand-guide.pdf', 'cover.jpg', 'notes.md']

/* Right-click a row: one menu serves the whole list, and gets the row it was opened on.
 * `float` (float-everything W4 row 55): the float list, a flyout 8 off its row, the destructive row in the error ink. */
export const tones = CONTROL_TONES
export const variants = ['default', 'float']

export default function ContextMenuPreview({ tone, variant = 'default' }) {
  const menu = useContextMenu()
  if (variant === 'float') return <FloatContextMenu tone={tone} />
  return (
    <div className={toneWrap(tone)}>
      <ul className="flex flex-col">
        {ROWS.map((row) => (
          <li key={row} onContextMenu={(e) => menu.openAt(e, row)} className="kol-mono-14 text-body border-b border-fg-08 px-3 py-2 hover:bg-fg-04">
            {row}
          </li>
        ))}
      </ul>
      <p className="kol-mono-12 text-meta">Right-click a row.</p>
      <ContextMenu menu={menu}>
        {(row) => (
          <>
            <MenuRow onClick={() => {}}>Rename {row}</MenuRow>
            <MenuRow onClick={() => {}}>Move</MenuRow>
            <MenuRow onClick={() => {}}>Delete</MenuRow>
          </>
        )}
      </ContextMenu>
    </div>
  )
}

/* the float look: rows as data through `Menu`'s engine — Arrange opens a flyout, Delete layer is `tone: 'danger'` */
function FloatContextMenu({ tone }) {
  const menu = useContextMenu()
  const noop = () => {}
  const items = [
    { label: 'Duplicate', onClick: noop },
    { label: 'Rename', onClick: noop },
    { label: 'Arrange', items: [{ label: 'Bring to front', onClick: noop }, { label: 'Bring forward', onClick: noop }, { label: 'Send backward', onClick: noop }, { label: 'Send to back', onClick: noop }] },
    { label: 'Delete layer', icon: 'trash', tone: 'danger', onClick: noop },
  ]
  return (
    <div className={toneWrap(tone)}>
      <ul className="flex flex-col">
        {ROWS.map((row) => (
          <li key={row} onContextMenu={(e) => menu.openAt(e, row)} className="kol-float-body text-fg-emphasis px-3 py-2 hover:bg-fg-04 rounded-lg">
            {row}
          </li>
        ))}
      </ul>
      <p className="kol-float-hint text-fg-64">Right-click a row.</p>
      {menu.open && <ContextMenu menu={menu} variant="float"><FloatRows items={items} /></ContextMenu>}
    </div>
  )
}

/* ContextMenu takes children, not `items` — draw the same rows `Menu` would */
function FloatRows({ items }) {
  return items.map((it) => (
    it.items
      ? <MenuFlyout key={it.label} flyout label={it.label} rowClass="kol-menu-row kol-helper-12" panelClassName="kol-menu-panel kol-menu-panel--float min-w-[160px]" panelStyle={{ marginLeft: 8 }}><FloatRows items={it.items} /></MenuFlyout>
      : <MenuRow key={it.label} rowClass="kol-menu-row kol-helper-12" tone={it.tone} iconLeft={it.icon ? <Icon name={it.icon} size={16} /> : undefined} onClick={it.onClick}>{it.label}</MenuRow>
  ))
}
