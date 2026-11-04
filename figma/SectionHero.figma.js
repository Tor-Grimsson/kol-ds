// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=472-15141
// source=packages/component/src/organisms/SectionHero.jsx
// component=SectionHero
import figma from 'figma'

/* drawn as kolkrabbi.io/stack uses it: variant media, overlay 80, veil, justify end, panel = SectionText, foot slot. breakpoint is the viewport, not a prop */
const instance = figma.selectedInstance
const headline = instance.getString('headline')
const body = instance.getString('body')
const foot = instance.getBoolean('showFoot') ? ' foot={foot} overlap={288}' : ''

export default {
  example: figma.code`<SectionHero fullBleed height="h-[90vh]" justify="end" veil overlayOpacity={80} media={media} panel={<SectionText align="center" headline="${headline}" headlineSize="display-01" headlineCase="upper" body="${body}" />}${foot} />`,
  imports: ["import { SectionHero, SectionText } from \"@kolkrabbi/kol-component\""],
  id: 'SectionHero',
}
