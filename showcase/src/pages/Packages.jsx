import { Link, useParams, Navigate } from 'react-router-dom'
import LandingWall from '../lib/LandingWall.jsx'
import { DocSection, DocumentationReader } from '@kolkrabbi/kol-workshop'
import { Table } from '@kolkrabbi/kol-component'
import { buildInventory } from '@kolkrabbi/kol-markdown'
import HomeDoc from '../lib/HomeDoc.jsx'
import { useFrontmatter } from '../lib/frontmatter.jsx'
import { TOP_LEVEL, CATEGORY_ORDER, CATEGORY_LABELS } from '../nav/registry.js'
import { setsOfFamily } from '../lib/sets-registry.js'
import { InstallBlock } from '../lib/component-page-parts.jsx'
import { APPS } from './Apps.jsx'

const APP_NAMES = new Set(APPS.map((a) => a.name))

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
/* a package's page from its npm name — null when it is not one of ours */
const hrefOfName = (name) => { const d = PACKAGES.find((x) => x.pkg.name === name)?.dir; return d ? packageHref(d) : null }
const usedBy = (name) => PACKAGES.filter((p) => deps(p.pkg).includes(name)).map((p) => p.pkg.name)
export const packageHref = (dir) => `/packages/${dir}`
/* a tier is a group in the rail, so it has a page of its own (W3, 2026-09-30) */
export const tierSlug = (tier) => tier.replace(/\s+/g, '-').toLowerCase()
export const tierHref = (tier) => `/packages/tier/${tierSlug(tier)}`
export const tierLabel = (tier) => tier.charAt(0).toUpperCase() + tier.slice(1)

/* WHAT IT IS, in plain English (the showcase review W7, 2026-09-30 — user: *"its like you dont get the
 * point of documentation, you think a version log is documentation, NO its WHAT THE FUCK IS THIS THING
 * and CAN I READ IT IN ENGLISH"*). One authored file per package, `src/package-about/<dir>.md`. */
const ABOUT = Object.fromEntries(Object.entries(import.meta.glob('../package-about/*.md', { eager: true, query: '?raw', import: 'default' }))
  .map(([path, raw]) => [path.match(/([^/]+)\.md$/)[1], raw.trim()]))

