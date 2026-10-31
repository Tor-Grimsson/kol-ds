// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=79-162
// source=packages/component/src/atoms/Label.jsx
// component=Label
import figma from 'figma'

const instance = figma.selectedInstance
const label = instance.getString('label')

export default {
  example: figma.code`<Label htmlFor={id} className="kol-helper-12">${label}</Label>`,
  imports: ["import { Label } from \"@kolkrabbi/kol-component\""],
  id: 'Label',
}
