// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=570-19841
// source=packages/shell/src/TopControlsBar.jsx
// component=PanelsRestore
import figma from 'figma'

const instance = figma.selectedInstance
const surface = instance.getEnum('surface', { "solid": "solid", "glass-dark": "glass-dark", "glass-light": "glass-light" })
const sf = surface !== 'solid' ? ` surface="${surface}"` : ''
export default {
  example: figma.code`<PanelsRestore items={panels}${sf} />`,
  imports: ["import { PanelsRestore } from \"@kolkrabbi/kol-shell\""],
  id: 'PanelsRestore',
}
