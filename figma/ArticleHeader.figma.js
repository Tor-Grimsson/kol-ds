// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=53-285
// source=packages/content/src/ArticleHeader.jsx
// component=ArticleHeader
import figma from 'figma'
const instance = figma.selectedInstance
const hero = instance.getEnum('heroImage', { 'true': true, 'false': false })

export default {
  example: figma.code`<ArticleHeader tags={tags} title={title} authorName={authorName} authorTitle={authorTitle} date={date} readingTime={readingTime} excerpt={excerpt}${hero ? ' heroImage={heroImage}' : ''} />`,
  imports: ["import { ArticleHeader } from \"@kolkrabbi/kol-content\""],
  id: 'ArticleHeader',
}
