// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=1311-11723
// source=packages/dashboards/src/shared/DashTooltip.jsx
// component=DashTooltip
import figma from 'figma'

export default {
  example: figma.code`<DashTooltip visible={activeIndex !== null}>{lines}</DashTooltip>`,
  imports: ["import { DashTooltip } from \"@kolkrabbi/kol-dashboards\""],
  id: 'DashTooltip',
}
