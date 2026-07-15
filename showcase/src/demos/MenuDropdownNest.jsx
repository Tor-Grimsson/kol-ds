import { MenuItem, MenuDropdownItem, MenuDropdownNest, Icon } from '@kolkrabbi/kol-component'

export default function MenuDropdownNestDemo() {
  return (
    <MenuItem label="Insert" defaultOpen>
      <div className="min-w-[200px] py-1">
        <MenuDropdownItem onClick={() => {}}>Text block</MenuDropdownItem>
        <MenuDropdownNest iconLeft={<Icon name="image" size={14} />} label="Media">
          <MenuDropdownItem onClick={() => {}}>Image</MenuDropdownItem>
          <MenuDropdownItem onClick={() => {}}>Video</MenuDropdownItem>
          <MenuDropdownItem onClick={() => {}}>Embed</MenuDropdownItem>
        </MenuDropdownNest>
        <MenuDropdownNest iconLeft={<Icon name="folder" size={14} />} label="Layout">
          <MenuDropdownItem onClick={() => {}}>Columns</MenuDropdownItem>
          <MenuDropdownItem onClick={() => {}}>Divider</MenuDropdownItem>
        </MenuDropdownNest>
      </div>
    </MenuItem>
  )
}
