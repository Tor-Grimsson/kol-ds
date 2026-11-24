// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=2323-12093
// source=packages/component/src/molecules/LabeledControl.jsx
// component=LabeledControl
import figma from 'figma'

// LabeledControl variant="kolbox": label and control slots. (F4, 2026-11-19)
const instance = figma.selectedInstance
const label = instance.getSlot('label')
const control = instance.getSlot('control')
const horizontal = instance.getEnum('horizontal', { true: true, false: false })
const controlFirst = instance.getEnum('control first', { false: false, true: true })
const example = figma.code`<LabeledControl variant="kolbox" label={${label}}${horizontal ? ' horizontal' : ''}${controlFirst ? ' controlFirst' : ''}>${control}</LabeledControl>`

export default {
  example,
  imports: ["import { LabeledControl } from \"@kolkrabbi/kol-component\""],
  id: 'LabeledControlKolbox',
  metadata: { nestable: true },
}
