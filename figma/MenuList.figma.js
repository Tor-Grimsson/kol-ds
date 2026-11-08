// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=1591-9345
// source=packages/component/src/molecules/MenuList.jsx
// component=MenuList
import figma from 'figma'

const instance = figma.selectedInstance
// the rows only (plan-2026-11-07-menu-system W2.2); Menu / Dropdown render it in their PopoverPanel
const variant = instance.getEnum('variant', { "default": "", "float": ' variant="float"', "sheet": ' variant="sheet"', "select": "" })

export default {
  example: figma.code`<MenuList${variant} items={items} />`,
  imports: ["import { MenuList } from \"@kolkrabbi/kol-component\""],
  id: 'MenuList',
}
