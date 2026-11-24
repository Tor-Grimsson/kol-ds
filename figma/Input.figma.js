// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=9-20
// source=packages/component/src/atoms/Input.jsx
// component=Input
import figma from 'figma'

const instance = figma.selectedInstance
// variant default · property × size xs · sm · md (2026-11-07, the values the code uses). Color is the instance's `tone` mode
// (filled = primary, outline = outline — the code's tone aliases), which Code Connect cannot read.
const variant = instance.getEnum('variant', { "default": "default", "property": "property", "float": "float", "outline": "outline", "filled": "filled" })
const size = instance.getEnum('size', { "xs": "xs", "sm": "sm", "md": "md" })
const sz = size === 'md' ? '' : ` size="${size}"`
const dis = instance.getEnum('state', { "rest": "", "focus": "", "disabled": " disabled" })
// W9 2026-11-12: the frame is the field; `leading` and `trailing` are SLOTS (icon or prefix · suffix, clear, unit)
const leading = instance.getSlot('leading')
const trailing = instance.getSlot('trailing')
const lead = leading ? figma.code` slotLeft={<>${leading}</>}` : ''
const aff = leading ? figma.code` affordance={<>${leading}</>}` : ''
const trail = trailing ? figma.code` slotRight={<>${trailing}</>}` : ''
export default {
  example: variant === 'property'
    ? figma.code`<Input variant="property"${sz}${aff} value={value} onChange={setValue}${trail}${dis} />`
    : figma.code`<Input${sz} value={value} onChange={setValue} placeholder="Search"${lead}${trail}${dis} />`,
  imports: ["import { Input } from \"@kolkrabbi/kol-component\""],
  id: 'Input',
}
