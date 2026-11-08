// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=52-308
// source=packages/component/src/molecules/ContentCard.jsx
// component=ContentCard
import figma from 'figma'
// rebuilt 2026-11-07: ContentMedia (cover) + ContentText (the plate's type ramp); overlays and verbs are the call site's
const instance = figma.selectedInstance
const variant = instance.getEnum('variant', { "article": "article", "app": "app", "catalog": "catalog", "file": "file", "slide": "slide", "work": "work" })
const hero = instance.getEnum('hero', { "true": true, "false": false })
export default {
  example: variant === 'work'
    ? figma.code`<ContentCard variant="work" ratio="auto" title={title} meta={meta} media={media} href={href} />`
    : variant === 'article'
    ? figma.code`<ContentCard variant="article"${hero ? ' hero' : ''} media={media} eyebrow={eyebrow} title={title} body={body} date={date} href={href} />`
    : figma.code`<ContentCard variant="${variant}" media={cover} title={title} date={savedAt} size={bytes} verbs={verbs} />`,
  imports: ["import { ContentCard } from \"@kolkrabbi/kol-component\""],
  id: 'ContentCard',
}
