// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=2167-11003
// source=packages/component/src/molecules/Chip.jsx
// component=Chip
import figma from 'figma'

const instance = figma.selectedInstance
const title = instance.getString('title')
const meta = instance.getString('meta')
const leading = instance.getSlot('leading')
const lead = leading ? figma.code` leading={<>${leading}</>}` : ''
export default {
  example: figma.code`<Chip${lead} title="${title}" meta="${meta}" />`,
  imports: ["import { Chip } from \"@kolkrabbi/kol-component\""],
  id: 'Chip',
}
