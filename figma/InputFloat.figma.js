// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=1196-3062
// source=packages/component/src/atoms/Input.jsx
// component=Input (float)
import figma from 'figma'

const instance = figma.selectedInstance
// Input float (2026-11-07): the capsule on the float well — a sibling set, size sm · md.
const size = instance.getEnum('size', { "sm": "sm", "md": "md" })
const sz = size === 'md' ? '' : ` size="${size}"`
const dis = instance.getEnum('state', { "rest": "", "disabled": " disabled" })
export default {
  example: figma.code`<Input variant="float"${sz} value={value} onChange={setValue} placeholder="Search"${dis} />`,
  imports: ["import { Input } from \"@kolkrabbi/kol-component\""],
  id: 'InputFloat',
}
