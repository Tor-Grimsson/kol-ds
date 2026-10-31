import { MenuItem, MenuDropdownItem, Icon } from '@kolkrabbi/kol-component'

/* Index card: closed trigger — the open panel is portalled to <body> and
 * floats over the index (see previews/MenuItem.jsx). */
export function Card() {
  return <MenuItem label="Edit">{null}</MenuItem>
}

export default function MenuDropdownItemPreview() {
  return (
    <MenuItem label="Edit" defaultOpen>
      <div className="min-w-[200px] py-1">
        <MenuDropdownItem iconLeft={<Icon name="cut" size={14} />} kbd="⌘X" onClick={() => {}}>
          Cut
        </MenuDropdownItem>
        <MenuDropdownItem iconLeft={<Icon name="copy" size={14} />} kbd="⌘C" onClick={() => {}}>
          Copy
        </MenuDropdownItem>
        <MenuDropdownItem iconLeft={<Icon name="clipboard" size={14} />} kbd="⌘V" onClick={() => {}}>
          Paste
        </MenuDropdownItem>
        <MenuDropdownItem indicator="check" onClick={() => {}}>
          Track changes
        </MenuDropdownItem>
        <MenuDropdownItem disabled onClick={() => {}}>
          Redo
        </MenuDropdownItem>
      </div>
    </MenuItem>
  )
}
