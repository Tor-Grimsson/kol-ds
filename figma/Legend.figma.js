// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=559-18985
// source=packages/dashboards/src/charts/Legend.jsx
// component=Legend
import figma from 'figma'

const instance = figma.selectedInstance
const dashed = instance.getEnum('dashed', { "true": "true", "false": "false" })

export default {
  example: figma.code`<Legend items={[{ label: 'This period' }, { label: 'Previous period'${dashed === 'true' ? ', dashed: true' : ''} }]} interval="Daily" />`,
  imports: ["import { Legend } from \"@kolkrabbi/kol-dashboards\""],
  id: 'Legend',
}
