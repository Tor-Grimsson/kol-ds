// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=563-19254
// source=packages/dashboards/src/cards/RankedList.jsx
// component=RankedList
import figma from 'figma'

const instance = figma.selectedInstance
const variant = instance.getEnum('variant', { "default": "default", "float": "float" })

export default {
  example: variant === 'float'
    ? figma.code`<RankedList variant="float" rows={rows} total={931} column="Link" valueLabel="Clicks" />`
    : figma.code`<RankedList rows={rows} total={931} column="Link" valueLabel="Clicks" />`,
  imports: ["import { RankedList } from \"@kolkrabbi/kol-dashboards\""],
  id: 'RankedList',
}
