// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=559-19016
// source=packages/dashboards/src/charts/Sparkline.jsx
// component=Sparkline
import figma from 'figma'

const instance = figma.selectedInstance
export default {
  example: figma.code`<Sparkline data={data} height={24} />`,
  imports: ["import { Sparkline } from \"@kolkrabbi/kol-dashboards\""],
  id: 'Sparkline',
}
