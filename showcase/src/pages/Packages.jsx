import { Link, useParams, Navigate } from 'react-router-dom'
import { DocSection, DocumentationReader } from '@kolkrabbi/kol-workshop'
import { Table } from '@kolkrabbi/kol-component'
import { buildInventory } from '@kolkrabbi/kol-markdown'
import HomeDoc from '../lib/HomeDoc.jsx'
import { useFrontmatter } from '../lib/frontmatter.jsx'
import { TOP_LEVEL, CATEGORY_ORDER, CATEGORY_LABELS } from '../nav/registry.js'
import { setsOfFamily } from '../lib/sets-registry.js'

/**
 * Packages — every published package, and one page per package (2026-09-30, the names audit: *"a
 * home for the npm packages and the changelog? what is nested in what packages, a home with
 * metadata and tags … changelog in frontmatter seems logical?"*).
 *
 * A package page is a markdown document built at runtime from the package itself: its
 * `package.json` becomes the frontmatter (version, tier, latest release, what it depends on) and
 * its `CHANGELOG.md` becomes the body — so the page can never drift from what shipped. Read by the
 * same reader as the vault; `F` shows the frontmatter.
 */
const PKG_JSON = import.meta.glob('../../../packages/*/package.json', { eager: true, import: 'default' })
const CHANGELOGS = import.meta.glob('../../../packages/*/CHANGELOG.md', { eager: true, query: '?raw', import: 'default' })

/* The tiers — ARCHITECTURE §3 */
const TIER = {
  markdown: 'engine', search: 'engine',
  'media-client': 'client',
  'design-editor': 'app',
  brand: 'brand kit', 'brand-template': 'brand kit', scrape: 'brand kit',
  controls: 'deprecated alias',
}
export const TIER_ORDER = ['UI', 'app', 'engine', 'client', 'brand kit', 'deprecated alias']

const dirOf = (path) => path.match(/packages\/([^/]+)\//)[1]
export const PACKAGES = Object.entries(PKG_JSON)
  .map(([path, pkg]) => ({ dir: dirOf(path), pkg, changelog: CHANGELOGS[path.replace('package.json', 'CHANGELOG.md')] ?? '' }))
  .filter(({ pkg }) => pkg.name?.startsWith('@kolkrabbi/') && !pkg.private)
  .map((p) => ({ ...p, tier: TIER[p.dir] ?? 'UI' }))
  .sort((a, b) => a.pkg.name.localeCompare(b.pkg.name))

const deps = (pkg) => Object.keys({ ...pkg.dependencies, ...pkg.peerDependencies }).filter((d) => d.startsWith('@kolkrabbi/'))
const usedBy = (name) => PACKAGES.filter((p) => deps(p.pkg).includes(name)).map((p) => p.pkg.name)
export const packageHref = (dir) => `/packages/${dir}`

/* the package as a markdown document — frontmatter from package.json, body from the changelog */
const docOf = ({ dir, pkg, changelog, tier }) => {
  const latest = changelog.match(/^##\s+(\d+\.\d+\.\d+)\s*[—-]\s*(\d{4}-\d{2}-\d{2})/m)
  /* a version heading keeps its `v` — the rail strips a leading number as if it were an order prefix */
  const body = changelog.replace(/^#\s+.*\n/, '').replace(/^## (\d)/gm, '## v$1')
  const names = (xs) => (xs.length ? xs.map((x) => `\`${x}\``).join(' · ') : 'nothing')
  return `---
title: ${pkg.name.replace('@kolkrabbi/', '')}
type: reference
status: ${tier === 'deprecated alias' ? 'superseded' : 'active'}
version: ${pkg.version}
tier: ${tier}
${latest ? `updated: ${latest[2]}\n` : ''}description: ${(pkg.description ?? '').replace(/\s+/g, ' ')}
tags:
  - domain/release
  - audience/consumer
---

# ${pkg.name}

${pkg.description ?? ''}

**Depends on:** ${names(deps(pkg))}

**Used by:** ${names(usedBy(pkg.name))}

${body || '_No changelog yet._'}
`
}
const MODULES = Object.fromEntries(PACKAGES.map((p) => [`packages/${p.dir}.md`, docOf(p)]))
const INVENTORY = buildInventory(MODULES)

export function PackagePage() {
  const { dir } = useParams()
  const show = useFrontmatter('page')
  const p = PACKAGES.find((x) => x.dir === dir)
  if (!p) return <Navigate to="/packages" replace />
  /* THE FAMILY (2026-09-30, the library taxonomy): what the package ships, on the atomic ladder,
   * and the sets built from it — this was SetFamily at /sets/family/<dir>, a set that was only
   * one package's components, now the package's own page */
  const members = TOP_LEVEL.filter((c) => c.family === dir)
  const tiers = CATEGORY_ORDER.map((k) => [k, members.filter((c) => c.category === k)]).filter(([, l]) => l.length)
  const composed = setsOfFamily(dir)
  return (
    <>
      <DocumentationReader
        key={dir}
        inventory={INVENTORY}
        modules={MODULES}
        docId={dir}
        showFrontmatter={show}
        docHref={packageHref}
        routes={{ docsIndex: '/packages', components: '/components', docFilePath: () => `packages/${dir}/CHANGELOG.md` }}
      />
      <div className="flex flex-col gap-10 mt-10">
      {composed.length > 0 && (
        <DocSection id="sets" title="Sets">
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
          <Table width="column" columns={FAMILY_COLUMNS} rows={list.map((c) => ({ ...c, id: c.name }))} />
        </DocSection>
      ))}
      </div>
    </>
  )
}

const linkCls = 'kol-doc-body underline decoration-fg-16 underline-offset-4 hover:decoration-fg-64'

/* the family table — carried from SetFamily verbatim */
const FAMILY_COLUMNS = [
  { accessor: 'displayName', header: 'Component', render: (c) => <Link className={linkCls} to={`/components/${c.slug}`}>{c.displayName}</Link> },
  { accessor: 'description', header: 'What it is', className: 'kol-table-cell-meta-strong' },
]

/* the DS Table, not a hand-built list (2026-09-30) */
const PKG_COLUMNS = [
  { accessor: 'name', header: 'Package', render: (p) => <Link className={linkCls} to={packageHref(p.dir)}>{p.pkg.name.replace('@kolkrabbi/', '')}</Link> },
  { accessor: 'version', header: 'Version', render: (p) => <code>{p.pkg.version}</code> },
  { accessor: 'what', header: 'What it is', className: 'kol-table-cell-meta-strong', render: (p) => p.pkg.description ?? '—' },
]

export default function Packages() {
  return (
    <div className="flex flex-col gap-10 pb-24">
      <HomeDoc id="packages" />
      {TIER_ORDER.map((tier) => {
        const list = PACKAGES.filter((p) => p.tier === tier)
        if (!list.length) return null
        return (
          <DocSection key={tier} id={tier.replace(/\s+/g, '-')} title={tier.charAt(0).toUpperCase() + tier.slice(1)}>
            <Table width="column" columns={PKG_COLUMNS} rows={list.map((p) => ({ ...p, id: p.dir }))} />
          </DocSection>
        )
      })}
    </div>
  )
}
