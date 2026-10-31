// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=57-259
// source=packages/component/src/organisms/ContentCollection.jsx
// component=ContentCollection
import figma from 'figma'

export default {
  example: figma.code`<ContentCollection form="grid">{items.map((item) => <ContentItem key={item.title} form="card" {...item} />)}</ContentCollection>`,
  imports: ["import { ContentCollection, ContentItem } from \"@kolkrabbi/kol-component\""],
  id: 'ContentCollection',
}
