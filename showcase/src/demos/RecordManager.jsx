import { useState } from 'react'
import { RecordManager } from '@kolkrabbi/kol-component'

export const stage = 'full'

/* cover art — real photos from the root public/ (the SVG mock read as a
 * grey blob, nothing like a photo tile) */
const thumb = (n) => `/kol-images/tt-0${n}.jpg`

const SEED = [
  { id: 1, title: 'Blue print No. 4', status: 'Live', series: 'editions', artwork: { thumb: thumb(1), name: 'blue-print-04.png' } },
  { id: 2, title: 'Harbour study', status: 'Draft', series: 'studies', artwork: { thumb: thumb(2), name: 'harbour-study.png' } },
  { id: 3, title: 'Meridian poster', status: 'Live', series: 'posters', artwork: { thumb: thumb(3), name: 'meridian.png' } },
  { id: 4, title: 'Field notes I', status: 'Archived', series: 'studies', artwork: { thumb: thumb(4), name: 'field-notes-1.png' } },
]

const STATUS = [
  { value: 'Live', label: 'Live', tone: 'success' },
  { value: 'Draft', label: 'Draft', tone: 'warning' },
  { value: 'Archived', label: 'Archived' },
]

/* Data is consumer-owned (the surface never fetches): rows in local state,
 * edits + reorder write back here. No mediaClient injected — the media field
 * shows its pick affordance without opening a picker. */
export default function RecordManagerDemo() {
  const [rows, setRows] = useState(SEED)
  const [open, setOpen] = useState(null)
  const [query, setQuery] = useState('')

  const patch = (id, next) => setRows((rs) => rs.map((r) => (r.id === id ? { ...r, ...next } : r)))
  const shown = query
    ? rows.filter((r) => r.title.toLowerCase().includes(query.toLowerCase()))
    : rows

  return (
    <div className="h-[28rem] w-full">
      <RecordManager
        columns={[
          { accessor: 'artwork', header: '', type: 'thumb' },
          { accessor: 'title', header: 'Title', type: 'title', sortable: true },
          { accessor: 'status', header: 'Status', type: 'status', options: STATUS, onStatusChange: (row, v) => patch(row.id, { status: v }) },
        ]}
        rows={shown}
        onReorder={(from, to) => setRows((rs) => {
          const next = [...rs]
          next.splice(to, 0, next.splice(from, 1)[0])
          return next
        })}
        onSelectRow={(row) => setOpen(row)}
        fields={[
          { key: 'title', label: 'Title', type: 'text', hint: (r) => `prints/${String(r?.title ?? '').toLowerCase().replace(/[^a-z0-9]+/g, '-')}` },
          { key: 'status', label: 'Status', type: 'status', options: STATUS },
          { key: 'series', label: 'Series', type: 'select', options: [
            { value: 'editions', label: 'Editions' },
            { value: 'studies', label: 'Studies' },
            { value: 'posters', label: 'Posters' },
          ] },
          { key: 'artwork', label: 'Artwork', type: 'media' },
        ]}
        value={open}
        onChange={(key, next) => {
          if (open) { patch(open.id, { [key]: next }); setOpen((o) => ({ ...o, [key]: next })) }
        }}
        query={query}
        onQueryChange={setQuery}
        searchPlaceholder="Search prints"
        onAdd={() => {}}
        onSortToggle={() => {}}
        onFilterToggle={() => {}}
      />
    </div>
  )
}
