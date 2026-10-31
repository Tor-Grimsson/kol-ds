// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=273-324
// source=packages/component/src/molecules/Menu.jsx
// component=MenuLabel
import figma from 'figma'

const instance = figma.selectedInstance
const label = instance.getString('label')

export default {
  example: figma.code`{ heading: '${label}' }`,
  imports: ["import { Menu } from \"@kolkrabbi/kol-component\""],
  id: 'MenuLabel',
}
