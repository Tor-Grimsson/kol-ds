// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=1356-7698
// source=packages/component/src/molecules/TabsRow.jsx
// component=TabsRow
import figma from 'figma'

const instance = figma.selectedInstance
const shape = instance.getEnum('shape', { "pill": "pill", "bar": "bar" })
const surface = instance.getEnum('surface', { "solid": "solid", "glass-dark": "glass-dark", "glass-light": "glass-light" })
const labels = instance.getEnum('labels', { "true": " labels", "false": "" })
const dock = instance.getEnum('dock', { "true": " dock", "false": "" })
const shadow = instance.getEnum('shadow', { "true": " shadow", "false": "" })
const edge = instance.getEnum('edge', { "top": ' edge="top"', "bottom": "" })

export default {
  example: figma.code`<TabsRow variant="stacked" placement="phone" shape="${shape}" surface="${surface}"${labels}${dock}${shadow}${edge} tabs={tabs} value={value} onChange={onChange} />`,
  imports: ["import { TabsRow } from \"@kolkrabbi/kol-component\""],
  id: 'TabsRowStacked',
}
