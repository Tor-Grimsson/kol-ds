// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=198-700
// source=packages/framework/src/DocumentIndex.jsx
// component=DocumentIndex
import figma from 'figma'

const instance = figma.selectedInstance
const variant = instance.getEnum('variant', { "cards": "cards", "table": "table" })
const v = variant === 'table' ? ' variant="table"' : ''

export default {
  example: figma.code`<DocumentIndex${v} title="Lab" lede="…" rows={rows} onNavigate={navigate} />`,
  imports: ["import { DocumentIndex } from \"@kolkrabbi/kol-framework\""],
  id: 'DocumentIndex',
}
