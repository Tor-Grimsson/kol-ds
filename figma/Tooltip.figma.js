// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=99-1592
// source=packages/component/src/utilities/Popover.jsx
// component=Tooltip
import figma from 'figma'

const instance = figma.selectedInstance

export default {
  example: figma.code`<Tooltip variant="float" label="${instance.getString('label')}"><Button variant="float" iconOnly="globe" aria-label="${instance.getString('label')}" /></Tooltip>`,
  imports: ["import { Tooltip, Button } from \"@kolkrabbi/kol-component\""],
  id: 'Tooltip',
}
