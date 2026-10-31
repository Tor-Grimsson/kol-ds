// url=https://www.figma.com/design/n48kE2bJtrFjl7wxst30xH/library--kol-ds-ui?node-id=49-277
// source=packages/component/src/organisms/Table.jsx
// component=Table
import figma from 'figma'

// TableRow is a part of Table: in code a column is one entry in `columns`, not a component of its own
export default {
  example: figma.code`<Table
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
