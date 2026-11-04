// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=570-20053
// source=packages/shell/src/RailFlyout.jsx
// component=RailFlyout
import figma from 'figma'

const instance = figma.selectedInstance
const surface = instance.getEnum('surface', { "solid": "solid", "glass-dark": "glass-dark", "glass-light": "glass-light" })
const sf = surface !== 'solid' ? ` surface="${surface}"` : ''
export default {
  example: figma.code`<RailFlyout icon="grid" title="Dashboard" items={rows} active={path} onPick={pick}${sf} />`,
  imports: ["import { RailFlyout } from \"@kolkrabbi/kol-shell\""],
  id: 'RailFlyout',
}
