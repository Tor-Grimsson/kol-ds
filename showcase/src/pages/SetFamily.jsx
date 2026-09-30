import { Link, useParams, Navigate } from 'react-router-dom'
import { DocHeader, DocSection, usePageMeta } from '@kolkrabbi/kol-workshop'
import { Table } from '@kolkrabbi/kol-component'
import { TOP_LEVEL, CATEGORY_ORDER, CATEGORY_LABELS, packageLabel } from '../nav/registry.js'
import { setsOfFamily } from '../lib/sets-registry.js'

/**
 * SetFamily — one package's set (2026-09-30, the names audit: *"aren't many of these technically
 * sets? and dont sets have their own home?"*). Everything the package ships, grouped on the
 * atomic ladder, then the composed sets built from it. Replaces the package groupings the
 * Components rail used to carry.
 */
const PKG_JSON = import.meta.glob('../../../packages/*/package.json', { eager: true, import: 'default' })
const pkgOf = (dir) => Object.entries(PKG_JSON).find(([p]) => p.includes(`/packages/${dir}/`))?.[1]

const linkCls = 'kol-doc-body underline decoration-fg-16 underline-offset-4 hover:decoration-fg-64'

/* the DS Table, not a hand-built list (2026-09-30) */
const COLUMNS = [
  { accessor: 'displayName', header: 'Component', render: (c) => <Link className={linkCls} to={`/components/${c.slug}`}>{c.displayName}</Link> },
  { accessor: 'description', header: 'What it is', className: 'kol-table-cell-meta-strong' },
]

export default function SetFamily() {
  const { dir } = useParams()
  const pkg = pkgOf(dir)
  const members = TOP_LEVEL.filter((c) => c.family === dir)
  const composed = setsOfFamily(dir)
  usePageMeta({ tags: [], related: [] })
  if (!pkg || !members.length) return <Navigate to="/sets" replace />
  const tiers = CATEGORY_ORDER.map((k) => [k, members.filter((c) => c.category === k)]).filter(([, l]) => l.length)

  return (
    <div className="flex flex-col gap-10 pb-24">
      <DocHeader eyebrow={`Sets · ${pkg.name} ${pkg.version}`} title={packageLabel(dir)} lede={pkg.description} />
      {composed.length > 0 && (
        <DocSection id="composed" title="Composed">
          <ul className="flex flex-col gap-2">
            {composed.map((s) => (
              <li key={s.key} className="kol-doc-body">
                <Link className={linkCls} to={`/sets/${s.key}`}>{s.title}</Link>
                {s.description && <span className="text-subtle"> — {s.description}</span>}
              </li>
            ))}
          </ul>
        </DocSection>
      )}
      {tiers.map(([k, list]) => (
        <DocSection key={k} id={k} title={`${CATEGORY_LABELS[k]} · ${list.length}`}>
          <Table width="column" columns={COLUMNS} rows={list.map((c) => ({ ...c, id: c.name }))} />
        </DocSection>
      ))}
    </div>
  )
}
