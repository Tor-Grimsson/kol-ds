// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=559-19003
// source=packages/dashboards/src/charts/WeeklyBars.jsx
// component=WeeklyBars
import figma from 'figma'


export default {
  example: figma.code`<WeeklyBars weeks={[{ count: 13, label: '01–07' }, { count: 19, label: '08–14' }, { count: 24, label: '15–21' }, { count: 31, label: '22–28', current: true }]} />`,
  imports: ["import { WeeklyBars } from \"@kolkrabbi/kol-dashboards\""],
  id: 'WeeklyBars',
}
