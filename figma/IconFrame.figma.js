// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=78-166
// source=packages/component/src/atoms/IconFrame.jsx
// component=IconFrame
import figma from 'figma'

const instance = figma.selectedInstance
const variant = instance.getEnum('variant', { "secondary": "secondary", "primary": "primary", "outline": "outline", "ghost": "ghost" })
const size = instance.getEnum('size', { "sm": "sm", "md": "md", "lg": "lg" })

export default {
  example: figma.code`<IconFrame name="search" variant="${variant}" size="${size}" />`,
  imports: ["import { IconFrame } from \"@kolkrabbi/kol-component\""],
  id: 'IconFrame',
}
