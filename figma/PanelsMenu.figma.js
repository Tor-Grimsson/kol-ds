// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=581-20128
// source=packages/component/src/molecules/PanelsMenu.jsx
// component=PanelsMenu
import figma from 'figma'
const instance = figma.selectedInstance
const title = instance.getString('title')
export default {
  example: figma.code`<PanelsMenu title="${title}" panels={[{ id: 'side', name: 'Side panel', meta: 'Properties', state: 'Hidden', action: 'Show', primary: true }, { id: 'index', name: 'Task index', meta: '5 tasks', state: 'Folded', action: 'Expand' }]} onAction={toggle} />`,
  imports: ["import { PanelsMenu } from \"@kolkrabbi/kol-component\""],
  id: 'PanelsMenu',
}
