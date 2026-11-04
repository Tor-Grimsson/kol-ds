// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=79-179
// source=packages/component/src/atoms/SectionLabel.jsx
// component=SectionLabel
import figma from 'figma'

const instance = figma.selectedInstance
const size = instance.getEnum('size', { "sm": "sm", "md": "md", "lg": "lg" })
const label = instance.getString('label')
const variant = instance.getEnum('variant', { "default": "default", "float": "float" })

export default {
  example: variant === 'float' ? figma.code`<SectionLabel variant="float" text="APPEARANCE" onAdd={add} />` : figma.code`<SectionLabel size="${size}" text="${label}" />`,
  imports: ["import { SectionLabel } from \"@kolkrabbi/kol-component\""],
  id: 'SectionLabel',
}
