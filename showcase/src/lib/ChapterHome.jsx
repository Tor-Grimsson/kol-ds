import { Link } from 'react-router-dom'
import { Table } from '@kolkrabbi/kol-component'
import { DocSection } from '@kolkrabbi/kol-workshop'
import HomeDoc from './HomeDoc.jsx'

/**
 * ChapterHome — the page a rail group opens (2026-09-30, the showcase review W3: every category and
 * every group in every rail gets its own page). Its markdown home, then what it holds as one DS
 * Table — the same two columns the Styles index uses. `validate:rail-pages` is the gate.
 *
 * @param {string} home   the `showcase/src/homes/<id>.md` rendered on top
 * @param {Array}  items  `{ to, label, note? }` — the group's children, in rail order
 * @param {string} [noteHeader='About']  the second column's header
 * @param {string} [title='Pages']  the section the table sits in — its heading is what the right
 *                                   rail lists under This page (W15: "On this page" was empty on homes)
 */
const linkCls = 'kol-doc-body underline decoration-fg-16 underline-offset-4 hover:decoration-fg-64'

export default function ChapterHome({ home, items, noteHeader = 'About', title = 'Pages', children }) {
  const columns = [
    { accessor: 'label', header: 'Page', render: (r) => <Link className={linkCls} to={r.to}>{r.label}</Link> },
    { accessor: 'note', header: noteHeader, className: 'kol-table-cell-meta-strong' },
  ]
  return (
    <div className="flex flex-col gap-10 pb-24">
      <HomeDoc id={home} />
      {items.length > 0 && (
        <DocSection id="pages" title={title}>
          <Table width="column" columns={columns} rows={items.map((r) => ({ ...r, id: r.to, note: r.note ?? '—' }))} />
        </DocSection>
      )}
      {children}
    </div>
  )
}
