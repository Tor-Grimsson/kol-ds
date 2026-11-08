// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=1381-11025
// source=packages/component/src/organisms/ToolPalette.jsx
// component=ToolPalette
import figma from 'figma'

const instance = figma.selectedInstance
const orientation = instance.getEnum('orientation', { "horizontal": "horizontal", "vertical": "vertical" })
const o = orientation === 'vertical' ? ' orientation="vertical"' : ''

export default {
  example: figma.code`<ToolPalette items={items} activeId={tool} onSelect={setTool} onAction={runAction}${o} />`,
  imports: ["import { ToolPalette } from \"@kolkrabbi/kol-component\""],
  id: 'ToolPalette',
}
