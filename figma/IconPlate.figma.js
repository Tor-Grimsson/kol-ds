// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=78-177
// source=packages/component/src/atoms/IconPlate.jsx
// component=IconPlate
import figma from 'figma'

const instance = figma.selectedInstance
const ground = instance.getEnum('ground', { "light": "light", "dark": "dark" })

export default {
  example: figma.code`<IconPlate size={48} ground="${ground}">
  <Icon name="search" size={48} />
</IconPlate>`,
  imports: ["import { IconPlate, Icon } from \"@kolkrabbi/kol-component\""],
  id: 'IconPlate',
}
