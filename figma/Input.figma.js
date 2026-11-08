// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=9-20
// source=packages/component/src/atoms/Input.jsx
// component=Input
import figma from 'figma'

const instance = figma.selectedInstance
// variant default · property × size xs · sm · md (2026-11-07, the values the code uses). Color is the instance's `tone` mode
// (filled = primary, outline = outline — the code's tone aliases), which Code Connect cannot read.
const variant = instance.getEnum('variant', { "default": "default", "property": "property" })
const size = instance.getEnum('size', { "xs": "xs", "sm": "sm", "md": "md" })
const sz = size === 'md' ? '' : ` size="${size}"`
const dis = instance.getEnum('state', { "rest": "", "disabled": " disabled" })
export default {
  example: variant === 'property'
    ? figma.code`<Input variant="property"${sz} affordance="X" value={value} onChange={setValue}${dis} />`
    : figma.code`<Input${sz} value={value} onChange={setValue} placeholder="Search"${dis} />`,
  imports: ["import { Input } from \"@kolkrabbi/kol-component\""],
  id: 'Input',
}
