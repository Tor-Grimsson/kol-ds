import { useEffect, useMemo, useState } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { ShellLayout, ShellSidebar, RightRail, useTagMode, usePageMetaValue, TagPath, SHELL_SCROLL_ROOT } from '@kolkrabbi/kol-workshop'
import { buildTagCounts, cleanTitle } from '@kolkrabbi/kol-markdown'
import { IconFrame, SegmentedToggle, SettingsChoice, Tooltip, useScrollSpy } from '@kolkrabbi/kol-component'
import { Icon } from '@kolkrabbi/kol-icons'
import { useGrouping, GROUP_OPTIONS } from './grouping.jsx'
import { useFrontmatterToggle } from './frontmatter.jsx'
import { SHELL_ROUTES, DOCS_GUIDES, DOCS_SPECIMENS, DEV_TOOLS, SEARCH_VIEWS, LOOKUP_GROUPS, LOOKUP_ROOT, lastSearchQuery, isShellTabActive, buildShellSearchItems, componentTreeRoutes, admittedVaultTree } from '../nav/shell-nav.js'
import PAGE_SECTIONS from '../nav/page-sections.json'
import { PHASE_LOG_ROUTE, VAULT, vaultDocHref } from '../nav/vault.js'
import { BLOCKS, BLOCK_CATEGORIES, CATEGORY_LABELS as BLOCK_LABELS } from './blocks-registry.js'
import { CARDS } from './cards-registry.js'
import { SETS } from './sets-registry.js'
import { isSurfaceAdmitted, anyComponentsAdmitted } from '../nav/admitted.js'
import { labelFromSlug } from '../nav/labels.js'
import { COMPONENTS_AZ } from '../nav/registry.js'
import { ICON_SETS, iconGroups } from '../pages/IconsGallery.jsx'
import { LOBBY_CHAPTERS, LOBBY_INDEX } from '../pages/Lobby.jsx'
import { PACKAGES, TIER_ORDER, packageHref, tierHref, tierLabel } from '../pages/Packages.jsx'
import { APPS, LAYERS } from '../pages/Apps.jsx'
import { ROUNDS, roundHref } from '../pages/OpenQuestions.jsx'
import useEmbed from './useEmbed.js'

/* a set member's page, by export name */
const COMPONENT_BY_NAME = new Map(COMPONENTS_AZ.map((c) => [c.name, c]))

/* a vault category's own page is its INDEX.md — excluded from the tree as a row (2026-08-01), so it
 * is the eyebrow's door instead */
const categoryHref = (cat) => {
  const doc = VAULT.find((d) => new RegExp(`docs/${cat}/INDEX\\.md$`, 'i').test(d.file))
  return doc ? vaultDocHref(doc.id) : undefined
}

/**
 * ShellChrome — the showcase's chrome, mounted ONCE as a route-level layout.
 *
 * Replaces the old per-page model where 11 pages imported DocLayout (which
 * itself rendered TopBar + sidebar + TOC) and 3 imported TopBar directly:
 * fourteen copies of the same decision, which is how they drifted. Pages are
 * now content only and render into the shell's <Outlet/>.
 *
 * The TOC is DERIVED, never passed. Every docs framework (Docusaurus, Nextra,
 * Starlight) walks the rendered headings instead of asking each page for an
 * array — the hand-written arrays here went stale against their own headings.
 */

/* Auto-TOC: read the headings the page actually rendered. Runs after paint on
 * every navigation, and again when the main column mutates (async previews,
 * lazily-mounted sections). ids are required — a heading without one can't be
 * linked, so it's skipped rather than silently mis-anchored. */
