// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=2323-12387
// source=packages/component/src/molecules/Menu.jsx
// component=Menu
import figma from 'figma'

// Menu variant="kolbox": its MenuRow kolbox rows become one group. (F4, 2026-11-19)
const instance = figma.selectedInstance
const rows = instance.findLayers((n) => n.name === 'MenuRow kolbox' && n.type === 'INSTANCE')
  .filter((r) => r.getPropertyValue('type') === 'row')
  .map((r) => `{ label: '${r.getString('label')}' }`).join(', ')
const example = figma.code`<Menu variant="kolbox" anchor={anchor} open onClose={onClose} groups={[[${rows}]]} />`

export default {
  example,
  imports: ["import { Menu } from \"@kolkrabbi/kol-component\""],
  id: 'MenuKolbox',
  metadata: { nestable: true },
}
