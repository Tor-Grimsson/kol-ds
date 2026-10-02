import { MenuItem, MenuDropdownItem, MenuDropdownNest, Icon } from '@kolkrabbi/kol-component'

/* Index card: closed trigger — the open panel is portalled to <body> and
 * floats over the index (see previews/MenuItem.jsx). */
export function Card() {
  return <MenuItem label="Insert">{null}</MenuItem>
}

export default function MenuDropdownNestPreview() {
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
