import { MenuItem, MenuDropdownItem, Icon } from '@kolkrabbi/kol-component'

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
        <MenuDropdownItem iconLeft={<Icon name="clipboard-1" size={14} />} shortcut="⌘V" onClick={() => {}}>
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
