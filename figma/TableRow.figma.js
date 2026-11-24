// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=49-277
// source=packages/component/src/organisms/Table.jsx
// component=Table
import figma from 'figma'

// TableRow is a part of Table: in code a column is one entry in `columns`, not a component of its own
// kolbox (F4, 2026-11-19): the variant=kolbox member folded into this set.
const instance = figma.selectedInstance
const kolbox = instance.getPropertyValue('variant') === 'kolbox'
const head = instance.getPropertyValue('head') === 'true'
const row = kolbox && !head ? `{ name: '${instance.getString('name')}', modified: '${instance.getString('last modified')}', created: '${instance.getString('created')}' }` : ''

export default {
  example: kolbox ? figma.code`<Table variant="kolbox" rows={[${row}]} />` : figma.code`<Table
  columns={[
    { accessor: 'name', header: 'Name' },
    { accessor: 'kind', header: 'Kind' },
    { accessor: 'uses', header: 'Uses' },
  ]}
  rows={rows}
/>`,
  imports: ["import { Table } from \"@kolkrabbi/kol-component\""],
  id: 'TableRow',
}
