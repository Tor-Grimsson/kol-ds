// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=261-527
// source=packages/framework/src/MarkdownPage.jsx
// component=MarkdownPage
import figma from 'figma'

const instance = figma.selectedInstance
const variant = instance.getEnum('variant', { "plain": "plain", "numbered": "numbered" })
const linkNotes = instance.getBoolean('linkNotes')
const nb = variant === 'numbered' ? ' numbered' : ''
const ln = linkNotes ? ' linkNotes' : ''

export default {
  example: figma.code`<MarkdownPage source={markdown}${nb}${ln} resolveLink={resolveLink} assetUrl={assetUrl} />`,
  imports: ["import { MarkdownPage } from \"@kolkrabbi/kol-framework\""],
  id: 'MarkdownPage',
}
