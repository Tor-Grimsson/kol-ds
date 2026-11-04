// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=471-15015
// source=packages/component/src/organisms/SectionCta.jsx
// component=SectionCta
import figma from 'figma'

/* the editorial form with rows (kolkrabbi.io's SectionCtaWrapper). breakpoint is the viewport, not a prop */
const instance = figma.selectedInstance
const eyebrow = instance.getString('eyebrow')
const promptLabel = instance.getString('promptLabel')
const heading = instance.getString('heading')
const contactLabel = instance.getString('contactLabel')
const email = instance.getString('email')

export default {
  example: figma.code`<SectionCta eyebrow="${eyebrow}" promptLabel="${promptLabel}" heading="${heading}" contactLabel="${contactLabel}" email="${email}" />`,
  imports: ["import { SectionCta } from \"@kolkrabbi/kol-component\""],
  id: 'SectionCta',
}
