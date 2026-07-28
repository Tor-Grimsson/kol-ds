/**
 * DocKit — the Doc* composer family over the kol-theme `.kol-doc-*` role set
 * (theme ≥ 0.11.9). The packaged successors of the showcase-local doc kit
 * (2026-07-28 doc+card sets epic): thin composers, zero styling of their own —
 * every text rule lives in kol-type-roles.css.
 *
 *   DocHeader  — eyebrow → h1 → lede page header
 *   DocSection — anchored section: rule + h2 + optional lede + content
 *   DocTable   — the props table (Prop / Type / Default / Description)
 *   DocFigure  — framed content container + optional caption
 */

import { Table } from '@kolkrabbi/kol-component'

export function DocHeader({ eyebrow, title, lede, children }) {
  return (
    <header className="flex flex-col gap-3">
      {eyebrow && <p className="kol-doc-eyebrow">{eyebrow}</p>}
      <h1 className="kol-doc-heading">{title}</h1>
      {lede && <p className="kol-doc-lede">{lede}</p>}
      {children}
    </header>
  )
}

export function DocSection({ id, title, lede, children }) {
  return (
    <section id={id} className="flex flex-col gap-4 border-t border-fg-08 pt-8 scroll-mt-20">
      {title && <h2 className="kol-doc-section-title">{title}</h2>}
      {lede && <p className="kol-doc-body max-w-[var(--kol-content-measure)]">{lede}</p>}
      {children}
    </section>
  )
}

/* DocTable — a PRESET over the kol-component Table (the one table; 2026-07-28
 * user ruling: no parallel table markup). Fixed props-table columns, doc cell
 * classes through Table's per-column seams, doc chrome via the .kol-doc-table
 * class on Table's wrapper (the descendant rules out-specify Table's cell
 * defaults). Renders UNFRAMED (flush minimal — user ruling: no border). */
const PROPS_COLUMNS = [
  { accessor: 'prop', header: 'Prop', className: 'kol-doc-table-value text-emphasis' },
  { accessor: 'type', header: 'Type', className: 'kol-doc-table-value kol-doc-table-value--wrap text-meta' },
  { accessor: 'def', header: 'Default', className: 'kol-doc-table-value text-meta' },
  { accessor: 'desc', header: 'Description' },
]

export function DocTable({ rows }) {
  if (!rows?.length) return null
  return (
    <Table
      variant="simple"
      caption="Props"
      columns={PROPS_COLUMNS}
      rows={rows.map((r) => ({ id: r.prop, ...r }))}
      className="kol-doc-table"
    />
  )
}

export function DocFigure({ caption, className = '', children }) {
  return (
    <figure className={`kol-doc-figure ${className}`}>
      {children}
      {caption && <figcaption className="kol-doc-caption border-t border-fg-08 px-4 py-2.5">{caption}</figcaption>}
    </figure>
  )
}
