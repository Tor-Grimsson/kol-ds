// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=2323-11603
// source=packages/shell/src/ToolRail.jsx
// component=ToolRailSlot
import figma from 'figma'

// ToolRailSlot (new with kolbox, ToolRail's member, its DockCell). (F4, 2026-11-19)
const instance = figma.selectedInstance
const glyph = (prop) => {
  const s = instance.getInstanceSwap(prop)
  return s && s.type === 'INSTANCE' ? s.getPropertyValue('name') : undefined
}
const icon = glyph('icon glyph')
const active = instance.getEnum('state', { default: false, active: true, hover: false })
const example = figma.code`<ToolRailSlot icon="${icon}" label="${icon}"${active ? ' active' : ''} />`

export default {
  example,
  imports: ["import { ToolRailSlot } from \"@kolkrabbi/kol-shell\""],
  id: 'ToolRailSlot',
  metadata: { nestable: true },
}
