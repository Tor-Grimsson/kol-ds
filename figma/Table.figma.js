// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=23-60
// source=packages/component/src/organisms/Table.jsx
// component=Table
import figma from 'figma'
const instance = figma.selectedInstance
const variant = instance.getEnum('variant', { "default": "default", "simple": "simple", "float": "float" })

export default {
  example: variant === 'float' ? figma.code`<Table variant="float" columns={[{ accessor: 'referrer', header: 'Referrer' }, { accessor: 'visitors', header: 'Visitors', align: 'right' }, { accessor: 'share', header: 'Share', align: 'right' }]} rows={rows} />` : figma.code`<Table variant="${variant}" columns={columns} rows={rows} />`,
  imports: ["import { Table } from \"@kolkrabbi/kol-component\""],
  id: 'Table',
}
