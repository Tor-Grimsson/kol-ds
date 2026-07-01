import { MenuItem, MenuDropdownItem, MenuDropdownDivider, MenuDropdownNest, Icon } from '@kolkrabbi/kol-component'

export const FileMenu = () => (
  <MenuItem label="File">
    <div className="py-1 w-[220px]">
      <MenuDropdownItem onClick={() => {}} shortcut="⌘S">Save</MenuDropdownItem>
      <MenuDropdownItem onClick={() => {}} shortcut="⇧⌘S">Save as…</MenuDropdownItem>
      <MenuDropdownItem onClick={() => {}} shortcut={<Icon name="check" size={11} />}>Autosave</MenuDropdownItem>
      <MenuDropdownDivider />
      <MenuDropdownNest iconLeft={<Icon name="arrow-right" size={14} />} label="Export">
        <MenuDropdownItem onClick={() => {}}>Export SVG</MenuDropdownItem>
        <MenuDropdownItem onClick={() => {}}>Export PNG</MenuDropdownItem>
      </MenuDropdownNest>
      <MenuDropdownDivider />
      <MenuDropdownItem onClick={() => {}} iconLeft={<Icon name="trash" size={14} />} disabled>Delete</MenuDropdownItem>
    </div>
  </MenuItem>
)

export const AlignEnd = () => (
  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
    <MenuItem label="Templates" align="end">
      <div className="py-1 w-[200px]">
        <MenuDropdownItem onClick={() => {}}>Blank</MenuDropdownItem>
        <MenuDropdownItem onClick={() => {}}>Poster</MenuDropdownItem>
        <MenuDropdownItem onClick={() => {}}>Social</MenuDropdownItem>
      </div>
    </MenuItem>
  </div>
)
