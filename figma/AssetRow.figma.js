// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=559-19068
// source=packages/dashboards/src/cards/AssetRow.jsx
// component=AssetRow
import figma from 'figma'

const instance = figma.selectedInstance
const selected = instance.getEnum('selected', { "true": "true", "false": "false" })

export default {
  example: figma.code`<AssetRow src={thumb} name="Luminous portrait" meta="1200 × 1500 · PNG"${selected === 'true' ? ' selected' : ''} onSelect={select} />`,
  imports: ["import { AssetRow } from \"@kolkrabbi/kol-dashboards\""],
  id: 'AssetRow',
}