function useHeadings() {
  const { pathname } = useLocation()
  const [items, setItems] = useState([])

  useEffect(() => {
    const main = document.getElementById('main')
    if (!main) return undefined

    const read = () => {
      /* SPECIMENS ARE NOT THE PAGE (2026-07-30): a heading inside a preview or a
       * type specimen is sample content, excluded at the source. */
      /* THE TITLE IS ON THIS PAGE TOO (2026-10-01 — user: "should on this page not also show the
       * first part even if it is h1?" · "something is always on this page"). The h1 leads the
       * outline, so a page with no h2 still lists itself. Titles carry no id, so the first one
       * is given the page-top anchor. */
      const found = [...main.querySelectorAll('h1, h2, h3')]
        .filter((h) => !h.closest('[data-toc-skip], .kol-doc-figure, .kol-preview-stage'))
        .map((h) => {
          if (h.tagName === 'H1' && !h.id && !document.getElementById('page-top')) h.id = 'page-top'
          const id = h.id || h.closest('section[id]')?.id
          return id ? { id, label: h.textContent.trim(), sub: h.tagName === 'H3' } : null
        })
        /* one row per anchor — two headings resolving to one section id are one place (W18) */
        .filter((x, i, all) => x && all.findIndex((y) => y?.id === x.id) === i)
      setItems((prev) =>
        /* labels too — a title that rewrites itself (the results count) kept its first text */
        prev.length === found.length && prev.every((p, i) => p.id === found[i].id && p.label === found[i].label) ? prev : found
      )
    }

    read()
    const observer = new MutationObserver(read)
    observer.observe(main, { childList: true, subtree: true, characterData: true })
    return () => observer.disconnect()
  }, [pathname])

  return items
}

const SEARCH_ITEMS = buildShellSearchItems()
const searchHref = (q) => `/search/results?q=${encodeURIComponent(q)}`

/* THE RIGHT RAIL, PER SPACE (showcase refinement 2026-09-28, user: "each space has its own
 * content and the purpose of the right sidebar is to list that pages content and context"). It
 * was handed `tags={[]}` and `related={[]}` on every route and the site's global top tags, so it
 * read the same everywhere. Now: this page's headings, the tags and related links the PAGE
 * publishes (`usePageMeta`), and the most-used tags of the SPACE you are in. A tag opens the
 * search page filtered by it (`#tag`); the tag graph stays one click away. */
function SpaceToc({ space }) {
  const headings = useHeadings()
  const navigate = useNavigate()
  const { openTagMode } = useTagMode()
  const meta = usePageMetaValue()
  const activeId = useScrollSpy(headings.map((h) => h.id), { root: SHELL_SCROLL_ROOT })
  const topTags = useMemo(() => {
    const inSpace = SEARCH_ITEMS.filter((i) => !space || i.space === space)
    return buildTagCounts(inSpace.map((i) => ({ metadata: { tags: i.tags ?? [] } }))).slice(0, 10)
  }, [space])
  const label = SHELL_ROUTES.find((r) => r.id === space)?.label

  const actions = [
    { id: 'back', label: 'Back', icon: <Icon name="arrow-left" size={14} />, onClick: () => navigate(-1) },
    ...(space ? [{ id: 'search', label: `Search ${label}`, icon: <Icon name="search" size={14} />, to: searchHref(`in:${space} `) }] : []),
    { id: 'copy', label: 'Copy path', icon: <Icon name="copy" size={14} />, onClick: () => navigator.clipboard.writeText(window.location.href) },
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
      tagsHref="/search/tags"
      icon={Icon}
    />
  )
}

/* THE LEFT RAIL, PER SPACE (2026-09-28, user: the left sidebar "does not change between any of
 * the spaces, it always just shows the same toggle atomic/function and atoms list expanded"). Each
 * space draws its own; the Tools group is gone — the header already lists the spaces, and a
 * second door to each was "one body of content, two doors". */

/* a row keeps the glyph its data names (2026-10-02) — the drawer's Spaces rows dropped theirs here */
const rowsOf = (list) => list.map((x) => ({ id: x.id, label: x.label, path: x.path, ...(x.icon ? { icon: x.icon } : null) }))

/* A ROW WITH NO CHILDREN LISTS ITS PAGE'S SECTIONS (2026-10-01 — user: "cant we just use # to link
 * to sections? something so the sidebar doesnt look so dislocated when there are no sub items?").
 * The sections are read off the rendered page into `nav/page-sections.json` (`pnpm
 * extract:sections`); a page with fewer than two has nothing to list and stays a row. A count
 * printed into a heading ("Admitted — 12") is dropped — the manifest is not re-read per render. */
/* RAIL GLYPHS (open-questions Round 6, ruled 2026-10-01): a glyph on every group, and on the pages
 * of Docs and Styles. The ~325 component rows stay text. A route named here wears that glyph; any
 * other group wears the folder, any other Docs or Styles page the file. */
