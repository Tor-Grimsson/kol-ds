// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=20-39
// source=packages/component/src/atoms/Pill.jsx
// component=Pill
import figma from 'figma'

const instance = figma.selectedInstance
const variant = instance.getEnum('variant', { "primary": "primary", "secondary": "secondary", "inverse": "inverse", "float": "float" })
const size = instance.getEnum('size', { "sm": "sm", "md": "md", "lg": "lg" })
const label = instance.getString('label')

export default {
  example: variant === 'float'
    ? figma.code`<Pill variant="float">${label}</Pill>`
    : figma.code`<Pill variant="${variant}" size="${size}">${label}</Pill>`,
  imports: ["import { Pill } from \"@kolkrabbi/kol-component\""],
  id: 'Pill',
}
