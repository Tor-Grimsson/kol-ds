import { useEffect, useMemo, useState } from 'react'
import { Link, Navigate, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom'
import {
  ShellLayout,
  ShellSidebar,
  RightRail,
  TagModeProvider,
  TagPath,
  useTagMode,
  DocumentationReader,
  DocHeader,
  DocSection,
  buildTagCounts,
  matchSearchItems,
} from '@kolkrabbi/kol-workshop'
import { Input, SegmentedToggle, Table, Tag, useScrollSpy } from '@kolkrabbi/kol-component'
import { Icon } from '@kolkrabbi/kol-icons'
import { CORPUS, DOC_MODULES, SPACES, COMPONENTS, BLOCKS, SETS, docHref, componentHref } from 'workshop-fixture'

/* apps/workshop — kol-workshop's shell over workshop-fixture, wired the way the showcase wires it
 * TODAY (showcase/src/lib/ShellChrome.jsx): one header of spaces, a left rail stacked Group by ·
 * Components · Tools · Documentation · Operations · Development on every route, the auto-TOC right
 * rail, and the palette on ⌘K. It reproduces the current structure on purpose — the refinement
 * plan (plan-2026-09-28-showcase-refinement) changes it here first. */

const { inventory, tree, componentTree, shellSearchItems } = CORPUS

/* the tag browser reads docs AND component pages, as the showcase's TAG_INVENTORY does */
const TAG_INVENTORY = [
  ...inventory,
  ...COMPONENTS.map((c) => ({ id: `component-${c.slug}`, title: c.name, file: `components/${c.slug}`, metadata: { title: c.name, tags: c.tags }, headings: [] })),
]
const tagDocHref = (id) => (id.startsWith('component-') ? componentHref(id.slice('component-'.length)) : docHref(id))

const FUNCTIONS = [...new Set(COMPONENTS.map((c) => c.fn))].sort()
const functionTree = FUNCTIONS.map((fn) => ({
  id: `fn-${fn}`,
  label: fn.replace(/^./, (x) => x.toUpperCase()),
  children: COMPONENTS.filter((c) => c.fn === fn).map((c) => ({ id: `cmp-${c.slug}`, label: c.name, path: componentHref(c.slug) })),
}))

/* ── the right rail: headings read off the rendered page, as the showcase's AutoToc does ── */
function useHeadings() {
  const { pathname } = useLocation()
  const [items, setItems] = useState([])
  useEffect(() => {
    const main = document.getElementById('main')
    if (!main) return undefined
    const read = () => {
      const found = [...main.querySelectorAll('h2, h3')]
        .map((h) => {
          const id = h.id || h.closest('section[id]')?.id
          return id ? { id, label: h.textContent.trim(), sub: h.tagName === 'H3' } : null
        })
        .filter(Boolean)
      setItems((prev) => (prev.length === found.length && prev.every((p, i) => p.id === found[i].id) ? prev : found))
    }
    read()
    const observer = new MutationObserver(read)
    observer.observe(main, { childList: true, subtree: true })
    return () => observer.disconnect()
  }, [pathname])
  return items
}

function AutoToc() {
  const headings = useHeadings()
  const navigate = useNavigate()
  const { openTagMode } = useTagMode()
  const topTags = useMemo(() => buildTagCounts(TAG_INVENTORY).slice(0, 12), [])
  const activeId = useScrollSpy(headings.map((h) => h.id), { root: '#main' })
  const actions = [
    { id: 'back', label: 'Back', icon: <Icon name="arrow-left" size={14} />, onClick: () => navigate(-1) },
    { id: 'docs', label: 'All documentation', icon: <Icon name="book-open" size={14} />, to: '/documentation' },
    { id: 'components', label: 'View components', icon: <Icon name="grid" size={14} />, to: '/components' },
    { id: 'graph', label: 'Graph view', icon: <Icon name="polygon" size={14} />, onClick: () => openTagMode(null, { view: 'graph' }) },
  ]
  return (
    <RightRail
      toc={headings}
      activeId={activeId}
      related={[]}
      actions={actions}
      topTags={topTags}
      tags={[]}
      renderTag={(tag) => <TagPath tag={tag} />}
      onTagClick={(tag) => openTagMode(tag)}
      icon={Icon}
    />
  )
}

/* ── the left rail: the same stack on every route ── */
function Sidebar({ onNavigate }) {
  const [mode, setMode] = useState('atomic')
  const categories = ['documentation', 'operations', 'development']
  return (
    <div className="shell-rail-stack">
      <div>
        <p className="shell-sidebar-label kol-doc-eyebrow">Group by</p>
        <SegmentedToggle
          options={[{ value: 'atomic', label: 'Atomic' }, { value: 'function', label: 'Function' }]}
          value={mode}
          onChange={setMode}
          size="sm"
        />
      </div>
      <ShellSidebar routes={mode === 'atomic' ? componentTree : functionTree} basePath="/" label="Components" onNavigate={onNavigate} />
      <ShellSidebar routes={SPACES.filter((s) => s.id !== 'components')} basePath="/" label="Tools" onNavigate={onNavigate} />
      {categories.map((cat) => (
        <ShellSidebar
          key={cat}
          routes={tree.filter((g) => g.category === cat)}
          basePath="/"
          label={cat.replace(/^./, (x) => x.toUpperCase())}
          onNavigate={onNavigate}
        />
      ))}
    </div>
  )
}

function Chrome() {
  const { pathname } = useLocation()
  const { openTagMode } = useTagMode()
  const searchItems = useMemo(() => {
    const tags = buildTagCounts(TAG_INVENTORY).map(({ tag, count }) => ({
      id: `tag-${tag}`,
      label: tag,
      sectionLabel: 'Tags',
      keywords: [`${count} docs`],
      action: () => openTagMode(tag),
    }))
    return [...shellSearchItems, ...tags]
  }, [openTagMode])

  return (
    <ShellLayout
      routes={SPACES}
      basePath="/"
      isActive={(href) => pathname === href || pathname.startsWith(`${href}/`)}
      renderSidebar={({ onNavigate }) => <Sidebar onNavigate={onNavigate} />}
      defaultTocContent={<AutoToc />}
      searchItems={searchItems}
    />
  )
}

/* ── pages ── */
const Page = ({ children }) => <div className="flex flex-col gap-10 pb-24">{children}</div>
const linkCls = 'kol-doc-body underline decoration-fg-16 underline-offset-4 hover:decoration-fg-64'

function Home() {
  return (
    <Page>
      <DocHeader
        eyebrow="Fixture"
        title="The workshop shell, alone."
        lede="kol-workshop's header, rails, palette, tag browser and reader over an invented corpus — 19 docs, 24 components, 3 blocks, 2 sets. Nothing here is the real design system."
      />
      <DocSection id="spaces" title="Spaces">
        <ul className="flex flex-col gap-2">
          {SPACES.map((s) => (
            <li key={s.id}><Link className={linkCls} to={s.path}>{s.label}</Link></li>
          ))}
        </ul>
      </DocSection>
    </Page>
  )
}

function Components() {
  const tiers = ['Atoms', 'Molecules', 'Organisms', 'Utilities']
  return (
    <Page>
      <DocHeader eyebrow="Fixture · Components" title="Components" lede={`${COMPONENTS.length} invented components across four tiers.`} />
      {tiers.map((tier) => (
        <DocSection key={tier} id={tier.toLowerCase()} title={tier}>
          <Table
            width="column"
            columns={[
              { accessor: 'name', header: 'Name', render: (c) => <Link className={linkCls} to={componentHref(c.slug)}>{c.name}</Link> },
              { accessor: 'fn', header: 'Function' },
              { accessor: 'description', header: 'Description' },
            ]}
            rows={COMPONENTS.filter((c) => c.category === tier).map((c) => ({ ...c, id: c.slug }))}
          />
        </DocSection>
      ))}
    </Page>
  )
}

function ComponentPage() {
  const { slug } = useParams()
  const c = COMPONENTS.find((x) => x.slug === slug)
  if (!c) return <Navigate to="/components" replace />
  return (
    <Page>
      <DocHeader eyebrow={`${c.category} · ${c.fn}`} title={c.name} lede={c.description}>
        <div className="flex flex-wrap gap-2">{c.tags.map((t) => <Tag key={t} text={t} />)}</div>
      </DocHeader>
      <DocSection id="install" title="Installation">
        <p className="kol-doc-body"><code>{`import { ${c.name} } from '${c.pkg}'`}</code></p>
      </DocSection>
      <DocSection id="props" title="Props">
        {c.props.length ? (
          <Table
            width="column"
            columns={[{ accessor: 'name', header: 'Prop' }, { accessor: 'type', header: 'Type' }, { accessor: 'default', header: 'Default' }, { accessor: 'description', header: 'Description' }]}
            rows={c.props.map((p) => ({ ...p, id: p.name }))}
          />
        ) : <p className="kol-doc-body">No props in the fixture.</p>}
      </DocSection>
      <DocSection id="used-in" title="Used in">
        <ul className="flex flex-col gap-2">
          {[...BLOCKS.filter((b) => b.uses.includes(c.name)).map((b) => [`/blocks/${b.key}`, `Block · ${b.title}`]),
            ...SETS.filter((s) => s.members.includes(c.name)).map((s) => [`/sets/${s.key}`, `Set · ${s.title}`])]
            .map(([to, label]) => <li key={to}><Link className={linkCls} to={to}>{label}</Link></li>)}
        </ul>
      </DocSection>
    </Page>
  )
}

function Collection({ kind }) {
  const list = kind === 'blocks' ? BLOCKS : SETS
  const title = kind === 'blocks' ? 'Blocks' : 'Sets'
  return (
    <Page>
      <DocHeader eyebrow={`Fixture · ${title}`} title={title} lede={`${list.length} invented ${kind}.`} />
      {list.map((item) => (
        <DocSection key={item.key} id={item.key} title={item.title} lede={item.description}>
          <Link className={linkCls} to={`/${kind}/${item.key}`}>Open</Link>
        </DocSection>
      ))}
    </Page>
  )
}

function CollectionItem({ kind }) {
  const { key } = useParams()
  const item = (kind === 'blocks' ? BLOCKS : SETS).find((x) => x.key === key)
  if (!item) return <Navigate to={`/${kind}`} replace />
  const names = item.uses ?? item.members
  return (
    <Page>
      <DocHeader eyebrow={kind === 'blocks' ? 'Block' : 'Set'} title={item.title} lede={item.description} />
      <DocSection id="members" title={kind === 'blocks' ? 'Built from' : 'Members'}>
        <ul className="flex flex-col gap-2">
          {names.map((n) => {
            const c = COMPONENTS.find((x) => x.name === n)
            return <li key={n}>{c ? <Link className={linkCls} to={componentHref(c.slug)}>{n}</Link> : n}</li>
          })}
        </ul>
      </DocSection>
    </Page>
  )
}

function References() {
  const rows = COMPONENTS.map((c) => ({
    id: c.slug,
    name: c.name,
    blocks: BLOCKS.filter((b) => b.uses.includes(c.name)).length,
    sets: SETS.filter((s) => s.members.includes(c.name)).length,
  })).map((r) => ({ ...r, total: r.blocks + r.sets }))
  return (
    <Page>
      <DocHeader eyebrow="Fixture · References" title="References" lede="Who uses what — counted from the fixture's blocks and sets." />
      <DocSection id="edges" title="Components by use">
        <Table
          width="column"
          columns={[
            { accessor: 'name', header: 'Component', sortable: true },
            { accessor: 'blocks', header: 'Blocks', sortable: true },
            { accessor: 'sets', header: 'Sets', sortable: true },
            { accessor: 'total', header: 'Total', sortable: true },
          ]}
          rows={rows}
        />
      </DocSection>
    </Page>
  )
}

/* the search page as the showcase has it today: one query, groups by whatever sectionLabel each row carries */
function SearchPage() {
  const [q, setQ] = useState('')
  const hits = matchSearchItems(shellSearchItems, q)
  const groups = [...hits.reduce((m, h) => m.set(h.sectionLabel, [...(m.get(h.sectionLabel) ?? []), h]), new Map())]
  return (
    <Page>
      <DocHeader eyebrow="Fixture · Search" title="Search" lede="Today's page — the substring matcher, grouped by section." />
      <DocSection id="query" title="Query">
        <Input value={q} placeholder="Search…" onChange={(e) => setQ(e.target.value)} aria-label="Search the fixture" />
      </DocSection>
      {groups.map(([section, rows]) => (
        <DocSection key={section} id={`g-${section}`} title={`${section} (${rows.length})`}>
          <ul className="flex flex-col gap-2">
            {rows.map((r) => <li key={r.id}><Link className={linkCls} to={r.href}>{r.label}</Link></li>)}
          </ul>
        </DocSection>
      ))}
    </Page>
  )
}

function Apps() {
  const apps = [
    ['workshop', 5183, 'This shell over the fixture'],
    ['markdown', 5184, 'kol-markdown over the fixture'],
    ['search', 5185, 'kol-search over the fixture'],
  ]
  const href = (name, port) => (import.meta.env.DEV ? `http://localhost:${port}/` : `/apps/${name}/`)
  return (
    <Page>
      <DocHeader eyebrow="Fixture · Apps" title="Apps" lede="The three apps that share workshop-fixture." />
      <DocSection id="apps" title="Apps">
        <ul className="flex flex-col gap-2">
          {apps.map(([name, port, what]) => (
            <li key={name} className="kol-doc-body"><a className={linkCls} href={href(name, port)}>apps/{name}</a> — {what}</li>
          ))}
        </ul>
      </DocSection>
    </Page>
  )
}

function Quarantine() {
  return (
    <Page>
      <DocHeader eyebrow="Fixture · Quarantine" title="Held until its rule is written." lede="Nothing is held in the fixture — the page exists because the showcase has it." />
    </Page>
  )
}

export default function App() {
  return (
    <Routes>
      <Route element={<TagModeProvider inventory={TAG_INVENTORY} docHref={tagDocHref}><Chrome /></TagModeProvider>}>
        <Route path="/" element={<Home />} />
        <Route path="/components" element={<Components />} />
        <Route path="/components/:slug" element={<ComponentPage />} />
        <Route path="/blocks" element={<Collection kind="blocks" />} />
        <Route path="/blocks/:key" element={<CollectionItem kind="blocks" />} />
        <Route path="/sets" element={<Collection kind="sets" />} />
        <Route path="/sets/:key" element={<CollectionItem kind="sets" />} />
        <Route path="/references" element={<References />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/apps" element={<Apps />} />
        <Route path="/quarantine" element={<Quarantine />} />
        <Route path="/documentation" element={<Navigate to={docHref(inventory[0].id)} replace />} />
        <Route
          path="/documentation/:docId"
          element={<DocumentationReader inventory={inventory} modules={DOC_MODULES} docHref={docHref} routes={{ docsIndex: '/documentation', components: '/components' }} />}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}

