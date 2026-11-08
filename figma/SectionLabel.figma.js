// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=79-179
// source=packages/component/src/atoms/SectionLabel.jsx
// component=SectionLabel
import figma from 'figma'

const instance = figma.selectedInstance
const label = instance.getString('label')

export default {
  example: figma.code`<SectionLabel text="${label}" />`,
  imports: ["import { SectionLabel } from \"@kolkrabbi/kol-component\""],
  id: 'SectionLabel',
}
