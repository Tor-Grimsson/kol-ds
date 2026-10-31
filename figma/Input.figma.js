// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=9-20
// source=packages/component/src/atoms/Input.jsx
// component=Input
import figma from 'figma'

const instance = figma.selectedInstance
const variant = instance.getEnum('variant', { "filled": "filled", "outline": "outline", "float": "float" })
const size = instance.getEnum('size', { "sm": "sm", "md": "md", "lg": "lg" })

export default {
  example: figma.code`<Input variant="${variant}" size="${size}" value={value} onChange={setValue} placeholder="Placeholder" />`,
  imports: ["import { Input } from \"@kolkrabbi/kol-component\""],
  id: 'Input',
}
