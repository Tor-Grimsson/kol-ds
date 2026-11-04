// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=576-20013
// source=packages/component/src/atoms/ValueField.jsx
// component=ValueField
import figma from 'figma'
const instance = figma.selectedInstance
const size = instance.getEnum('size', { "sm": "sm", "md": "md", "lg": "lg" })
const value = instance.getString('value')
const iconOn = instance.getBoolean('icon')
const swap = instance.getInstanceSwap('iconName')
const icon = (swap && typeof swap.codeConnectId === 'function' && swap.codeConnectId()) || 'circle'
// trailing: the children's right-hand note (ml-auto, kol-float-timecode fg-64), e.g. the size letter
const tr = instance.getBoolean('showTrailing') ? `<span className="kol-float-timecode text-fg-64 ml-auto">${instance.getString('trailing')}</span>` : ''
const xs = size === 'md' ? '' : ` size="${size}"`
export default {
  example: iconOn
    ? figma.code`<ValueField${xs} icon="${icon}">${value}${tr}</ValueField>`
    : figma.code`<ValueField${xs}>${value}${tr}</ValueField>`,
  imports: ["import { ValueField } from \"@kolkrabbi/kol-component\""],
  id: 'ValueField',
}
