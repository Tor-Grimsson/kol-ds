// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=580-20133
// source=packages/component/src/molecules/Menu.jsx
// component=MenuPanel
import figma from 'figma'
const instance = figma.selectedInstance
// variant float (float-everything W4 row 53, 2026-11-04): the list on the list radius; sheet=true is the More sheet (MenuMore variant="float")
const variant = instance.getEnum('variant', { "default": "default", "float": "float" })
const sheet = instance.getEnum('sheet', { "true": "true", "false": "false" })
export default {
  example: variant === 'float' && sheet === 'true'
    ? figma.code`<MenuMore variant="float" label="More" items={items} />`
    : variant === 'float'
    ? figma.code`<Menu variant="float" align="end" minWidth={230} trigger={({ open, props }) => <MenuTrigger variant="float" open={open} {...props}>Menu</MenuTrigger>} items={items} />`
    : figma.code`<Menu align="end" minWidth={224} trigger={({ open, props }) => <MenuTrigger open={open} icon="filter-lines" {...props}>Filter</MenuTrigger>} items={items} />`,
  imports: ["import { Menu, MenuTrigger, MenuMore } from \"@kolkrabbi/kol-component\""],
  id: 'MenuPanel',
}
