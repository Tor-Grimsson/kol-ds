// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=197-1153
// source=packages/component/src/molecules/SectionText.jsx
// component=SectionText
import figma from 'figma'

const instance = figma.selectedInstance
const variant = instance.getEnum('variant', { "page": "page", "app": "app", "section": "section", "content": "content", "document": "document" })
const eyebrow = instance.getBoolean('eyebrow') ? figma.code` eyebrow="${instance.getString('eyebrowText')}"` : ''
const headline = instance.getString('headline')
const body = instance.getBoolean('lede') ? figma.code` body="${instance.getString('body')}"` : ''

export default {
  example: figma.code`<SectionText variant="${variant}"${eyebrow} headline="${headline}"${body} />`,
  imports: ["import { SectionText } from \"@kolkrabbi/kol-component\""],
  id: 'SectionText',
}