const RAIL_ICONS = {
  'lib-components': 'component-01', 'lib-blocks': 'layout', 'lib-apps': 'desktop', 'lib-sets': 'layers', 'lib-packages': 'database',
  'cmp-atoms': 'atomic-atom', 'cmp-molecules': 'atomic-molecule-01', 'cmp-organisms': 'atomic-organism-01', 'cmp-utilities': 'nav-settings',
  'set-cards': 'rectangle',
  'spec-foundations': 'slider-01', 'spec-color': 'paint-drop', 'spec-typography': 'type', 'spec-tones': 'opacity',
  'docs-shell': 'layout', 'docs-menus': 'hamburger', 'docs-loaders': 'refresh', 'docs-type-roles': 'aa',
  'search-results': 'search', 'search-tags': 'hash-01', 'search-graph': 'polygon', 'search-index': 'view-list',
  'dev-references': 'code', 'dev-quarantine': 'lock', 'dev-open-questions': 'message', 'dev-phase-log': 'journal',
  /* EVERY GROUP ITS OWN GLYPH (user 2026-10-02: "all use the same icon? … the way icons are put in
   * generally is a bit lazy") — the folder was the fallback for every group below this line */
  'lookup-start': 'flag', 'lookup-foundations': 'foundation', 'lookup-taxonomy': 'atomic-atomic-01',
  'cmp-action': 'pointer', 'cmp-display': 'eye-on', 'cmp-feedback': 'bell', 'cmp-input': 'edit', 'cmp-media': 'image',
  'cmp-navigation': 'direction-cross', 'cmp-overlay': 'toggle-overlay', 'cmp-structure': 'columns', 'cmp-wayfinding': 'roadmap', 'cmp-utility': 'nav-settings',
  'blk-hero': 'image', 'blk-marketing': 'trending-up', 'blk-content': 'journal', 'blk-media': 'video', 'blk-color': 'paint-drop',
  'blk-navigation': 'panel-left', 'blk-panel': 'panel-right', 'blk-form': 'clipboard', 'blk-toolbar': 'slider-02', 'blk-other': 'more',
  'layer-engine': 'bolt', 'layer-shell': 'panel-left', 'layer-hub': 'home-01', 'layer-catalog': 'grid', 'layer-tool': 'pen', 'layer-fixture': 'database',
  'pkg-tier-UI': 'metrics', 'pkg-tier-app': 'desktop', 'pkg-tier-engine': 'bolt', 'pkg-tier-client': 'cloud', 'pkg-tier-brand kit': 'kolkrabbi', 'pkg-tier-deprecated alias': 'trash',
  'set-app-shell': 'panel-left', 'set-chess-apparatus': 'chess-rook', 'set-content-filters': 'filter', 'set-content-set-reference': 'rows',
  'set-design-editor': 'pen-nib', 'set-foundry-specimen': 'font-01', 'set-kind-preview': 'eye-on', 'set-media-library': 'image',
  'set-metrics-dashboard': 'stat-chart-a', 'set-mixer': 'slider-02', 'set-prints-store': 'bucket', 'set-rack': 'rack-v',
  'set-record-manager-cms': 'database', 'set-section-set': 'row', 'set-stack-blog': 'journal', 'set-styleguide': 'paint-drop', 'set-work-portfolio': 'grid',
}
/* the vault's chapters carry generated ids (`vault-<category>-<chapter>`) — matched by their chapter */
const RAIL_ICON_RULES = [
  [/^vault-.*overview/, 'info'], [/^vault-.*foundations/, 'foundation'], [/^vault-.*icons/, 'star'], [/^vault-.*components/, 'component-01'],
  [/^vault-.*compositions/, 'layout'], [/^vault-.*brand/, 'kolkrabbi'], [/^vault-.*research/, 'search'], [/^vault-.*breakpoints/, 'mobile'],
  [/^vault-.*release/, 'upload'], [/^vault-.*workbench/, 'terminal'], [/^vault-.*showcase/, 'desktop'], [/^vault-.*content-pipeline/, 'cable-on'],
  [/^vault-.*reference-graph/, 'polygon'], [/^vault-.*workflows/, 'roadmap'], [/^vault-.*apps-tier/, 'layers'], [/^vault-.*cloud-sessions/, 'cloud'],
  [/^vault-.*phase-log/, 'journal'],
]
const withIcons = (routes, { pages = false, leaf } = {}) => routes.map((r) => {
  const group = r.children?.some((c) => !c.section)
  const icon = RAIL_ICONS[r.id] ?? r.icon ?? RAIL_ICON_RULES.find(([re]) => re.test(r.id))?.[1] ?? (r.section ? undefined : group ? 'folder' : pages ? (leaf ?? 'file') : undefined)
  return { ...r, ...(icon ? { icon } : null), ...(r.children ? { children: withIcons(r.children, { pages, leaf }) } : null) }
})

