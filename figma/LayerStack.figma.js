// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=1381-11269
// source=packages/component/src/organisms/LayerStack.jsx
// component=LayerStack
import figma from 'figma'

const instance = figma.selectedInstance
const multi = instance.getEnum('multi', { "true": true, "false": false })
const g = multi ? ' onGroup={group}' : ''

export default {
  example: figma.code`<LayerStack layers={layers} selectedIds={selectedIds} onSelect={select} onToggleSelect={toggleSelect} onToggleVisible={toggleVisible} onToggleLocked={toggleLocked} onRename={rename} onReorder={reorder}${g} />`,
  imports: ["import { LayerStack } from \"@kolkrabbi/kol-component\""],
  id: 'LayerStack',
}
