// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=2323-11482
// source=packages/component/src/molecules/DividerLabel.jsx
// component=DividerLabel
import figma from 'figma'

// DividerLabel (new with kolbox, its GroupLabel); the rule is always drawn in code. (F4, 2026-11-19)
const instance = figma.selectedInstance
const label = instance.getString('label')
const example = figma.code`<DividerLabel>${label}</DividerLabel>`

export default {
  example,
  imports: ["import { DividerLabel } from \"@kolkrabbi/kol-component\""],
  id: 'DividerLabel',
  metadata: { nestable: true },
}
