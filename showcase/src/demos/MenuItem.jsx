import { MenuItem, MenuDropdownItem, MenuDropdownDivider, Icon } from '@kolkrabbi/kol-component'

export default function MenuItemDemo() {
  return (
    <MenuItem label="File">
      <div className="min-w-[180px] py-1">
        <MenuDropdownItem iconLeft={<Icon name="add-file" size={14} />} onClick={() => {}}>
          New file
        </MenuDropdownItem>
        <MenuDropdownItem iconLeft={<Icon name="save" size={14} />} shortcut="⌘S" onClick={() => {}}>
          Save
        </MenuDropdownItem>
        <MenuDropdownItem iconLeft={<Icon name="download" size={14} />} onClick={() => {}}>
          Export…
        </MenuDropdownItem>
        <MenuDropdownDivider />
        <MenuDropdownItem iconLeft={<Icon name="trash" size={14} />} disabled onClick={() => {}}>
          Delete
        </MenuDropdownItem>
      </div>
    </MenuItem>
  )
}
