import { useState } from 'react'
import { RecordManager, SearchInput } from '@kolkrabbi/kol-component'
import { Icon } from '@kolkrabbi/kol-icons'

export const meta = {
  title: 'Record manager CMS',
  description: 'The full CMS surface around RecordManager — collections rail, record table with reorder/status/slug/media columns, and the slide-over record panel',
  category: 'editor',
  featured: true,
  type: 'reference',
  status: 'active',
  updated: '2026-08-09',
  tags: ['domain/design-system', 'pattern/blocks'],
}
export const stage = 'full'

/* RecordManager in CONTEXT (user ask 2026-08-09: "how can I view it in
 * context without"): the reference's whole surface — a collections rail
 * beside the record table, the toolbar cluster, and the slide-over panel —
 * so the organism is judged the way a consumer meets it, not as a lone
 * preview. Data is local state; no client injected (§3 — the media field
 * shows its pick affordance without a picker). */

/* mock cover art — FILLED compositions so the tile reads as a photo, not a
 * stray outline (user frame 45) */
const thumb = (seed) => `data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 80"><rect width="140" height="80" fill="#3a3a41"/><rect width="140" height="${28 + seed * 8}" y="${52 - seed * 8}" fill="#1d1d21"/><circle cx="${30 + seed * 18}" cy="${24 + seed * 4}" r="${10 + seed * 3}" fill="#8a8a94"/></svg>`,
)}`

const COLLECTIONS = [
  { id: 'news', label: 'News details', count: 8 },
  { id: 'work', label: 'Work details', count: 6 },
  { id: 'service', label: 'Service details', count: 4 },
  { id: 'legal', label: 'Legal', count: 2 },
]

const STATUS = [
  { value: 'Live', label: 'Live', tone: 'success' },
  { value: 'Draft', label: 'Draft', tone: 'warning' },
  { value: 'Archived', label: 'Archived' },
]

const FOCUS = [
  { value: 'center', label: 'Center' },
  { value: 'top', label: 'Top' },
  { value: 'bottom', label: 'Bottom' },
]

const SEED = [
  { id: 1, title: 'Harbour campaign', status: 'Live', slug: 'harbour-campaign', cover: { thumb: thumb(1), name: 'harbour.png' }, focus: 'center', video: { name: 'harbour-loop.mp4' } },
  { id: 2, title: 'Meridian editions', status: 'Live', slug: 'meridian-editions', cover: { thumb: thumb(2), name: 'meridian.png' }, focus: 'top', video: null },
  { id: 3, title: 'Field notes — winter', status: 'Draft', slug: 'field-notes-winter', cover: { thumb: thumb(3), name: 'field-notes.png' }, focus: 'center', video: null },
  { id: 4, title: 'Studio open day', status: 'Live', slug: 'studio-open-day', cover: { thumb: thumb(4), name: 'open-day.png' }, focus: 'bottom', video: { name: 'open-day-recap.mp4' } },
  { id: 5, title: 'Print archive relaunch', status: 'Draft', slug: 'print-archive', cover: { thumb: thumb(5), name: 'archive.png' }, focus: 'center', video: null },
  { id: 6, title: 'Signage system', status: 'Archived', slug: 'signage-system', cover: { thumb: thumb(0), name: 'signage.png' }, focus: 'top', video: null },
]

export default function RecordManagerCmsSet() {
  const [collection, setCollection] = useState('work')
  const [rows, setRows] = useState(SEED)
  const [open, setOpen] = useState(null)
  const [query, setQuery] = useState('')
  const [railQuery, setRailQuery] = useState('')

  const patch = (id, next) => setRows((rs) => rs.map((r) => (r.id === id ? { ...r, ...next } : r)))
  const shown = query ? rows.filter((r) => r.title.toLowerCase().includes(query.toLowerCase())) : rows

  return (
    /* NARROW WIDTHS ARE PART OF THE COMPOSITION (user call 2026-08-09: the
     * fixed 15rem rail ate the phone). Below md the rail becomes a top strip
     * — collections as a horizontal chip row — and the table pane keeps
     * min-w-0 so Table's own overflow-x wrapper does the horizontal work. */
    <div className="grid h-full min-h-0 w-full grid-rows-[auto_minmax(0,1fr)] md:grid-rows-1 md:grid-cols-[15rem_minmax(0,1fr)]">
      {/* ── collections rail (top strip below md) ────────────────────── */}
      <aside className="flex min-w-0 flex-col gap-3 border-b border-fg-08 p-3 md:min-h-0 md:border-b-0 md:border-r">
        <SearchInput size="sm" value={railQuery} onChange={(e) => setRailQuery(e.target.value)} onClear={() => setRailQuery('')} placeholder="Search" />
        <nav aria-label="Collections" className="min-w-0">
          <ul className="m-0 flex list-none flex-row gap-[2px] overflow-x-auto p-0 md:flex-col md:overflow-x-visible">
            {COLLECTIONS.filter((c) => c.label.toLowerCase().includes(railQuery.toLowerCase())).map((c) => (
              <li key={c.id} className="shrink-0 md:shrink">
                <button
                  type="button"
                  className={`kol-helper-12 flex w-full cursor-pointer items-center gap-2 whitespace-nowrap rounded-sm border-0 px-3 py-2 text-left ${c.id === collection ? 'bg-fg-08 text-emphasis' : 'bg-transparent text-body hover:text-emphasis'}`}
                  onClick={() => setCollection(c.id)}
                >
                  <Icon name="library" size={14} />
                  <span className="min-w-0 flex-1 truncate">{c.label}</span>
                  <span className="kol-helper-10 text-meta">{c.count}</span>
                </button>
              </li>
            ))}
            <li className="shrink-0 md:shrink">
              <button type="button" className="kol-helper-12 flex w-full cursor-pointer items-center gap-2 whitespace-nowrap rounded-sm border-0 bg-transparent px-3 py-2 text-left text-meta hover:text-emphasis">
                <Icon name="plus" size={14} />
                Add collection
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      {/* ── the record surface ───────────────────────────────────────── */}
      <div className="min-h-0 min-w-0 overflow-y-auto p-4">
        <RecordManager
          columns={[
            { accessor: 'title', header: 'Title', type: 'title', sortable: true },
            { accessor: 'status', header: 'Status', type: 'status', options: STATUS, onStatusChange: (row, v) => patch(row.id, { status: v }) },
            { accessor: 'slug', header: 'Slug', render: (row) => <span className="kol-mono-12 text-meta">{row.slug}</span> },
            { accessor: 'cover', header: 'Cover image', type: 'thumb' },
            { accessor: 'focus', header: 'Cover focus', type: 'select', options: FOCUS, onSelectChange: (row, v) => patch(row.id, { focus: v }) },
          ]}
          rows={shown}
          onReorder={(from, to) => setRows((rs) => {
            const next = [...rs]
            next.splice(to, 0, next.splice(from, 1)[0])
            return next
          })}
          onSelectRow={(row) => setOpen(row)}
          fields={[
            { key: 'title', label: 'Title', type: 'text' },
            { key: 'status', label: 'Status', type: 'status', options: STATUS },
            { key: 'slug', label: 'Slug', type: 'text', hint: (r) => `work/${r?.slug ?? ''}` },
            { key: 'cover', label: 'Cover image', type: 'media' },
            { key: 'focus', label: 'Cover focus', type: 'select', options: FOCUS },
            { key: 'video', label: 'Video feature', type: 'file' },
          ]}
          value={open}
          onChange={(key, next) => {
            if (open) { patch(open.id, { [key]: next }); setOpen((o) => ({ ...o, [key]: next })) }
          }}
          query={query}
          onQueryChange={setQuery}
          searchPlaceholder="Search records"
          onAdd={() => {}}
          onSortToggle={() => {}}
          onFilterToggle={() => {}}
          onOverflow={() => {}}
          saveState="Saved just now"
          onPublish={() => {}}
          onPreview={() => {}}
        />
      </div>
    </div>
  )
}
