// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=20-48
// source=packages/component/src/atoms/Avatar.jsx
// component=Avatar
import figma from 'figma'

const instance = figma.selectedInstance
const size = instance.getEnum('size', { "sm": "sm", "md": "md", "lg": "lg", "xl": "xl" })

export default {
  example: figma.code`<Avatar initial="A" size="${size}" />`,
  imports: ["import { Avatar } from \"@kolkrabbi/kol-component\""],
  id: 'Avatar',
}
