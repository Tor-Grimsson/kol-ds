import { ContextMenu, MenuDropdownItem, useContextMenu } from '@kolkrabbi/kol-component'

export const stage = 'sm'

const ROWS = ['brand-guide.pdf', 'cover.jpg', 'notes.md']

/* Right-click a row: one menu serves the whole list, and gets the row it was opened on. */
export default function ContextMenuPreview() {
  const menu = useContextMenu()
  return (
    <>
      <ul className="flex flex-col">
        {ROWS.map((row) => (
          <li key={row} onContextMenu={(e) => menu.openAt(e, row)} className="kol-mono-14 text-body border-b border-fg-08 px-3 py-2 hover:bg-fg-04">
            {row}
          </li>
        ))}
      </ul>
      <p className="kol-helper-12 text-meta">Right-click a row.</p>
      <ContextMenu menu={menu}>
        {(row) => (
          <>
            <MenuDropdownItem onClick={() => {}}>Rename {row}</MenuDropdownItem>
            <MenuDropdownItem onClick={() => {}}>Move</MenuDropdownItem>
            <MenuDropdownItem onClick={() => {}}>Delete</MenuDropdownItem>
          </>
        )}
      </ContextMenu>
    </>
  )
}