/* the apps that install a package — read off each app's own package.json, so it cannot drift */
const APP_PKGS = import.meta.glob('../../../apps/*/package.json', { eager: true, import: 'default' })
const APP_DEPS = Object.entries(APP_PKGS).map(([path, pkg]) => ({
  name: path.match(/apps\/([^/]+)\//)[1],
  deps: Object.keys({ ...pkg.dependencies, ...pkg.peerDependencies }),
}))
export const appsUsing = (name) => APP_DEPS.filter((a) => a.deps.includes(name)).map((a) => a.name).sort()

const latestOf = (changelog) => changelog.match(/^##\s+(\d+\.\d+\.\d+)\s*[—-]\s*(\d{4}-\d{2}-\d{2})/m)

/* the package page's document — frontmatter from package.json, the body is what it IS */
const docOf = ({ dir, pkg, changelog, tier }) => {
  const latest = latestOf(changelog)
  return `---
title: ${pkg.name.replace('@kolkrabbi/', '')}
type: reference
status: ${tier === 'deprecated alias' ? 'superseded' : 'active'}
version: ${pkg.version}
tier: ${tier}
${latest ? `updated: ${latest[2]}\n` : ''}description: ${(pkg.description ?? '').replace(/\s+/g, ' ')}
tags:
  - domain/packages
  - domain/release
---

# ${pkg.name.replace('@kolkrabbi/', '')}

${ABOUT[dir] ?? pkg.description ?? ''}
`
}
/* the changelog is its own page now — a version log is a record, not what the package is */
const changelogOf = ({ pkg, changelog }) => {
  /* a version heading keeps its `v` — the rail strips a leading number as if it were an order prefix */
  const body = changelog.replace(/^#\s+.*\n/, '').replace(/^## (\d)/gm, '## v$1')
  return `---
title: ${pkg.name.replace('@kolkrabbi/', '')} changelog
type: log
status: active
description: Every release, newest first
tags:
  - domain/packages
  - domain/release
---

# ${pkg.name.replace('@kolkrabbi/', '')} changelog

${body || '_No changelog yet._'}
`
}
const MODULES = Object.fromEntries(PACKAGES.flatMap((p) => [[`packages/${p.dir}.md`, docOf(p)], [`packages/${p.dir}-changelog.md`, changelogOf(p)]]))
const INVENTORY = buildInventory(MODULES)

export function PackageChangelog() {
  const { dir } = useParams()
  const show = useFrontmatter('page')
  if (!PACKAGES.some((x) => x.dir === dir)) return <Navigate to="/packages" replace />
  return (
    <DocumentationReader
      key={dir}
      inventory={INVENTORY}
      modules={MODULES}
      docId={`${dir}-changelog`}
      showFrontmatter={show}
      docHref={(id) => (id.endsWith('-changelog') ? `${packageHref(id.replace(/-changelog$/, ''))}/changelog` : packageHref(id))}
      routes={{ docsIndex: '/packages', components: '/components', docFilePath: () => `packages/${dir}/CHANGELOG.md` }}
    />
  )
}

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
      {/* INSTALL — the one install idiom (pm tabs over a CodeBlock), copyable (W7) */}
      <DocSection id="install" title="Install">
        <InstallBlock pkg={p.pkg.name} />
      </DocSection>
      {/* WHO USES IT — the apps and packages that install it, and what it needs (W7) */}
      <DocSection id="used-by" title="Used by">
        <Table width="column" columns={USE_COLUMNS} rows={[
          { id: 'apps', label: 'Apps', items: appsUsing(p.pkg.name).map((n) => ({ label: n, to: APP_NAMES.has(n) ? `/app/${n}` : null })) },
          { id: 'packages', label: 'Packages', items: usedBy(p.pkg.name).map((n) => ({ label: n.replace('@kolkrabbi/', ''), to: hrefOfName(n) })) },
          { id: 'needs', label: 'It needs', items: deps(p.pkg).map((n) => ({ label: n.replace('@kolkrabbi/', ''), to: hrefOfName(n) })) },
        ]} />
      </DocSection>
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
      <DocSection id="changelog" title="Changelog">
        <p className="kol-doc-body">
          {latestOf(p.changelog) ? `${p.pkg.version}, released ${latestOf(p.changelog)[2]}. ` : `${p.pkg.version}. `}
          <Link className={linkCls} to={`${packageHref(dir)}/changelog`}>Every release</Link>
        </p>
      </DocSection>
      </div>
    </>
  )
}

const linkCls = 'kol-doc-body underline decoration-fg-16 underline-offset-4 hover:decoration-fg-64'

/* Used by — one row per relation, its members as links (W7) */
const USE_COLUMNS = [
  { accessor: 'label', header: 'Who', className: 'kol-table-cell-meta-strong' },
  { accessor: 'items', header: 'Names', render: (r) => (r.items.length ? r.items.map((it, i) => (
    <span key={it.label}>{i > 0 && ' · '}{it.to ? <Link className={linkCls} to={it.to}>{it.label}</Link> : it.label}</span>
  )) : <span className="text-subtle">none</span>) },
]

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
      {/* THE WALL (2026-10-01): every package as a card, the landing's format; the tables follow */}
      <DocSection id="wall" title="Every package">
        <LandingWall items={PACKAGES.map((p) => ({ key: p.dir, label: `${p.pkg.name.replace('@kolkrabbi/', '')} · ${p.pkg.version}`, to: packageHref(p.dir), node: (
          <div className="flex flex-col gap-3">
            <p className="kol-doc-body text-body">{p.pkg.description ?? '—'}</p>
            <p className="kol-helper-10 text-meta uppercase">{p.tier}</p>
          </div>
        ) }))} />
      </DocSection>
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

/** A tier's page — its home, then its packages (W3, 2026-09-30: the rail's `UI` opened kol-chess). */
export function PackageTier() {
  const { tier: slug } = useParams()
  const tier = TIER_ORDER.find((t) => tierSlug(t) === slug)
  if (!tier) return <Navigate to="/packages" replace />
  const list = PACKAGES.filter((p) => p.tier === tier)
  return (
    <div className="flex flex-col gap-10 pb-24">
      <HomeDoc id={`package-tier-${slug}`} />
      <DocSection id="packages" title="Packages">
        <Table width="column" columns={PKG_COLUMNS} rows={list.map((p) => ({ ...p, id: p.dir }))} />
      </DocSection>
    </div>
  )
}
