// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=716-56481
// source=packages/dashboards/src/charts/TrendChart.jsx
// component=TrendChart
import figma from 'figma'

export default {
  example: figma.code`<TrendChart metric={metric} series={series} unit={unit} period={period} onPick={onPick} />`,
  imports: ["import { TrendChart } from \"@kolkrabbi/kol-dashboards\""],
  id: 'TrendChart',
}
