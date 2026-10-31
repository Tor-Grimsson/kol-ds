// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=22-60
// source=packages/component/src/molecules/MenuItem.jsx
// component=MenuItem
import figma from 'figma'

export default {
  example: figma.code`<MenuItem label="File">
  <MenuDropdownItem iconLeft={<Icon name="file" size={14} />} onClick={create}>New file</MenuDropdownItem>
  <MenuDropdownItem iconLeft={<Icon name="save" size={14} />} shortcut="⌘S" onClick={save}>Save</MenuDropdownItem>
  <MenuDropdownDivider />
  <MenuDropdownItem iconLeft={<Icon name="trash" size={14} />} disabled>Delete</MenuDropdownItem>
</MenuItem>`,
  imports: ["import { MenuItem, MenuDropdownItem, MenuDropdownDivider, Icon } from \"@kolkrabbi/kol-component\""],
  id: 'MenuItem',
}
