import { MenuItem, MenuDropdownItem, MenuDropdownDivider, Icon } from '@kolkrabbi/kol-component'

export default function MenuItemDemo() {
  return (
    /* The panel is portalled (escapes overflow by design), so the demo must
       reserve the space it lands on — otherwise the open-by-default menu
       overlays whatever sits under the card in dense galleries. */
    <div className="flex min-h-[220px] w-full items-start justify-center">
    <MenuItem label="File" defaultOpen>
      <div className="min-w-[180px] py-1">
        <MenuDropdownItem iconLeft={<Icon name="file" size={14} />} onClick={() => {}}>
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
    </div>
  )
}
