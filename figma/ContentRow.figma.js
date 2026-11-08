// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=529-18982
// source=packages/component/src/molecules/ContentRow.jsx
// component=ContentRow
import figma from 'figma'
// rebuilt 2026-11-07: ContentMedia (thumb) + ContentText form row; float is the link row (no ContentText)
const instance = figma.selectedInstance
const variant = instance.getEnum('variant', { "work": "work", "article": "article", "float": "float", "app": "app", "catalog": "catalog", "slide": "slide" })
export default {
  example: variant === 'float'
    ? figma.code`<ContentRow variant="float" title="Instagram · @kolkrabbi_" url="www.instagram.com/kolkrabbi_" href="https://www.instagram.com/kolkrabbi_" />`
    : variant === 'work'
    ? figma.code`<ContentRow variant="work" media={media} title={title} tags={tags} meta={meta} date={date} body={body} href={href} />`
    : figma.code`<ContentRow variant="${variant}" media={media} title={title} date={date} size={size} href={href} />`,
  imports: ["import { ContentRow } from \"@kolkrabbi/kol-component\""],
  id: 'ContentRow',
}
