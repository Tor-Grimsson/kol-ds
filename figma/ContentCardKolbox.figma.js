// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=2323-12558
// source=packages/component/src/molecules/ContentCard.jsx
// component=ContentCard
import figma from 'figma'

// ContentCard variant="kolbox" (kolbox's FileCard). (F4, 2026-11-19)
const instance = figma.selectedInstance
const name = instance.getString('name')
const example = figma.code`<ContentCard variant="kolbox" file={{ name: '${name}' }} onOpen={onOpen} />`

export default {
  example,
  imports: ["import { ContentCard } from \"@kolkrabbi/kol-component\""],
  id: 'ContentCardKolbox',
  metadata: { nestable: true },
}
