// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=471-14994
// source=packages/component/src/molecules/SectionCardItem.jsx
// component=SectionCardItem
import figma from 'figma'

const instance = figma.selectedInstance
const title = instance.getString('title')
const description = instance.getString('description')

export default {
  example: figma.code`<SectionCardItem title="${title}" icon={icon} visual={visual} description="${description}" href={href} />`,
  imports: ["import { SectionCardItem } from \"@kolkrabbi/kol-component\""],
  id: 'SectionCardItem',
}
