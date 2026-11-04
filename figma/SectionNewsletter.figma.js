// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=471-15049
// source=packages/component/src/organisms/SectionNewsletter.jsx
// component=SectionNewsletter
import figma from 'figma'

/* drawn with kolkrabbi.io's HomeSignup settings: controlSize lg, submitVariant secondary. breakpoint is the viewport, not a prop */
const instance = figma.selectedInstance
const headline = instance.getString('headline')
const body = instance.getString('body')

export default {
  example: figma.code`<SectionNewsletter fullBleed background="none" controlSize="lg" submitVariant="secondary" headline="${headline}" body="${body}" placeholder="Your mail address" submitLabel="Subscribe" onSubmit={onSubmit} />`,
  imports: ["import { SectionNewsletter } from \"@kolkrabbi/kol-component\""],
  id: 'SectionNewsletter',
}
