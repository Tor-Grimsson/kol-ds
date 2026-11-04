// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=570-19864
// source=packages/shell/src/RailDisplayControls.jsx
// component=RailDisplayControls
import figma from 'figma'

const instance = figma.selectedInstance

export default {
  example: figma.code`<RailDisplayControls onCollapse={collapse} onHide={hide} />`,
  imports: ["import { RailDisplayControls } from \"@kolkrabbi/kol-shell\""],
  id: 'RailDisplayControls',
}
