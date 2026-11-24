// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=2323-12195
// source=packages/component/src/molecules/FieldPair.jsx
// component=FieldPair
import figma from 'figma'

// FieldPair variant="kolbox" (kolbox's PropertyRow). (F4, 2026-11-19)
const instance = figma.selectedInstance
const first = instance.getSlot('first')
const second = instance.getSlot('second')
const trailing = instance.getBoolean('show trailing') ? instance.getSlot('trailing') : undefined
const example = figma.code`<FieldPair variant="kolbox" first={${first}} second={${second}}${trailing ? figma.code` trailing={${trailing}}` : ''} />`

export default {
  example,
  imports: ["import { FieldPair } from \"@kolkrabbi/kol-component\""],
  id: 'FieldPairKolbox',
  metadata: { nestable: true },
}
