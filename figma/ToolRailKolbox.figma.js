// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=2323-12910
// source=packages/shell/src/ToolRail.jsx
// component=ToolRail
import figma from 'figma'

// ToolRail variant="kolbox" (kolbox's ToolDock): its ToolRailSlot cells become `tools`. (F4, 2026-11-19)
const instance = figma.selectedInstance
const icons = instance.findLayers((n) => n.name === 'ToolRailSlot' && n.type === 'INSTANCE')
  .map((c) => { const s = c.getInstanceSwap('icon glyph'); return s && s.type === 'INSTANCE' ? s.getPropertyValue('name') : null })
  .filter(Boolean)
const tools = icons.map((i) => `{ id: '${i}', icon: '${i}', label: '${i}' }`).join(', ')
const example = figma.code`<ToolRail variant="kolbox" tools={[${tools}]} />`

export default {
  example,
  imports: ["import { ToolRail } from \"@kolkrabbi/kol-shell\""],
  id: 'ToolRailKolbox',
  metadata: { nestable: true },
}
