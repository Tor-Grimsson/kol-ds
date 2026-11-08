// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=20-105
// source=packages/component/src/atoms/Badge.jsx
// component=Badge
import figma from 'figma'

const instance = figma.selectedInstance
const variant = instance.getEnum('variant', { "default": "default", "secondary": "secondary", "outline": "outline" })
const size = instance.getEnum('size', { "xs": "xs", "sm": "sm", "md": "md" })
const label = instance.getString('label')
const iconOn = instance.getBoolean('icon')
const xv = variant === 'default' ? '' : ` variant="${variant}"`
const xs = size === 'md' ? '' : ` size="${size}"`
const xi = iconOn ? ' icon="check"' : ''

export default {
  example: figma.code`<Badge${xv}${xs}${xi}>${label}</Badge>`,
  imports: ["import { Badge } from \"@kolkrabbi/kol-component\""],
  id: 'Badge',
}
