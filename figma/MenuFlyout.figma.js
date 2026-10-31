// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=273-445
// source=packages/component/src/molecules/MenuItem.jsx
// component=MenuFlyout
import figma from 'figma'

const instance = figma.selectedInstance
const label = instance.getString('label')
const iconSwap = instance.getInstanceSwap('iconName')
const icon = (iconSwap && typeof iconSwap.codeConnectId === 'function' && iconSwap.codeConnectId()) || 'layout'

export default {
  example: figma.code`{ label: '${label}', icon: '${icon}', items: [{ label: 'Chrome', onClick }] }`,
  imports: ["import { Menu } from \"@kolkrabbi/kol-component\""],
  id: 'MenuFlyout',
}
