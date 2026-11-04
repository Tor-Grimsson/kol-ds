// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=563-19316
// source=packages/dashboards/src/charts/LineChart.jsx
// component=LineChart
import figma from 'figma'

const instance = figma.selectedInstance
const variant = instance.getEnum('variant', { "default": "default", "float": "float" })

export default {
  example: variant === 'float'
    ? figma.code`<LineChart variant="float" series={series} tabs={tabs} tab={tab} onTab={setTab} legend={legend} interval="Daily" yLabels={yLabels} xLabels={xLabels} peak={18} />`
    : figma.code`<LineChart series={series} height={220} showArea xLabels={xLabels} yLabels={yLabels} />`,
  imports: ["import { LineChart } from \"@kolkrabbi/kol-dashboards\""],
  id: 'LineChart',
}
