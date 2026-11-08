// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=577-20015
// source=packages/component/src/atoms/Textarea.jsx
// component=Textarea (float)
import figma from 'figma'

const instance = figma.selectedInstance
export default {
  example: figma.code`<Textarea variant="float" value={value} onChange={setValue} placeholder="Add a note…" />`,
  imports: ["import { Textarea } from \"@kolkrabbi/kol-component\""],
  id: 'TextareaFloat',
}
