import { useContext, useEffect, useLayoutEffect, useMemo, useState } from 'react'
import { Link, Navigate, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom'
import {
  ShellLayout,
  ShellSidebar,
  RightRail,
  TagModeProvider,
  TagPath,
  useTagMode,
  usePageMeta,
  usePageMetaValue,
  DocumentationReader,
  DocHeader,
  DocSection,
  SearchPage,
  SHELL_SCROLL_ROOT,
  ShellNavCollapsedContext,
  ShellTocCollapsedContext,
  ShellContentWidthContext,
} from '@kolkrabbi/kol-workshop'
import { buildTagCounts } from '@kolkrabbi/kol-markdown'
import { SegmentedToggle, SettingsChoice, Table, Tag, useScrollSpy } from '@kolkrabbi/kol-component'
import { Icon } from '@kolkrabbi/kol-icons'
import { CORPUS, DOC_MODULES, SPACES, DEV_PAGES, COMPONENTS, BLOCKS, SETS, componentHref, docSpace } from 'workshop-fixture'

/* apps/workshop — kol-workshop's shell over workshop-fixture, built to the space table
 * (plan-2026-09-28-showcase-refinement § 3b): each space owns its left rail and its right rail,
 * every space root is an index page in the space's own layout, `/` is the only landing, search
 * is the header's search modal plus the page Enter opens, and the second wordmark names the space. */

const { inventory, tree, componentTree, searchItems, hrefOf } = CORPUS
const DOCS = inventory.filter((d) => docSpace(d.file) === 'docs')
const DEV_DOCS = inventory.filter((d) => docSpace(d.file) === 'development')
const titleCase = (s) => s.replace(/^./, (x) => x.toUpperCase())

const APPS = [
  { key: 'workshop', port: 5183, what: 'This shell over the fixture.' },
  { key: 'markdown', port: 5184, what: 'kol-markdown over the fixture.' },
  { key: 'search', port: 5185, what: 'kol-search over the fixture.' },
]
const appHref = (a) => (import.meta.env.DEV ? `http://localhost:${a.port}/` : `/apps/${a.key}/`)

/* the tag browser (graph view) reads docs and component pages */
const TAG_INVENTORY = [
  ...inventory,
  ...COMPONENTS.map((c) => ({ id: `component-${c.slug}`, title: c.name, file: `components/${c.slug}`, metadata: { title: c.name, tags: c.tags }, headings: [] })),
]
const tagDocHref = (id) => (id.startsWith('component-') ? componentHref(id.slice('component-'.length)) : hrefOf(id))
const searchHref = (q) => `/search?q=${encodeURIComponent(q)}`

const FUNCTIONS = [...new Set(COMPONENTS.map((c) => c.fn))].sort()
const functionTree = FUNCTIONS.map((fn) => ({
  id: `fn-${fn}`,
  label: titleCase(fn),
  children: COMPONENTS.filter((c) => c.fn === fn).map((c) => ({ id: `cmp-${c.slug}`, label: c.name, path: componentHref(c.slug) })),
}))

/* ── the right rail: this page's headings, the page's own context, and the space's tags ── */
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

function SpaceToc({ space }) {
  const headings = useHeadings()
  const navigate = useNavigate()
  const { openTagMode } = useTagMode()
  const meta = usePageMetaValue()
  const activeId = useScrollSpy(headings.map((h) => h.id), { root: SHELL_SCROLL_ROOT })
  /* the space's own most-used tags, not the whole site's */
  const topTags = useMemo(() => {
    const inSpace = searchItems.filter((i) => !space || i.space === space)
    return buildTagCounts(inSpace.map((i) => ({ metadata: { tags: i.tags ?? [] } }))).slice(0, 10)
  }, [space])
  const label = SPACES.find((s) => s.id === space)?.label
  const actions = [
    { id: 'back', label: 'Back', icon: <Icon name="arrow-left" size={14} />, onClick: () => navigate(-1) },
    ...(space ? [{ id: 'search', label: `Search ${label}`, icon: <Icon name="search" size={14} />, to: searchHref(`in:${space} `) }] : []),
    { id: 'graph', label: 'Tag graph', icon: <Icon name="polygon" size={14} />, onClick: () => openTagMode(null, { view: 'graph' }) },
  ]
  return (
    <RightRail
      toc={headings}
      activeId={activeId}
      related={(meta?.related ?? []).map((r) => ({ id: r.to, label: r.label, href: r.to }))}
      actions={actions}
      topTags={topTags}
      tags={meta?.tags ?? []}
      renderTag={(tag) => <TagPath tag={tag} />}
      onTagClick={(tag) => navigate(searchHref(`#${tag}`))}
      icon={Icon}
    />
  )
}

/* ── the left rail: one per space ── */
const flat = (list) => list.map((x) => ({ id: x.id, label: x.label, path: x.path }))

function SpaceRail({ space, mode, setMode, onNavigate }) {
  if (space === 'components') {
    return (
      <div className="shell-rail-stack">
        <div>
          <p className="shell-sidebar-label kol-doc-eyebrow">Group by</p>
          <SegmentedToggle options={[{ value: 'atomic', label: 'Atomic' }, { value: 'function', label: 'Function' }]} value={mode} onChange={setMode} size="sm" />
        </div>
        <ShellSidebar routes={mode === 'atomic' ? componentTree : functionTree} basePath="/" label="Components" onNavigate={onNavigate} />
      </div>
    )
  }
  const one = (label, routes) => <div className="shell-rail-stack"><ShellSidebar routes={routes} basePath="/" label={label} onNavigate={onNavigate} /></div>
  if (space === 'blocks') return one('Blocks', flat(BLOCKS.map((b) => ({ id: `b-${b.key}`, label: b.title, path: `/blocks/${b.key}` }))))
  if (space === 'sets') return one('Sets', flat(SETS.map((s) => ({ id: `s-${s.key}`, label: s.title, path: `/sets/${s.key}` }))))
  if (space === 'apps') return one('Apps', APPS.map((a) => ({ id: `a-${a.key}`, label: a.key, path: `/apps#${a.key}` })))
  if (space === 'docs') {
    return (
      <div className="shell-rail-stack">
        <ShellSidebar routes={tree.filter((g) => g.category === 'documentation')} basePath="/" label="Documentation" onNavigate={onNavigate} />
        <ShellSidebar routes={tree.filter((g) => g.category === 'operations')} basePath="/" label="Operations" onNavigate={onNavigate} />
      </div>
    )
  }
  if (space === 'development') {
    return (
      <div className="shell-rail-stack">
        <ShellSidebar routes={DEV_PAGES.map((p) => ({ id: p.id, label: p.title, path: p.href }))} basePath="/" label="Tools" onNavigate={onNavigate} />
        <ShellSidebar routes={tree.filter((g) => g.category === 'development')} basePath="/" label="Records" onNavigate={onNavigate} />
      </div>
    )
  }
  return one('Spaces', SPACES.map((s) => ({ id: s.id, label: s.label, path: s.path })))
}

function Chrome() {
  const [mode, setMode] = useState('atomic')
  const settings = [{ label: 'Components', rows: [
    { id: 'group', label: 'Group the rail by', render: () => <SettingsChoice value={mode} onChange={setMode} options={[{ value: 'atomic', label: 'Atomic' }, { value: 'function', label: 'Function' }]} /> },
  ] }]
  return (
    <ShellLayout
      routes={SPACES}
      basePath="/"
      renderSidebar={({ activeRoute, onNavigate }) => <SpaceRail space={activeRoute?.id} mode={mode} setMode={setMode} onNavigate={onNavigate} />}
      defaultTocContent={({ activeRoute }) => <SpaceToc space={activeRoute?.id} />}
      searchItems={searchItems}
      searchPath="/search"
      brandLabel={({ activeRoute }) => activeRoute?.label ?? 'Design system'}
      settings={settings}
    />
  )
}

/* ── pages ── */
const Page = ({ children }) => <div className="flex flex-col gap-10 pb-24">{children}</div>
const linkCls = 'kol-doc-body underline decoration-fg-16 underline-offset-4 hover:decoration-fg-64'
const LinkList = ({ items }) => (
  <ul className="flex flex-col gap-2">
    {items.map(([to, label, note]) => (
      <li key={to} className="kol-doc-body"><Link className={linkCls} to={to}>{label}</Link>{note ? <span className="text-subtle"> — {note}</span> : null}</li>
    ))}
  </ul>
)

/* THE LANDING — the only page without rails, spanning the track */
function Home() {
  const setNav = useContext(ShellNavCollapsedContext)
  const setToc = useContext(ShellTocCollapsedContext)
  const setWidth = useContext(ShellContentWidthContext)
  useLayoutEffect(() => {
    setNav?.(true); setToc?.(true); setWidth?.('shell')
    return () => { setNav?.(false); setToc?.(false); setWidth?.('canvas') }
  }, [setNav, setToc, setWidth])
  return (
    <Page>
      <DocHeader
        eyebrow="Fixture"
        title="The workshop shell, alone."
        lede="kol-workshop's header, rails, search modal, reader and search page over an invented corpus — 19 docs, 24 components, 3 blocks, 2 sets. Nothing here is the real design system."
      />
      <DocSection id="spaces" title="Spaces">
        <LinkList items={SPACES.map((s) => [s.path, s.label])} />
      </DocSection>
    </Page>
  )
}

function Components() {
  usePageMeta({ tags: [], related: [] })
  const tiers = ['Atoms', 'Molecules', 'Organisms', 'Utilities']
  return (
    <Page>
      <DocHeader eyebrow="Components" title="Components" lede={`${COMPONENTS.length} invented components across four tiers.`} />
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
  const usedIn = c ? [
    ...BLOCKS.filter((b) => b.uses.includes(c.name)).map((b) => ({ to: `/blocks/${b.key}`, label: `Block · ${b.title}` })),
    ...SETS.filter((s) => s.members.includes(c.name)).map((s) => ({ to: `/sets/${s.key}`, label: `Set · ${s.title}` })),
  ] : []
  const siblings = c ? COMPONENTS.filter((x) => x.category === c.category && x.slug !== c.slug).slice(0, 5).map((x) => ({ to: componentHref(x.slug), label: x.name })) : []
  usePageMeta(c ? { tags: c.tags, related: [...usedIn, ...siblings] } : null)
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
      {usedIn.length > 0 && (
        <DocSection id="used-in" title="Used in">
          <LinkList items={usedIn.map((u) => [u.to, u.label])} />
        </DocSection>
      )}
    </Page>
  )
}

/* Blocks and Sets roots: index pages in the space's own layout, not landings */
function Collection({ kind }) {
  usePageMeta({ tags: [], related: [] })
  const list = kind === 'blocks' ? BLOCKS : SETS
  const title = titleCase(kind)
  return (
    <Page>
      <DocHeader eyebrow={title} title={title} lede={`${list.length} invented ${kind}.`} />
      <DocSection id="all" title={`All ${kind}`}>
        <LinkList items={list.map((item) => [`/${kind}/${item.key}`, item.title, item.description])} />
      </DocSection>
    </Page>
  )
}

function CollectionItem({ kind }) {
  const { key } = useParams()
  const item = (kind === 'blocks' ? BLOCKS : SETS).find((x) => x.key === key)
  const names = item ? (item.uses ?? item.members) : []
  const members = names.map((n) => COMPONENTS.find((x) => x.name === n)).filter(Boolean)
  usePageMeta(item ? { tags: [...new Set(members.flatMap((m) => m.tags))], related: members.map((m) => ({ to: componentHref(m.slug), label: m.name })) } : null)
  if (!item) return <Navigate to={`/${kind}`} replace />
  return (
    <Page>
      <DocHeader eyebrow={kind === 'blocks' ? 'Block' : 'Set'} title={item.title} lede={item.description} />
      <DocSection id="members" title={kind === 'blocks' ? 'Built from' : 'Members'}>
        <LinkList items={members.map((m) => [componentHref(m.slug), m.name, m.description])} />
      </DocSection>
    </Page>
  )
}

function chapterList(category) {
  return tree.filter((g) => g.category === category).map((g) => [g.path ?? g.children[0]?.path, g.label, `${g.children.length} page${g.children.length === 1 ? '' : 's'}`])
}

function DocsIndex() {
  usePageMeta({ tags: [], related: [] })
  return (
    <Page>
      <DocHeader eyebrow="Docs" title="Docs" lede="The written record — how the system is built, and how the repo around it runs." />
      <DocSection id="documentation" title="Documentation"><LinkList items={chapterList('documentation')} /></DocSection>
      <DocSection id="operations" title="Operations"><LinkList items={chapterList('operations')} /></DocSection>
    </Page>
  )
}

function Development() {
  usePageMeta({ tags: [], related: [] })
  return (
    <Page>
      <DocHeader eyebrow="Development" title="Development" lede="What the repo measures about itself — generated tools, and dated audits and reports." />
      <DocSection id="tools" title="Tools"><LinkList items={DEV_PAGES.map((p) => [p.href, p.title, p.description])} /></DocSection>
      <DocSection id="records" title="Audits and reports"><LinkList items={chapterList('development')} /></DocSection>
    </Page>
  )
}

function References() {
  usePageMeta({ tags: [], related: [] })
  const rows = COMPONENTS.map((c) => ({
    id: c.slug,
    name: c.name,
    blocks: BLOCKS.filter((b) => b.uses.includes(c.name)).length,
    sets: SETS.filter((s) => s.members.includes(c.name)).length,
  })).map((r) => ({ ...r, total: r.blocks + r.sets }))
  return (
    <Page>
      <DocHeader eyebrow="Development" title="References" lede="Who uses what — counted from the fixture's blocks and sets." />
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

function Quarantine() {
  usePageMeta({ tags: [], related: [] })
  return (
    <Page>
      <DocHeader eyebrow="Development" title="Quarantine" lede="Nothing is held in the fixture. The showcase's page records what its sidebar admits, and why." />
    </Page>
  )
}

function Apps() {
  usePageMeta({ tags: [], related: [] })
  return (
    <Page>
      <DocHeader eyebrow="Apps" title="Apps" lede="The three apps that share workshop-fixture." />
      <DocSection id="apps" title="Apps">
        <ul className="flex flex-col gap-2">
          {APPS.map((a) => (
            <li key={a.key} id={a.key} className="kol-doc-body"><a className={linkCls} href={appHref(a)}>apps/{a.key}</a> — {a.what}</li>
          ))}
        </ul>
      </DocSection>
    </Page>
  )
}

const reader = (docs) => (
  <DocumentationReader inventory={docs} modules={DOC_MODULES} docHref={hrefOf} routes={{ docsIndex: '/docs', components: '/components' }} />
)

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
        <Route path="/docs" element={<DocsIndex />} />
        <Route path="/docs/:docId" element={reader(DOCS)} />
        <Route path="/development" element={<Development />} />
        <Route path="/development/references" element={<References />} />
        <Route path="/development/quarantine" element={<Quarantine />} />
        <Route path="/development/:docId" element={reader(DEV_DOCS)} />
        <Route path="/apps" element={<Apps />} />
        <Route path="/search" element={<SearchPage items={searchItems} spaces={SPACES.map((s) => ({ value: s.id, label: s.label }))} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
