// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=22-34
// source=packages/component/src/molecules/LabeledControl.jsx
// component=LabeledControl
import figma from 'figma'

const instance = figma.selectedInstance
const variant = instance.getEnum('variant', { "default": "default", "panel": "panel" })

export default {
  example: figma.code`<LabeledControl label="Columns" variant="${variant}">{control}</LabeledControl>`,
  imports: ["import { LabeledControl } from \"@kolkrabbi/kol-component\""],
  id: 'LabeledControl',
}
