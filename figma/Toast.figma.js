// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=2323-12883
// source=packages/component/src/molecules/Toast.jsx
// component=Toast
import figma from 'figma'

// Toast (new with kolbox). (F4, 2026-11-19)
const instance = figma.selectedInstance
const message = instance.getString('message')
const example = figma.code`<Toast message="${message}" />`

export default {
  example,
  imports: ["import { Toast } from \"@kolkrabbi/kol-component\""],
  id: 'Toast',
  metadata: { nestable: true },
}
