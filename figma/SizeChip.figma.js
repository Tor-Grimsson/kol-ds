// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=576-19998
// source=packages/component/src/atoms/SizeChip.jsx
// component=SizeChip
import figma from 'figma'
const instance = figma.selectedInstance
const active = instance.getEnum('active', { "true": "true", "false": "false" })
const letter = instance.getString('letter')
export default {
  example: active === 'true'
    ? figma.code`<SizeChip active onClick={() => setSize('${letter}')}>${letter}</SizeChip>`
    : figma.code`<SizeChip onClick={() => setSize('${letter}')}>${letter}</SizeChip>`,
  imports: ["import { SizeChip } from \"@kolkrabbi/kol-component\""],
  id: 'SizeChip',
}
