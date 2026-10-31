// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=8-32
// source=packages/component/src/atoms/Button.jsx
// component=Button
import figma from 'figma'

const instance = figma.selectedInstance
const size = instance.getEnum('size', { "xs": "xs", "sm": "sm", "md": "md", "lg": "lg" })
const iconOnly = instance.getEnum('iconOnly', { "true": "true", "false": "false" })
const variant = instance.getEnum('variant', { "default": "default", "nav": "nav", "tab": "tab", "tab-filled": "tab-filled", "accent": "accent", "danger": "danger", "float": "float" })
const pressed = instance.getEnum('pressed', { "true": "true", "false": "false" })
const disabled = instance.getEnum('disabled', { "true": "true", "false": "false" })
const swap = instance.getInstanceSwap('icon')
// the swapped icon's own Code Connect id is its code name (figma/icons/*.figma.js); a layer name never follows a swap
const icon = (swap && typeof swap.codeConnectId === 'function' && swap.codeConnectId()) || 'search'

const radius = instance.getEnum('radius', { "sm": "sm", "full": "full" })
const iconLeftOn = instance.getBoolean('iconLeft')
const leftSwap = instance.getInstanceSwap('iconLeftName')
const left = (leftSwap && typeof leftSwap.codeConnectId === 'function' && leftSwap.codeConnectId()) || 'search'
const iconRightOn = instance.getBoolean('iconRight')
const rightSwap = instance.getInstanceSwap('iconRightName')
const right = (rightSwap && typeof rightSwap.codeConnectId === 'function' && rightSwap.codeConnectId()) || 'chevron-down'
// extra props, in the order the code reads them
const xr = radius === 'full' ? ' radius="full"' : ''
const xd = disabled === 'true' ? ' disabled' : ''
const xl = (iconLeftOn ? ` iconLeft="${left}"` : '') + (iconRightOn ? ` iconRight="${right}"` : '')
// tone is the `tone` collection's variable mode on the instance or a wrapper (W24); Code Connect can't read a mode, so the snippet inherits it like an untoned <Button>
const ground = variant !== 'default' ? `variant="${variant}" ` : ''
export default {
  example: iconOnly === 'true'
    ? pressed === 'true'
      ? figma.code`<Button ${ground}size="${size}"${xr} iconOnly="${icon}" aria-label="${icon}" pressed${xd} />`
      : figma.code`<Button ${ground}size="${size}"${xr} iconOnly="${icon}" aria-label="${icon}"${xd} />`
    : pressed === 'true'
      ? figma.code`<Button ${ground}size="${size}"${xr}${xl} pressed${xd}>${instance.getString('label')}</Button>`
      : figma.code`<Button ${ground}size="${size}"${xr}${xl}${xd}>${instance.getString('label')}</Button>`,
  imports: ["import { Button } from \"@kolkrabbi/kol-component\""],
  id: 'Button',
}
