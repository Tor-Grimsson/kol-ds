// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=1264-5245
// source=packages/component/src/molecules/ContentText.jsx
// component=ContentText
import figma from 'figma'
const instance = figma.selectedInstance
const variant = instance.getEnum('variant', { "article": "article", "file": "file", "slide": "slide", "catalog": "catalog", "showcase": "showcase" })
const form = instance.getEnum('form', { "card": "card", "row": "row", "hero": "hero" })
const title = instance.getString('title')
export default {
  example: figma.code`<ContentText variant="${variant}" form="${form}" title="${title}" eyebrow={eyebrow} body={body} date={date} size={size} meta={meta} tags={tags} />`,
  imports: ["import { ContentText } from \"@kolkrabbi/kol-component\""],
  id: 'ContentText',
}
