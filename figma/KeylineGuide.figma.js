// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=43-107
// source=packages/component/src/atoms/IconPlate.jsx
// component=KeylineGuide
import figma from 'figma'

const instance = figma.selectedInstance
const light = instance.getEnum('light', { "true": "true", "false": "false" })

export default {
  example: figma.code`<IconPlate size={96} ground="${light === 'true' ? 'light' : 'dark'}" guide>
  <Icon name="search" size={96} />
</IconPlate>`,
  imports: ["import { IconPlate, Icon } from \"@kolkrabbi/kol-component\""],
  id: 'KeylineGuide',
}
