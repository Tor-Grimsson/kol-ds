// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=21-42
// source=packages/component/src/atoms/Textarea.jsx
// component=Textarea
import figma from 'figma'

const instance = figma.selectedInstance
// size sm · md (2026-11-07); filled is the default look; color is the instance's `tone` mode.
const size = instance.getEnum('size', { "sm": "sm", "md": "md" })
const sz = size === 'md' ? '' : ` size="${size}"`
const dis = instance.getEnum('state', { "rest": "", "disabled": " disabled" })
export default {
  example: figma.code`<Textarea${sz} value={value} onChange={setValue}${dis} />`,
  imports: ["import { Textarea } from \"@kolkrabbi/kol-component\""],
  id: 'Textarea',
}
