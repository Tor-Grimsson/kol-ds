// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=2323-11279
// source=packages/component/src/atoms/Input.jsx
// component=Input
import figma from 'figma'

// Input variant="kolbox": text, number (hug) or color; leading and trailing slots are prefix and suffix. (F4, 2026-11-19)
const instance = figma.selectedInstance
const type = instance.getEnum('type', { text: 'text', number: 'number', color: 'color' })
const value = type === 'number' ? instance.getString('number') : type === 'color' ? instance.getString('hex') : instance.getString('value')
const state = instance.getEnum('state', { default: '', hover: '', focus: '', disabled: ' disabled', invalid: ' aria-invalid' })
const leading = instance.getSlot('leading')
const trailing = instance.getSlot('trailing')
const example = figma.code`<Input variant="kolbox"${type === 'number' ? ' hug' : ''}${leading ? figma.code` prefix={${leading}}` : ''}${trailing ? figma.code` suffix={${trailing}}` : ''} defaultValue="${value}"${state} />`

export default {
  example,
  imports: ["import { Input } from \"@kolkrabbi/kol-component\""],
  id: 'InputKolbox',
  metadata: { nestable: true },
}
