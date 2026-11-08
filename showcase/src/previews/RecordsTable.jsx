import { RecordsTable } from '@kolkrabbi/kol-dashboards'

export const stage = 'md'

// Inline fixture — recent uploads, then the empty state.
const columns = [
  { header: 'File', accessor: 'file' },
  { header: 'Store', accessor: 'store' },
  { header: 'Size', accessor: 'size', style: { textAlign: 'right' } },
]
const rows = [
  { file: 'cover.png', store: 'b2 media', size: '1.2 MB' },
  { file: 'reel.mp4', store: 'r2 video', size: '84 MB' },
]

export default function RecordsTablePreview() {
  return (
    <div className="flex flex-col gap-6 w-full max-w-[720px]">
      <RecordsTable columns={columns} rows={rows} />
      <RecordsTable columns={columns} rows={[]} empty="No uploads yet" />
    </div>
  )
}
