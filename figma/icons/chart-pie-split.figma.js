// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=299-90
// source=packages/icons/src
// component=Icon
import figma from 'figma'

const instance = figma.selectedInstance
const variant = instance.getEnum('variant', { "outline": "outline", "solid": "solid" })

export default {
  example: figma.code`<Icon name="chart-pie-split" variant="${variant}" />`,
  imports: ["import { Icon } from \"@kolkrabbi/kol-component\""],
  id: 'chart-pie-split',
}
