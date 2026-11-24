// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=2323-14305
// source=packages/component/src/utilities/Popover.jsx
// component=Tooltip
import figma from 'figma'

// Tooltip variant="kolbox". (F4, 2026-11-19)
const instance = figma.selectedInstance
const label = instance.getString('label')
const example = figma.code`<Tooltip variant="kolbox" label="${label}">{trigger}</Tooltip>`

export default {
  example,
  imports: ["import { Tooltip } from \"@kolkrabbi/kol-component\""],
  id: 'TooltipKolbox',
  metadata: { nestable: true },
}
