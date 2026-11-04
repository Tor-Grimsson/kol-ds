// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=529-18982
// source=packages/component/src/molecules/ContentRow.jsx
// component=ContentRow
import figma from 'figma'

const instance = figma.selectedInstance
const variant = instance.getEnum('variant', { article: 'article', work: 'work', float: 'float' })

export default {
  example: variant === 'float' ? figma.code`<ContentRow variant="float" title="Instagram · @kolkrabbi_" url="www.instagram.com/kolkrabbi_" href="https://www.instagram.com/kolkrabbi_" />`
    : variant === 'work'
    ? figma.code`<ContentRow variant="work" thumb="fill" media={media} title="${instance.getString('title')}" tags={tags} meta="${instance.getString('meta')}" date="${instance.getString('date')}" body="${instance.getString('body')}" href={href} />`
    : figma.code`<ContentRow variant="article" media={media} title={title} body={body} date={date} size={size} href={href} />`,
  imports: ["import { ContentRow } from \"@kolkrabbi/kol-component\""],
  id: 'ContentRow',
}
