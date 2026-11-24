// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=570-19966
// source=packages/shell/src/RailFlyout.jsx
// component=RailFlyout
import figma from 'figma'

export default {
  example: figma.code`<RailFlyout icon="grid" title="Dashboard" items={rows} active={path} onPick={pick} />`,
  imports: ["import { RailFlyout } from \"@kolkrabbi/kol-shell\""],
  id: 'RailFlyout',
}
