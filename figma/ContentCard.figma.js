// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=52-308
// source=packages/component/src/molecules/ContentCard.jsx
// component=ContentCard
import figma from 'figma'
const instance = figma.selectedInstance
const hero = instance.getEnum('hero', { 'true': true, 'false': false })
const eyebrow = instance.getBoolean('eyebrow') ? ` eyebrow="${instance.getString('eyebrowText')}"` : ''

export default {
  example: figma.code`<ContentCard variant="article"${hero ? ' hero' : ''} media={media}${eyebrow} title={title} body={body} href={href} />`,
  imports: ["import { ContentCard } from \"@kolkrabbi/kol-component\""],
  id: 'ContentCard',
}
