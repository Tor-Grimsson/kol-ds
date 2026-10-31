import { useState } from 'react'
import { FileQuickLook, SectionText, KIND_LABEL, Table } from '@kolkrabbi/kol-component'
import { Icon } from '@kolkrabbi/kol-icons'

/* taxonomy-ok: organism — a folder's index page: its header, the contents (cards or a table) and the Quick Look over its files */

/* DOCUMENT INDEX — a folder's pages as contents cards, grouped by `part` (plan-2026-10-28-document W3.3). A compact page
 * header, never a hero: the cards are the page. In kol-framework since 2026-10-31 (LayoutGroup, kol-atlas — beside
 * `documentFiles` / `documentTabs`, which it is built on; nothing about it is brand). kol-styleguide's `DocumentIndex` is
 * an alias of this one, on the retirement ledger.
 *
 * A FILE IS A CARD TOO (DocumentIndexFilesAndIcons049, kol-website 2026-10-28 — a point of the MarkdownPage ticket: *"a
 * folder may also hold PDFs and images; the contents index lists them beside the md pages and opens them in the DS
 * QuickLook, not as pages"*): a row with `file` sits in its part like a page, its kind on the card's small line, and
 * opens in the DS Quick Look window (`QuickLookFrame` over the dimmed page, `KindPreview` as the body — a PDF page by
 * page, an image at its size), paging through the folder's files with ‹ ›. `documentFiles(glob)` makes the rows.
 *
 * THE TABLE (2026-10-31, LayoutGroup): `variant="table"` lists the rows as kol-atlas's lab home lists its entries — the
 * workspace's sheet table (Sheet.jsx SheetTable) class for class: grey header row in caps, 16px outer inset, links plain
 * ink with the accent underline on hover, an icon before each title.
 *
 *   rows      [{ id, to, label?, title, part, meta?, icon? }] — a page: label is the card's eyebrow (an entry's parent), part the group
 *             [{ id, file, title, part, ext?, kind? }]          — a file: the served URL; kind from the DS's `kindOf` when not given
 *   variant   `cards` (default) · `table`
 *   columns   table only: the columns beside Title, `[{ accessor, header }]` (default No. · Part · Date · Covers, those the rows carry)
 *   accent    table only: the hover underline (default the KOL accent)
 *   title · lede   the header, when the index is a page of its own (Reviews) — SectionText `level="document"` (2026-10-31,
 *             DocumentIndexFigma); a folder's index sits under its document
 *   onNavigate(to) the app's router */
const fileLabel = (r) => KIND_LABEL[r.kind] ?? (r.ext ? r.ext.toUpperCase() : 'File')

const COLUMNS = [{ accessor: 'no', header: 'No.' }, { accessor: 'part', header: 'Part' }, { accessor: 'date', header: 'Date' }, { accessor: 'meta', header: 'Covers' }]

export default function DocumentIndex({ rows, title, lede, onNavigate, variant = 'cards', columns, accent = 'var(--kol-accent-primary)' }) {
  const files = rows.filter((r) => r.file)
  const [open, setOpen] = useState(null)   // index into `files`
  const index = rows.map((r) => (r.file
    ? { ...r, href: r.file, meta: r.meta ?? fileLabel(r), onClick: (e) => { if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return; e.preventDefault(); setOpen(files.indexOf(r)) } }
    : r))
  return (
    <div className="kol-page flex flex-col gap-6">
      {title && <SectionText level="document" headline={title} body={lede} />}
      {variant === 'table'
        ? <ContentsTable index={index} onNavigate={onNavigate} columns={columns} accent={accent} caption={title ?? 'Contents'} />
        : <Contents index={index} onNavigate={onNavigate} />}
      {/* the DS Quick Look over the folder's files (kol-component FileQuickLook, 2026-10-29 — the composition this file drew
        * by hand: dims, pages ‹ ›, a download) */}
      <FileQuickLook
        files={files.map((f) => ({ key: f.file.split('?')[0], name: f.title, url: f.file, type: f.kind === 'image' ? 'image/' : undefined }))}
        index={open}
        onIndex={setOpen}
        onClose={() => setOpen(null)}
        meta={(x) => fileLabel(files.find((f) => f.file === x.url))}
      />
    </div>
  )
}

