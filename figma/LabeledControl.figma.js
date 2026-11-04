// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=22-34
// source=packages/component/src/molecules/LabeledControl.jsx
// component=LabeledControl
import figma from 'figma'

const instance = figma.selectedInstance
const variant = instance.getEnum('variant', { "default": "default", "panel": "panel", "float": "float" })

export default {
  example: variant === 'float'
    ? figma.code`<LabeledControl variant="float" label="Email"><Input variant="float" value={value} onChange={setValue} width="100%" /></LabeledControl>`
    : figma.code`<LabeledControl label="Columns" variant="${variant}">{control}</LabeledControl>`,
  imports: ["import { LabeledControl } from \"@kolkrabbi/kol-component\""],
  id: 'LabeledControl',
}
