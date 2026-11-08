// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=1259-12516
// source=packages/component/src/utilities/AssetPlaceholder.jsx
// component=AssetPlaceholder
import figma from 'figma'
const instance = figma.selectedInstance
const radius = instance.getEnum('radius', { "true": true, "false": false })
const note = instance.getString('note')
export default {
  example: figma.code`<AssetPlaceholder aspectRatio="16 / 9" note="${note}"${radius ? '' : ' radius={false}'} />`,
  imports: ["import { AssetPlaceholder } from \"@kolkrabbi/kol-component\""],
  id: 'AssetPlaceholder',
}