const withSections = (routes) => routes.map((r) => {
  if (r.children?.length) return { ...r, children: withSections(r.children) }
  const at = (r.path ?? '').split('?')[0]
  const sections = PAGE_SECTIONS[at]
  return sections ? { ...r, children: sections.map((x) => ({ id: `${r.id}#${x.id}`, label: x.label.replace(/\s[—·]\s\d+$/, ''), path: `${at}#${x.id}`, section: true })) } : r
})

function SpaceRail({ space, onNavigate, railMode }) {
  const { mode, setMode } = useGrouping()
  const cmpRoutes = useMemo(() => componentTreeRoutes(mode), [mode])
  const vault = useMemo(() => admittedVaultTree(), [])
  /* the category label opens the space's home (2026-09-30) */
  const one = (label, routes, labelTo) => (
    <div className="shell-rail-stack">
      <ShellSidebar routes={routes} basePath="/" label={label} labelTo={labelTo} onNavigate={onNavigate} />
    </div>
  )

  /* LIBRARY (2026-09-30, the showcase review W2 — user: "make library be the shared root, with
   * composition and collections inside as subcategories"). ONE tree under the Library eyebrow:
   * Composition by size (Components → Blocks → Apps, each made of the one before) and Collection by
   * belonging (Sets by purpose, Packages by shipping). The rail nests to any depth since W1, so
   * every level is a fold with its own page: Library › Composition › Components › Atoms › Button. */
  if (space === 'library') {
    const blocks = BLOCK_CATEGORIES.map((cat) => ({
      id: `blk-${cat}`,
      label: BLOCK_LABELS[cat] ?? labelFromSlug(cat),
      path: `/modules/category/${cat}`,
      children: BLOCKS.filter((b) => b.category === cat).map((b) => ({ id: `block-${b.key}`, label: b.title, path: `/modules/${b.key}` })),
    }))
    /* the layers as chapters — each opens its layer home (2026-09-30) */
    const apps = LAYERS.map((l) => ({
      id: `layer-${l.id}`,
      label: l.label,
      path: `/apps/layer/${l.id}`,
      children: APPS.filter((a) => a.layer === l.id).map((a) => ({ id: `app-${a.name}`, label: a.name, path: `/app/${a.name}` })),
    }))
    /* Cards is a set (2026-09-30); a set that was one package's family is that package's page */
    const sets = [
      {
        id: 'set-cards',
        label: 'Cards',
        path: '/cards',
        children: CARDS.map((c) => ({ id: `card-${c.key}`, label: c.title, path: `/cards/${c.key}` })),
      },
      /* EVERY SET IS A GROUP OF ITS MEMBERS (W4, 2026-09-30 — user: "sets is wrong in the sidebar":
       * Cards folded and the rest were bare rows, two levels for one kind of thing). A set's members
       * are the components it is built from (usage/composition.json), each opening its page. */
      ...SETS.map((x) => ({
        id: `set-${x.key}`,
        /* the NAME, not the title — the rail drops a subtitle after the dash (2026-08-01 ruling) */
        label: cleanTitle(x.title, x.key),
        path: `/sets/${x.key}`,
        children: (x.composition?.kol ?? [])
          .map((name) => COMPONENT_BY_NAME.get(name))
          .filter(Boolean)
          .map((c) => ({ id: `set-${x.key}-${c.slug}`, label: c.displayName, path: `/components/${c.slug}` })),
      })),
    ]
    const packages = TIER_ORDER.filter((tier) => PACKAGES.some((p) => p.tier === tier)).map((tier) => ({
      id: `pkg-tier-${tier}`,
      label: tierLabel(tier),
      path: tierHref(tier),
      children: PACKAGES.filter((p) => p.tier === tier).map((p) => ({ id: `pkg-${p.dir}`, label: p.pkg.name.replace('@kolkrabbi/', ''), path: packageHref(p.dir) })),
    }))
    const composition = [
      anyComponentsAdmitted() && { id: 'lib-components', label: 'Components', path: '/components', children: cmpRoutes },
      isSurfaceAdmitted('blocks') && { id: 'lib-blocks', label: 'Modules', path: '/modules', children: blocks },
      isSurfaceAdmitted('apps') && { id: 'lib-apps', label: 'Apps', path: '/apps', children: apps },
    ].filter(Boolean)
    const collection = [
      isSurfaceAdmitted('sets') && { id: 'lib-sets', label: 'Sets', path: '/sets', children: sets },
      { id: 'lib-packages', label: 'Packages', path: '/packages', children: packages },
    ].filter(Boolean)
    return (
      <div className="shell-rail-stack">
        {/* a control has no place on an icon rail — it returns when the rail opens */}
        {anyComponentsAdmitted() && railMode !== 'icons' && railMode !== 'full' && (
          <div>
            {/* the category opens its page (2026-09-30) */}
            <Link to="/components/group-by" className="shell-sidebar-label kol-doc-eyebrow block">Group by</Link>
            <SegmentedToggle
              options={GROUP_OPTIONS}
              value={mode}
              onChange={setMode}
              size="sm"
            />
          </div>
        )}
        {/* LOOKUP leads the rail (2026-10-01): the names and values you check while building — one
          * section of three groups since 2026-10-02 (Start · Foundations · Taxonomy) */}
        <ShellSidebar routes={withIcons(LOOKUP_GROUPS.map((g) => ({ id: g.id, label: g.label, path: g.path, children: rowsOf(g.items) })), { pages: true })} basePath="/" label="Lookup" labelTo={LOOKUP_ROOT} onNavigate={onNavigate} />
        {/* NO "LIBRARY" LEVEL (2026-10-01 — user: "why does library as a home have to list it self
          * as the parent? … it should just show group-by, composition and Collection as top level
          * (uppercase)"). The space is the header tab; its two chapters are the rail's eyebrows. */}
        {composition.length > 0 && <ShellSidebar routes={withIcons(composition)} basePath="/" label="Composition" labelTo="/composition" onNavigate={onNavigate} />}
        <ShellSidebar routes={withIcons(collection)} basePath="/" label="Collection" labelTo="/collection" onNavigate={onNavigate} />
      </div>
    )
  }
  /* SEARCH (2026-09-30): the four ways to find a page */
  if (space === 'search') {
    /* the Results row returns to the query you left (2026-10-01), the eyebrow to the search home */
    /* NO "SEARCH" LEVEL (2026-10-01, the Library ruling applied here): the space is the header tab,
     * its four views are the rail — each listing its own sections. */
    return one(null, withIcons(withSections(SEARCH_VIEWS.map((v) => ({ id: `search-${v.value}`, label: v.label, path: v.value === 'results' ? `${v.path}${lastSearchQuery()}` : v.path })))), '/search')
  }
  /* DOCS IS THE VAULT (2026-09-30): Documentation and Operations, as `docs/` is on disk. The
   * guides and the live specimens left for Styles. */
  if (space === 'docs') {
    return (
      <div className="shell-rail-stack">
        {/* each category opens its own INDEX.md (W3, 2026-09-30 — the eyebrows linked nowhere) */}
        <ShellSidebar routes={withIcons(vault.filter((g) => g.category === 'documentation'), { pages: true })} basePath="/" label="Documentation" labelTo={categoryHref('documentation')} onNavigate={onNavigate} />
        <ShellSidebar routes={withIcons(vault.filter((g) => g.category === 'operations'), { pages: true })} basePath="/" label="Operations" labelTo={categoryHref('operations')} onNavigate={onNavigate} />
      </div>
    )
  }
  /* STYLES (2026-09-30): the reference lookup — foundations read off the packages, the icon
   * sets, the guides. */
  if (space === 'styles') {
    /* NO "STYLES" LEVEL (2026-10-01, the Library ruling applied here): Foundations, Icons and
     * Guides are the rail's top layer; a page with no children lists its sections. */
    return (
      <div className="shell-rail-stack">
        <ShellSidebar routes={withIcons(withSections(rowsOf(DOCS_SPECIMENS.filter((x) => !x.parent))).map((r) => {
          /* a page filed under another (`parent`) rides after that page's sections */
          const kids = rowsOf(DOCS_SPECIMENS.filter((x) => x.parent === r.id))
          return kids.length ? { ...r, children: [...(r.children ?? []), ...kids] } : r
        }), { pages: true })} basePath="/" label="Foundations" labelTo="/foundations" onNavigate={onNavigate} />
        {/* each set is a group of its icon groups, each a page (W3, 2026-09-30) */}
        <ShellSidebar routes={withIcons(Object.keys(ICON_SETS).map((k) => ({ id: `icons-${k}`, label: labelFromSlug(k.replace('kol-icon-set-', '')), path: `/icons/${k}`, children: iconGroups(k).map((g) => ({ id: `icons-${k}-${g.folder}`, label: g.label, path: `/icons/${k}/${g.folder}` })) })), { pages: true, leaf: 'grid' })} basePath="/" label="Icons" labelTo="/icons" onNavigate={onNavigate} />
        <ShellSidebar routes={withIcons(withSections(rowsOf(DOCS_GUIDES)), { pages: true })} basePath="/" label="Guides" labelTo="/styles/guides" onNavigate={onNavigate} />
      </div>
    )
  }
  if (space === 'development') {
    const tools = withIcons(withSections(rowsOf(DEV_TOOLS)))
    return (
      <div className="shell-rail-stack">
        <ShellSidebar routes={tools} basePath="/" label="Tools" labelTo="/development/tools" onNavigate={onNavigate} />
        <ShellSidebar routes={[PHASE_LOG_ROUTE, { id: 'dev-open-questions', label: 'Open questions', path: '/development/open-questions', children: ROUNDS.map((r) => ({ id: `oq-${r.slug}`, label: `Round ${r.meta.round}`, path: roundHref(r.slug) })) }]} basePath="/" label="Records" labelTo="/development/records" onNavigate={onNavigate} />
        {/* the lobby — dev only, read like a record: the ledger on the label, Inbox · Done · Archive */}
        {import.meta.env.DEV && <ShellSidebar routes={LOBBY_CHAPTERS} basePath="/" label="Lobby" labelTo={LOBBY_INDEX} onNavigate={onNavigate} />}
      </div>
    )
  }
  return one('Spaces', rowsOf(SHELL_ROUTES))
}

