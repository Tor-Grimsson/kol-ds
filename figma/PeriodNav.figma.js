// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=569-19893
// source=packages/shell/src/WorkspaceStrips.jsx
// component=PeriodNav
import figma from 'figma'

export default {
  example: figma.code`<PeriodNav onPrev={prev} onNext={next} onToday={today} />`,
  imports: ["import { PeriodNav } from \"@kolkrabbi/kol-shell\""],
  id: 'PeriodNav',
}
