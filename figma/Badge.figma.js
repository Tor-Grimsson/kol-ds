// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=20-105
// source=packages/component/src/atoms/Badge.jsx
// component=Badge
import figma from 'figma'

const instance = figma.selectedInstance
const variant = instance.getEnum('variant', { "default": "default", "secondary": "secondary", "outline": "outline", "success": "success", "warning": "warning", "error": "error", "info": "info" })
const size = instance.getEnum('size', { "xs": "xs", "sm": "sm", "md": "md", "lg": "lg" })
const label = instance.getString('label')

export default {
  example: figma.code`<Badge variant="${variant}" size="${size}">${label}</Badge>`,
  imports: ["import { Badge } from \"@kolkrabbi/kol-component\""],
  id: 'Badge',
}
