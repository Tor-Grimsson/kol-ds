import { MenuItem, MenuDropdownItem, MenuDropdownDivider } from '@kolkrabbi/kol-component'

export default function MenuDropdownDividerDemo() {
  return (
    <MenuItem label="View" defaultOpen>
      <div className="min-w-[180px] py-1">
        <MenuDropdownItem onClick={() => {}}>Zoom in</MenuDropdownItem>
        <MenuDropdownItem onClick={() => {}}>Zoom out</MenuDropdownItem>
        <MenuDropdownDivider />
        <MenuDropdownItem onClick={() => {}}>Show grid</MenuDropdownItem>
        <MenuDropdownItem onClick={() => {}}>Show rulers</MenuDropdownItem>
        <MenuDropdownDivider />
        <MenuDropdownItem onClick={() => {}}>Enter fullscreen</MenuDropdownItem>
      </div>
    </MenuItem>
  )
}
