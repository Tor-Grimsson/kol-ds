import { Table } from '@kolkrabbi/kol-component'

const columns = [
  { header: 'Token', accessor: 'token', className: 'kol-table-cell-title' },
  { header: 'Value', accessor: 'value' },
  { header: 'Usage', accessor: 'usage' },
]

const rows = [
  { id: 1, token: '--kol-fg-default', value: '#121215', usage: 'Primary text' },
  { id: 2, token: '--kol-bg-subtle', value: '#f2f2f2', usage: 'Surface' },
  { id: 3, token: '--kol-accent', value: '#3b5bdb', usage: 'Links, focus' },
]

export const Default = () => <Table caption="Design tokens" columns={columns} rows={rows} />

export const Simple = () => (
  <Table caption="Design tokens" columns={columns} rows={rows} variant="simple" />
)
