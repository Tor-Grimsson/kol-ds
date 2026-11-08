/* Records for a card body: KOL's simple Table in real columns, or `empty` text when there are no rows. */
import { Table } from '@kolkrabbi/kol-component'

export default function RecordsTable({ columns, rows, empty = 'No data yet' }) {
  return rows.length
    ? <div className="pt-4 min-w-0 overflow-x-auto"><Table variant="simple" width="column" compact columns={columns} rows={rows} /></div>
    : <div className="kol-helper-12 text-fg-48 py-10 text-center">{empty}</div>
}
