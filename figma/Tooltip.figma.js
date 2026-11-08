// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=1218-95
// source=packages/component/src/utilities/Popover.jsx
// component=Tooltip
import figma from 'figma'

const instance = figma.selectedInstance
const variant = instance.getEnum('variant', { "default": "default", "float": "float" })
const label = instance.getString('label')
const shortcut = instance.getBoolean('shortcut') ? ` shortcut="${instance.getString('key')}"` : ''
const xv = variant === 'float' ? ' variant="float"' : ''

export default {
  example: figma.code`<Tooltip${xv} label="${label}"${shortcut}>{trigger}</Tooltip>`,
  imports: ["import { Tooltip } from \"@kolkrabbi/kol-component\""],
  id: 'Tooltip',
}
