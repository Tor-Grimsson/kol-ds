// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=247-2894
// source=packages/framework/src/DocumentHeader.jsx
// component=DocumentHeader
import figma from 'figma'

export default {
  example: figma.code`<DocumentHeader title={client} tabs={tabs} value={value} onChange={navigate} menus={[{ label: 'Assets', items, current }]} />`,
  imports: ["import { DocumentHeader } from \"@kolkrabbi/kol-framework\""],
  id: 'DocumentHeader',
}
