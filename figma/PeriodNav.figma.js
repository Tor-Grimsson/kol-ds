// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=569-19914
// source=packages/shell/src/WorkspaceStrips.jsx
// component=PeriodNav
import figma from 'figma'

const instance = figma.selectedInstance
const surface = instance.getEnum('surface', { "solid": "solid", "glass-dark": "glass-dark", "glass-light": "glass-light" })
const sf = surface !== 'solid' ? ` surface="${surface}"` : ''
export default {
  example: figma.code`<PeriodNav onPrev={prev} onNext={next} onToday={today}${sf} />`,
  imports: ["import { PeriodNav } from \"@kolkrabbi/kol-shell\""],
  id: 'PeriodNav',
}
