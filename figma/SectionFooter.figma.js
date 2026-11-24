// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=2169-1251
// source=packages/component/src/atoms/SectionFooter.jsx
// component=SectionFooter
import figma from 'figma'

const instance = figma.selectedInstance
const label = instance.getString('label')
const leading = instance.getSlot('leading')
const trailing = instance.getSlot('trailing')
const lead = leading ? figma.code` leading={<>${leading}</>}` : ''
const trail = trailing ? figma.code` trailing={<>${trailing}</>}` : ''
export default {
  example: figma.code`<SectionFooter${lead} label="${label}"${trail} />`,
  imports: ["import { SectionFooter } from \"@kolkrabbi/kol-component\""],
  id: 'SectionFooter',
}
