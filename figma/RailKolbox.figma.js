// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=2323-12309
// source=packages/component/src/organisms/Rail.jsx
// component=Rail
import figma from 'figma'

// Rail variant="kolbox": header, body and footer slots. (F4, 2026-11-19)
const instance = figma.selectedInstance
const header = instance.getBoolean('show header') ? instance.getSlot('header') : undefined
const footer = instance.getBoolean('show footer') ? instance.getSlot('footer') : undefined
const body = instance.getSlot('body')
const example = figma.code`<Rail variant="kolbox"${header ? figma.code` header={${header}}` : ''}${footer ? figma.code` footer={${footer}}` : ''}>${body}</Rail>`

export default {
  example,
  imports: ["import { Rail } from \"@kolkrabbi/kol-component\""],
  id: 'RailKolbox',
  metadata: { nestable: true },
}
