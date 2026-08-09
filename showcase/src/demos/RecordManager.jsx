import { useState } from 'react'
import { RecordManager } from '@kolkrabbi/kol-component'

export const stage = 'full'

/* mock cover art — filled so the tile reads as a photo, not an outline */
const thumb = (seed) => `data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 80"><rect width="140" height="80" fill="#3a3a41"/><rect width="140" height="${28 + seed * 8}" y="${52 - seed * 8}" fill="#1d1d21"/><circle cx="${30 + seed * 18}" cy="${24 + seed * 4}" r="${10 + seed * 3}" fill="#8a8a94"/></svg>`,
)}`

const SEED = [
  { id: 1, title: 'Blue print No. 4', status: 'Live', series: 'editions', artwork: { thumb: thumb(1), name: 'blue-print-04.png' } },
  { id: 2, title: 'Harbour study', status: 'Draft', series: 'studies', artwork: { thumb: thumb(2), name: 'harbour-study.png' } },
  { id: 3, title: 'Meridian poster', status: 'Live', series: 'posters', artwork: { thumb: thumb(3), name: 'meridian.png' } },
  { id: 4, title: 'Field notes I', status: 'Archived', series: 'studies', artwork: { thumb: thumb(0), name: 'field-notes-1.png' } },
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
        onOverflow={() => {}}
      />
    </div>
  )
}
