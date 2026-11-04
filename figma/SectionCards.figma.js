// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=472-15087
// source=packages/component/src/organisms/SectionCards.jsx
// component=SectionCards
import figma from 'figma'

/* the features slot holds SectionCardItem; in code they are the features array. breakpoint is the viewport, not a prop */
const instance = figma.selectedInstance
const headline = instance.getString('headline')
const body = instance.getString('body')

export default {
  example: figma.code`<SectionCards headline="${headline}" body="${body}" features={features} actions={actions} />`,
  imports: ["import { SectionCards } from \"@kolkrabbi/kol-component\""],
  id: 'SectionCards',
}
