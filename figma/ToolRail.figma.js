// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=569-19820
// source=packages/shell/src/ToolRail.jsx
// component=ToolRail
import figma from 'figma'

const instance = figma.selectedInstance
const surface = instance.getEnum('surface', { "solid": "solid", "glass-dark": "glass-dark", "glass-light": "glass-light" })
const sf = surface !== 'solid' ? ` surface="${surface}"` : ''
const orientation = instance.getEnum('orientation', { "vertical": "vertical", "horizontal": "horizontal" })
const more = instance.getEnum('more', { "true": "true", "false": "false" })
const extra = orientation === 'horizontal' ? ` orientation="horizontal" end={dockEnd} search={{ onPress: openSearch, kbd: '⌘K' }}` : more === 'true' ? ' more={moreTools}' : ''
export default {
  example: figma.code`<ToolRail tools={tools} value={tool} onChange={setTool}${sf}${extra} />`,
  imports: ["import { ToolRail } from \"@kolkrabbi/kol-shell\""],
  id: 'ToolRail',
}