const REPO = 'https://github.com/Tor-Grimsson/kol-ds'

export default function ShellChrome() {
  const { pathname } = useLocation()
  const embedded = useEmbed()
  const { mode, setMode } = useGrouping()
  const searchItems = SEARCH_ITEMS
  const toggleFrontmatter = useFrontmatterToggle()

  /* ?embed=1 — main content only, for iframing showcase pages into other
   * repos. The shell is fixed inset-0 with its own scroll regions, so embed
   * bypasses it entirely rather than trying to hide its parts. */
  if (embedded) {
    return (
      <main id="main" className="min-h-dvh w-full">
        <div
          className="mx-auto w-full min-w-0 max-w-[var(--kol-content-shell)]"
          style={{ padding: 'var(--kol-pad-section-y) var(--kol-pad-section-x)' }}
        >
          <Outlet />
        </div>
      </main>
    )
  }

  return (
    <ShellLayout
      routes={SHELL_ROUTES}
      basePath="/"
      isActive={isShellTabActive(pathname)}
      renderSidebar={({ activeRoute, onNavigate, mode: railMode }) => <SpaceRail space={activeRoute?.id} onNavigate={onNavigate} railMode={railMode} />}
      defaultTocContent={({ activeRoute }) => <SpaceToc space={activeRoute?.id} />}
      searchItems={searchItems}
      searchPath="/search/results"
      shortcuts={[{ id: 'frontmatter', label: 'Frontmatter', combo: 'F', key: 'f', run: toggleFrontmatter }]}
      /* the second wordmark names the space you are in (user: "change the 'workshop' to say …
       * 'design system' when you land … then it could change with the site's navigation") */
      brandLabel={({ activeRoute }) => activeRoute?.label ?? 'Design system'}
      /* GITHUB IS BACK IN THE HEADER (user ruling 2026-10-02): four glyphs — GitHub · search ·
       * settings · theme. Round 3 had moved it into the drawer's Links section. Same rung and
       * variant as the shell's own three (the row law: every header glyph on one rung). */
      actions={(
        <Tooltip label="GitHub">
          <IconFrame name="social-github" variant="nav" size="md" href={REPO} target="_blank" rel="noreferrer" aria-label="GitHub" />
        </Tooltip>
      )}
      settings={[{ label: 'Components', rows: [
        { id: 'group', label: 'Group by', render: () => (
          <SettingsChoice value={mode} onChange={setMode} options={GROUP_OPTIONS} />
        ) },
      ] }]}
    />
  )
}
