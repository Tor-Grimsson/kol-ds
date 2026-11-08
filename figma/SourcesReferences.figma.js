// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=1805-58451
// source=packages/content/src/SourcesReferences.jsx
// component=SourcesReferences
import figma from 'figma'

const instance = figma.selectedInstance
const title = instance.getString('title')

export default {
  example: figma.code`<SourcesReferences title="${title}" sources={[{ title: '…', note: '…', href: '…' }]} />`,
  imports: ["import { SourcesReferences } from \"@kolkrabbi/kol-content\""],
  id: 'SourcesReferences',
}
