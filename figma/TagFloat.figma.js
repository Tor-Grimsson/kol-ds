// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=1213-3093
// source=packages/component/src/atoms/Tag.jsx
// component=Tag
import figma from 'figma'

const instance = figma.selectedInstance
const size = instance.getEnum('size', { "sm": "sm", "md": "md" })
const active = instance.getEnum('active', { "true": "true", "false": "false" })
const label = instance.getString('label').replace(/^#/, '')
const xs = size === 'md' ? ' size="md"' : ''
const xa = active === 'true' ? ' active' : ''
const xc = instance.getBoolean('count') ? ` count={${JSON.stringify(instance.getString('countValue'))}}` : ''

export default {
  example: figma.code`<Tag variant="float"${xs}${xa}${xc}>${label}</Tag>`,
  imports: ["import { Tag } from \"@kolkrabbi/kol-component\""],
  id: 'TagFloat',
}
