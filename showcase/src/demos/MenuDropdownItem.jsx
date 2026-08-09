import { MenuItem, MenuDropdownItem, Icon } from '@kolkrabbi/kol-component'

/* Index card: closed trigger — the open panel is portalled to <body> and
 * floats over the index (see demos/MenuItem.jsx). */
export function Card() {
  return <MenuItem label="Edit">{null}</MenuItem>
}

export default function MenuDropdownItemDemo() {
  return (
    <MenuItem label="Edit" defaultOpen>
      <div className="min-w-[200px] py-1">
        <MenuDropdownItem iconLeft={<Icon name="cut" size={14} />} shortcut="⌘X" onClick={() => {}}>
          Cut
        </MenuDropdownItem>
        <MenuDropdownItem iconLeft={<Icon name="copy" size={14} />} shortcut="⌘C" onClick={() => {}}>
          Copy
        </MenuDropdownItem>
        <MenuDropdownItem iconLeft={<Icon name="clipboard" size={14} />} shortcut="⌘V" onClick={() => {}}>
          Paste
        </MenuDropdownItem>
        <MenuDropdownItem shortcut={<Icon name="check" size={11} />} onClick={() => {}}>
          Track changes
        </MenuDropdownItem>
        <MenuDropdownItem disabled onClick={() => {}}>
          Redo
        </MenuDropdownItem>
      </div>
    </MenuItem>
  )
}
