// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=472-15120
// source=packages/component/src/organisms/SectionSplit.jsx
// component=SectionSplit
import figma from 'figma'

/* drawn as HomeFoundry uses it: align left, ratio 5/4, height 80. breakpoint is the viewport, not a prop */
const instance = figma.selectedInstance
const eyebrow = instance.getString('eyebrow')
const headline = instance.getString('headline')
const body = instance.getString('body')

export default {
  example: figma.code`<SectionSplit align="left" ratio="5/4" height="80" eyebrow="${eyebrow}" headline="${headline}" headlineSize="heading-01" body="${body}" actions={actions} media={media} />`,
  imports: ["import { SectionSplit } from \"@kolkrabbi/kol-component\""],
  id: 'SectionSplit',
}
