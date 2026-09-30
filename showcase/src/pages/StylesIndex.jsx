import { Link } from 'react-router-dom'
import { DocSection } from '@kolkrabbi/kol-workshop'
import { Table } from '@kolkrabbi/kol-component'
import HomeDoc from '../lib/HomeDoc.jsx'
import { DOCS_GUIDES, DOCS_SPECIMENS } from '../nav/shell-nav.js'
import { ICON_SETS } from './IconsGallery.jsx'
import { labelFromSlug } from '../nav/labels.js'

/**
 * StylesIndex — the Styles space's root (2026-09-30, the names audit: *"a new nav tab for kol
 * styles … its a reference lookup table and super important … also should be linked to some
 * truth"*). The home, then each chapter with the source file every page reads.
 */
const linkCls = 'kol-doc-body underline decoration-fg-16 underline-offset-4 hover:decoration-fg-64'

/* the DS Table, not a hand-built list (2026-09-30) */
const COLUMNS = [
  { accessor: 'label', header: 'Page', render: (r) => <Link className={linkCls} to={r.to}>{r.label}</Link> },
  { accessor: 'note', header: 'Reads', className: 'kol-table-cell-meta-strong' },
]
function Rows({ items }) {
  return <Table width="column" columns={COLUMNS} rows={items.map((r) => ({ ...r, id: r.to, note: r.note ?? '—' }))} />
}

export default function StylesIndex() {
  return (
    <div className="flex flex-col gap-10 pb-24">
      <HomeDoc id="styles" />
      <DocSection id="foundations" title="Foundations">
        <Rows items={DOCS_SPECIMENS.map((s) => ({ to: s.path, label: s.label, note: s.source }))} />
      </DocSection>
      <DocSection id="icons" title="Icons">
        <Rows items={Object.entries(ICON_SETS).map(([k, s]) => ({ to: `/icons/${k}`, label: labelFromSlug(k.replace('kol-icon-set-', '')), note: `packages/icons/src/${s.label}/ · ${Object.keys(s.groups).length} groups · ${Object.values(s.groups).flat().length} icons` }))} />
      </DocSection>
      <DocSection id="guides" title="Guides">
        <Rows items={DOCS_GUIDES.map((g) => ({ to: g.path, label: g.label }))} />
      </DocSection>
    </div>
  )
}
