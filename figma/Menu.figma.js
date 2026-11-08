// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=1311-11714
// source=packages/component/src/molecules/Menu.jsx
// component=Menu
import figma from 'figma'

const instance = figma.selectedInstance
const variant = instance.getEnum('variant', { "default": "", "float": ' variant="float"' })
export default {
  example: figma.code`<Menu${variant} items={items} trigger={({ open, props }) => <Button {...props}>Menu</Button>} />`,
  imports: ["import { Menu, Button } from \"@kolkrabbi/kol-component\""],
  id: 'Menu',
}
