// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=1356-7698
// source=packages/component/src/molecules/TabsRow.jsx
// component=TabsRow
import figma from 'figma'

const instance = figma.selectedInstance
const shape = instance.getEnum('bar', { "false": "pill", "true": "bar" })
const labels = instance.getEnum('labels', { "true": " labels", "false": "" })
const dock = instance.getEnum('dock', { "true": " dock", "false": "" })
const shadow = instance.getEnum('shadow', { "true": " shadow", "false": "" })
const edge = instance.getEnum('top', { "false": "", "true": ' edge="top"' })

export default {
  example: figma.code`<TabsRow variant="stacked" placement="phone" shape="${shape}"${labels}${dock}${shadow}${edge} tabs={tabs} value={value} onChange={onChange} />`,
  imports: ["import { TabsRow } from \"@kolkrabbi/kol-component\""],
  id: 'TabsRowStacked',
}
