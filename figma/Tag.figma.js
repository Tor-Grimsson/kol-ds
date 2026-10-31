// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=9-140
// source=packages/component/src/atoms/Tag.jsx
// component=Tag
import figma from 'figma'

const instance = figma.selectedInstance
const variant = instance.getEnum('variant', { "primary": "primary", "secondary": "secondary", "tertiary": "tertiary", "inverse": "inverse" })
const size = instance.getEnum('size', { "sm": "sm", "md": "md" })
const label = instance.getString('label').replace(/^#/, '')
const data = instance.getEnum('data', { "true": "true", "false": "false" })

export default {
  example: data === 'true'
    ? figma.code`<Tag variant="${variant}" size="${size}" hash={false} className="kol-tag--data">${label}</Tag>`
    : figma.code`<Tag variant="${variant}" size="${size}">${label}</Tag>`,
  imports: ["import { Tag } from \"@kolkrabbi/kol-component\""],
  id: 'Tag',
}
