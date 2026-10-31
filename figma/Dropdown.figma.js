// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=9-63
// source=packages/component/src/molecules/Dropdown.jsx
// component=Dropdown
import figma from 'figma'

const instance = figma.selectedInstance
const variant = instance.getEnum('variant', { "filled": "filled", "outline": "outline", "raised": "raised" })
const size = instance.getEnum('size', { "sm": "sm", "md": "md", "lg": "lg" })

export default {
  example: figma.code`<Dropdown variant="${variant}" size="${size}" options={options} value={value} onChange={setValue} />`,
  imports: ["import { Dropdown } from \"@kolkrabbi/kol-component\""],
  id: 'Dropdown',
}
