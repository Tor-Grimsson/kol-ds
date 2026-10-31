// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=273-329
// source=packages/component/src/molecules/Menu.jsx
// component=MenuPanel
import figma from 'figma'

export default {
  example: figma.code`<Menu align="end" minWidth={224} trigger={({ open, props }) => <MenuTrigger open={open} icon="filter-lines" {...props}>Filter</MenuTrigger>} items={items} />`,
  imports: ["import { Menu, MenuTrigger } from \"@kolkrabbi/kol-component\""],
  id: 'MenuPanel',
}
