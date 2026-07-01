import { Table } from '@kolkrabbi/kol-component'

const columns = [
  { accessor: 'token', header: 'Token' },
  { accessor: 'value', header: 'Value' },
  {
    accessor: 'swatch',
    header: 'Sample',
    render: (row) => (
      <span
        className="inline-block h-4 w-4 rounded-sm align-middle"
        style={{ background: row.value, outline: '1px solid var(--kol-fg-16)' }}
      />
    ),
  },
]

const rows = [
  { id: 1, token: 'fg-96', value: '#F5F5F5' },
  { id: 2, token: 'fg-48', value: '#7A7A7A' },
  { id: 3, token: 'accent', value: '#AD5038' },
]

export default function TableDemo() {
  return (
    <div className="flex flex-col gap-8">
      <Table caption="Color tokens" columns={columns} rows={rows} />
      <Table caption="Color tokens, simple" columns={columns} rows={rows} variant="simple" />
    </div>
  )
}
