// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=583-20270
// source=packages/component/src/molecules/LayerRow.jsx
// component=LayerRow
import figma from 'figma'
// head=true is variant="head": the selected object's line (glyph · name · eye), PropertyRail's `selected` (W8.2)
const instance = figma.selectedInstance
const selected = instance.getEnum('selected', { "false": "false", "true": "true" })
const head = instance.getEnum('head', { "false": false, "true": true })
const name = instance.getString('name')

export default {
  example: head
    ? figma.code`<LayerRow variant="head" icon={icon} name="${name}" visible={visible} onToggleVisible={toggleVisible} />`
    : figma.code`<LayerRow name="Orbit field"${selected === 'true' ? ' selected' : ''} visible={visible} onToggleVisible={toggleVisible} locked={locked} onToggleLock={toggleLock} onClick={select} />`,
  imports: ["import { LayerRow } from \"@kolkrabbi/kol-component\""],
  id: 'LayerRow',
}