/* an in-page anchor: scroll to it */
function scrollToAnchor(e) {
  e.preventDefault()
  const id = e.currentTarget.getAttribute('href')?.slice(1)
  if (id) document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

/* a router link: the app's router on a plain click; ⌘ / Ctrl / Shift / middle click keep the browser's own */
const routed = (onNavigate, to) => (e) => { if (!onNavigate || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return; e.preventDefault(); onNavigate(to) }

/* The contents: every indexed chapter as a row, its eyebrow carrying the number; grouped by `part` when the list has parts.
 * A row with `to` is a route, opened through `onNavigate` (a plain link otherwise); without one it is an in-page anchor
 * — apps/document's index reads it this way (plan-2026-10-28-document W3.3). The brand guide's Contents chapter is this. */
export function Contents({ index, onNavigate }) {
  if (!index.length) return null
  const parts = [...new Set(index.map((s) => s.part ?? ''))]
  const row = (s) => (
    <li key={s.to ?? s.id}>
      <IndexCard href={s.href ?? s.to ?? `#${s.id}`} onClick={s.onClick ?? (s.to ? routed(onNavigate, s.to) : scrollToAnchor)} label={s.label} title={s.title ?? s.nav} meta={s.meta} />
    </li>
  )
  return (
    <div className="mt-12 flex flex-col gap-10 max-w-panel">
      {parts.map((p) => (
        <div key={p || 'all'} className="flex flex-col gap-4">
          {p && <h3 className="kol-prose-label m-0">{p}</h3>}
          <ul className="m-0 grid list-none grid-cols-1 gap-2 p-0 md:grid-cols-2">{index.filter((s) => (s.part ?? '') === p).map(row)}</ul>
        </div>
      ))}
    </div>
  )
}

/* The book's index card — the Contents row: a label, the title, one small line and the arrow (kol-branding's IndexCard,
 * the in-page anchor half). */
function IndexCard({ href, onClick, label, title, meta }) {
  return (
    <a href={href} onClick={onClick} className="kol-card kol-card-interactive flex items-center justify-between gap-4 px-4 py-3 no-underline group">
      <span className="flex min-w-0 flex-col gap-1">
        {label && <span className="kol-mono-12 text-meta uppercase">{label}</span>}
        <span className="kol-mono-14 text-emphasis">{title}</span>
        {meta && <span className="kol-mono-10 text-meta mt-1">{meta}</span>}
      </span>
      <Icon name="arrow-right" size={16} className="shrink-0 text-oq-48 group-hover:text-emphasis transition-colors" />
    </a>
  )
}

/* The table: kol-atlas apps/lab's Contents (2026-10-31), class for class — the workspace's sheet table: grey header row in
 * caps, 16px outer inset, links plain ink with the accent underline on hover; `--lab-accent` is the `accent` prop. */
function ContentsTable({ index, onNavigate, columns, accent, caption }) {
  const head = 'kol-table-cell-title uppercase bg-[var(--kol-fg-04)] first:ps-4 last:pe-4 first:rounded-tl-[4px] last:rounded-tr-[4px]'
  const body = 'kol-table-cell-text whitespace-normal first:ps-4 last:pe-4 [&_a]:text-[var(--kol-surface-on-primary)] [&_a]:no-underline [&_a]:decoration-[var(--kol-document-accent)] [&_a]:decoration-[1.5px] [&_a]:underline-offset-4 [&_a:hover]:underline'
  const extra = columns ?? COLUMNS.filter((c) => index.some((r) => r[c.accessor] != null && r[c.accessor] !== ''))
  const link = (r) => {
    const to = r.href ?? r.to ?? `#${r.id}`
    return <a href={to} onClick={r.onClick ?? (r.to ? routed(onNavigate, r.to) : scrollToAnchor)}>{r.title ?? r.nav}</a>
  }
  const cols = [
    ...extra.filter((c) => c.accessor === 'no'),
    { accessor: 'title', header: 'Title', render: (r) => <span className="inline-flex items-center gap-2">{r.icon && <Icon name={r.icon} size={16} className="text-oq-48" />}{link(r)}</span> },
    ...extra.filter((c) => c.accessor !== 'no'),
  ].map((c) => ({ ...c, headerClassName: head, className: body }))
  return (
    <div className="mt-8" style={{ '--kol-document-accent': accent }}>
      <Table variant="simple" width="column" caption={caption} columns={cols} rows={index.map((r) => ({ ...r, id: r.id ?? r.to ?? r.file }))} />
    </div>
  )
}
