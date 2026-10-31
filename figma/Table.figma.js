// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=23-60
// source=packages/component/src/organisms/Table.jsx
// component=Table
import figma from 'figma'

const instance = figma.selectedInstance
const variant = instance.getEnum('variant', { "default": "default", "simple": "simple" })

export default {
  example: figma.code`<Table variant="${variant}" columns={columns} rows={rows} />`,
  imports: ["import { Table } from \"@kolkrabbi/kol-component\""],
  id: 'Table',
}
