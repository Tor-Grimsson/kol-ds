// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=21-42
// source=packages/component/src/atoms/Textarea.jsx
// component=Textarea
import figma from 'figma'

const instance = figma.selectedInstance
const variant = instance.getEnum('variant', { "filled": "filled", "outline": "outline" })
const size = instance.getEnum('size', { "xs": "xs", "sm": "sm", "md": "md", "lg": "lg" })

export default {
  example: figma.code`<Textarea variant="${variant}" size="${size}" value={value} onChange={setValue} placeholder="…" />`,
  imports: ["import { Textarea } from \"@kolkrabbi/kol-component\""],
  id: 'Textarea',
}
