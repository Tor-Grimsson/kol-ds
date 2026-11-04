import { Table, Pill } from '@kolkrabbi/kol-component'

export const stage = 'full'

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

export const variants = ['default', 'simple', 'float']

/* float (W8 rows 115 · 116): the analytics table (mono, a share column) and the catalog on its sheet (cover · title · status) */
const REF = [['Direct / none', '5,280', '41.0%'], ['Google', '3,410', '26.5%'], ['github.com', '2,136', '16.6%'], ['Are.na', '1,158', '9.0%'], ['Other sources', '880', '6.8%']]
  .map(([referrer, visitors, share], id) => ({ id, referrer, visitors, share }))
const BOOKS = [
  ['The Waves', 'Virginia Woolf', 'Fiction', 'Reading · 42%', 'Today', '#8fa6b8'],
  ['A Room of One’s Own', 'Virginia Woolf', 'Essays', 'Reading · 18%', 'Today', '#c9785a'],
  ['The Garden Party', 'Katherine Mansfield', 'Fiction', 'Unread', 'Oct 29, 2026', '#d9b45a'],
  ['The Metamorphosis', 'Franz Kafka', 'Fiction', 'Finished', 'Oct 27, 2026', '#9c8fb8'],
].map(([title, author, genre, status, added, cover], id) => ({ id, title, author, genre, format: 'EPUB', status, added, cover }))

function FloatTables() {
  return (
    <div className="flex w-full flex-col gap-10">
      <Table variant="float" caption="Referrers" width="column" className="max-w-[620px]" rows={REF} columns={[
        { accessor: 'referrer', header: 'Referrer', style: { width: '70%' } },
        { accessor: 'visitors', header: 'Visitors', align: 'right' },
        { accessor: 'share', header: 'Share', align: 'right' },
      ]} />
      <Table variant="float" framed caption="Books" width="column" className="max-w-[940px]" rows={BOOKS} columns={[
        { accessor: 'title', header: 'Title', sans: true, sortable: true, render: (r) => (
          <span className="inline-flex items-center gap-3"><span className="inline-block h-6 w-[18px] shrink-0 rounded-[2px]" style={{ background: r.cover }} />{r.title}</span>
        ) },
        { accessor: 'author', header: 'Author', sans: true },
        { accessor: 'genre', header: 'Genre', sans: true },
        { accessor: 'format', header: 'Format' },
        { accessor: 'status', header: 'Reading status', render: (r) => <Pill variant="float">{r.status}</Pill> },
        { accessor: 'added', header: 'Date added', sans: true, sortable: true },
      ]} />
    </div>
  )
}

export default function TablePreview({ variant = 'default' }) {
  if (variant === 'float') return <FloatTables />
  return <Table caption="Color tokens" columns={columns} rows={rows} variant={variant} />
}
