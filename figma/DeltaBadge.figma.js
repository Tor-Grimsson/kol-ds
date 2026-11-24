// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=1455-16146
// source=packages/dashboards/src/cards/DeltaBadge.jsx
// component=DeltaBadge
import figma from 'figma'

const instance = figma.selectedInstance
const variant = instance.getEnum('canvas', { "false": "", "true": ' variant="canvas"' })
export default {
  example: figma.code`<DeltaBadge${variant} now={now} then={then} />`,
  imports: ["import { DeltaBadge } from \"@kolkrabbi/kol-dashboards\""],
  id: 'DeltaBadge',
}
