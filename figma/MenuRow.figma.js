// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=273-323
// source=packages/component/src/molecules/Menu.jsx
// component=MenuRow
import figma from 'figma'

const instance = figma.selectedInstance
const label = instance.getString('label')
// variant float (2026-11-04) is the panel's — Menu variant="float" draws every row float; tone=danger is the destructive row
const tone = instance.getEnum('tone', { "default": "default", "danger": "danger" })
const current = instance.getEnum('current', { "true": "true", "false": "false" })
const disabled = instance.getEnum('disabled', { "true": "true", "false": "false" })
const iconOn = instance.getBoolean('icon')
const iconSwap = instance.getInstanceSwap('iconName')
const icon = (iconSwap && typeof iconSwap.codeConnectId === 'function' && iconSwap.codeConnectId()) || 'layout'
const check = instance.getBoolean('check')
const dot = instance.getBoolean('dot')
const kbd = instance.getBoolean('kbd')
const trailOn = instance.getBoolean('trailing')
const trailSwap = instance.getInstanceSwap('trailingName')
const trailing = (trailSwap && typeof trailSwap.codeConnectId === 'function' && trailSwap.codeConnectId()) || 'download'
// a row is one entry of Menu's `items` (Menu builds the MenuRow)
const keys = [`label: '${label}'`]
if (iconOn) keys.push(`icon: '${icon}'`)
if (current === 'true') keys.push('current: true')
if (dot) keys.push("indicator: 'dot'")
else if (check) keys.push("indicator: 'check'")
if (kbd) keys.push("kbd: 'D'")
if (trailOn) keys.push(`trailing: '${trailing}'`)
if (disabled === 'true') keys.push('disabled: true')
if (tone === 'danger') keys.push("tone: 'danger'")

export default {
  example: figma.code`{ ${keys.join(', ')}, onClick }`,
  imports: ["import { Menu } from \"@kolkrabbi/kol-component\""],
  id: 'MenuRow',
}
