import { MenuPopover, MenuDropdownItem, MenuDropdownDivider } from '@kolkrabbi/kol-component'

export default function MenuPopoverDemo() {
  return (
    <MenuPopover label="Actions" panelClassName="min-w-[160px] py-1" defaultOpen>
      <MenuDropdownItem onClick={() => {}}>Duplicate</MenuDropdownItem>
      <MenuDropdownItem onClick={() => {}}>Rename</MenuDropdownItem>
      <MenuDropdownItem onClick={() => {}}>Move to…</MenuDropdownItem>
      <MenuDropdownDivider />
      <MenuDropdownItem onClick={() => {}}>Delete</MenuDropdownItem>
    </MenuPopover>
  )
}
