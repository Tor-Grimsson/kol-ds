// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=9-140
// source=packages/component/src/atoms/Tag.jsx
// component=Tag
import figma from 'figma'

const instance = figma.selectedInstance
const variant = instance.getEnum('variant', { "primary": "primary", "secondary": "secondary", "tertiary": "tertiary" })
const size = instance.getEnum('size', { "xs": "xs", "sm": "sm", "md": "md" })
const active = instance.getEnum('active', { "true": "true", "false": "false" })
const label = instance.getString('label').replace(/^#/, '')
const xa = active === 'true' ? ' active' : ''

export default {
  example: figma.code`<Tag variant="${variant}" size="${size}"${xa}>${label}</Tag>`,
  imports: ["import { Tag } from \"@kolkrabbi/kol-component\""],
  id: 'Tag',
}
