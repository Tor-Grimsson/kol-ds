// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=20-10
// source=packages/component/src/atoms/Divider.jsx
// component=Divider
import figma from 'figma'

const instance = figma.selectedInstance
const variant = instance.getEnum('variant', { "horizontal": "horizontal", "vertical": "vertical" })

export default {
  example: figma.code`<Divider variant="${variant}" />`,
  imports: ["import { Divider } from \"@kolkrabbi/kol-component\""],
  id: 'Divider',
}
