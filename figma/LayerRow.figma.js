// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=583-20270
// source=packages/component/src/molecules/LayerRow.jsx
// component=LayerRow
import figma from 'figma'
const instance = figma.selectedInstance
const selected = instance.getEnum('selected', { "false": "false", "true": "true" })

export default {
  example: figma.code`<LayerRow name="Orbit field"${selected === 'true' ? ' selected' : ''} visible={visible} onToggleVisible={toggleVisible} locked={locked} onToggleLock={toggleLock} onClick={select} />`,
  imports: ["import { LayerRow } from \"@kolkrabbi/kol-component\""],
  id: 'LayerRow',
}
