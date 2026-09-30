import { useEffect, useMemo, useState } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { ShellLayout, ShellSidebar, RightRail, useTagMode, usePageMetaValue, TagPath, SHELL_SCROLL_ROOT } from '@kolkrabbi/kol-workshop'
import { buildTagCounts } from '@kolkrabbi/kol-markdown'
import { SegmentedToggle, SettingsChoice, useScrollSpy } from '@kolkrabbi/kol-component'
import { Icon } from '@kolkrabbi/kol-icons'
import { useGrouping, GROUP_OPTIONS } from './grouping.jsx'
import { useFrontmatterToggle } from './frontmatter.jsx'
import { SHELL_ROUTES, DOCS_GUIDES, DOCS_SPECIMENS, DEV_TOOLS, isShellTabActive, buildShellSearchItems, componentTreeRoutes, admittedVaultTree } from '../nav/shell-nav.js'
import { PHASE_LOG_ROUTE } from '../nav/vault.js'
import { BLOCKS, BLOCK_CATEGORIES, CATEGORY_LABELS as BLOCK_LABELS } from './blocks-registry.js'
import { CARDS, CARD_CATEGORIES, CARD_LABELS } from './cards-registry.js'
import { setsOfFamily, familyHref } from './sets-registry.js'
import { TOP_LEVEL, PACKAGE_ORDER, packageLabel } from '../nav/registry.js'
import { labelFromSlug } from '../nav/labels.js'
import { ICON_SETS } from '../pages/IconsGallery.jsx'
import { LOBBY_CHAPTERS, LOBBY_INDEX } from '../pages/Lobby.jsx'
import { PACKAGES, TIER_ORDER, packageHref } from '../pages/Packages.jsx'
import { APPS, LAYERS } from '../pages/Apps.jsx'
import { ROUNDS, roundHref } from '../pages/OpenQuestions.jsx'
import useEmbed from './useEmbed.js'

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
 * every navigation, and again when the main column mutates (async demos,
 * lazily-mounted sections). ids are required — a heading without one can't be
 * linked, so it's skipped rather than silently mis-anchored. */
function useHeadings() {
  const { pathname } = useLocation()
  const [items, setItems] = useState([])

  useEffect(() => {
    const main = document.getElementById('main')
    if (!main) return undefined

    const read = () => {
      /* SPECIMENS ARE NOT THE PAGE (2026-07-30): a heading inside a demo or a
       * type specimen is sample content, excluded at the source. */
      const found = [...main.querySelectorAll('h2, h3')]
        .filter((h) => !h.closest('[data-toc-skip], .kol-doc-figure, .kol-demo-stage'))
        .map((h) => {
          const id = h.id || h.closest('section[id]')?.id
          return id ? { id, label: h.textContent.trim(), sub: h.tagName === 'H3' } : null
        })
        .filter(Boolean)
      setItems((prev) =>
        prev.length === found.length && prev.every((p, i) => p.id === found[i].id) ? prev : found
      )
    }

    read()
    const observer = new MutationObserver(read)
    observer.observe(main, { childList: true, subtree: true })
    return () => observer.disconnect()
  }, [pathname])

  return items
}

const SEARCH_ITEMS = buildShellSearchItems()
const searchHref = (q) => `/search?q=${encodeURIComponent(q)}`

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
      icon={Icon}
    />
  )
}

/* THE LEFT RAIL, PER SPACE (2026-09-28, user: the left sidebar "does not change between any of
 * the spaces, it always just shows the same toggle atomic/function and atoms list expanded"). Each
 * space draws its own; the Tools group is gone — the header already lists the spaces, and a
 * second door to each was "one body of content, two doors". */

const rowsOf = (list) => list.map((x) => ({ id: x.id, label: x.label, path: x.path }))

function SpaceRail({ space, onNavigate }) {
  const { mode, setMode } = useGrouping()
  const cmpRoutes = useMemo(() => componentTreeRoutes(mode), [mode])
  const vault = useMemo(() => admittedVaultTree(), [])
  /* the category label opens the space's home (2026-09-30) */
  const one = (label, routes, labelTo) => (
    <div className="shell-rail-stack">
      <ShellSidebar routes={routes} basePath="/" label={label} labelTo={labelTo} onNavigate={onNavigate} />
    </div>
  )

  if (space === 'components') {
    return (
      <div className="shell-rail-stack">
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
        <ShellSidebar routes={cmpRoutes} basePath="/" label="Components" labelTo="/components" onNavigate={onNavigate} />
      </div>
    )
  }
  /* THE LADDER ON BLOCKS AND SETS (2026-09-30): a block's chapter is its own `meta.category`; a
   * set's chapter is its package family, whose header opens the family page. */
  if (space === 'blocks') {
    const chapters = BLOCK_CATEGORIES.map((cat) => ({
      id: `blk-${cat}`,
      label: BLOCK_LABELS[cat] ?? labelFromSlug(cat),
      path: `/blocks/category/${cat}`,
      children: BLOCKS.filter((b) => b.category === cat).map((b) => ({ id: `block-${b.key}`, label: b.title, path: `/blocks/${b.key}` })),
    }))
    /* CARDS IS A BLOCKS CATEGORY (2026-09-30) — its own L1 beside the blocks, like Docs' two */
    const cards = CARD_CATEGORIES.map((cat) => ({
      id: `crd-${cat}`,
      label: CARD_LABELS[cat] ?? labelFromSlug(cat),
      path: `/cards/category/${cat}`,
      children: CARDS.filter((c) => c.category === cat).map((c) => ({ id: `card-${c.key}`, label: c.title, path: `/cards/${c.key}` })),
    }))
    return (
      <div className="shell-rail-stack">
        <ShellSidebar routes={chapters} basePath="/" label="Blocks" labelTo="/blocks" onNavigate={onNavigate} />
        <ShellSidebar routes={cards} basePath="/" label="Cards" labelTo="/cards" onNavigate={onNavigate} />
      </div>
    )
  }
  /* CARDS (2026-09-30): the website sections, one chapter per kind */
  if (space === 'cards') {
    return one('Cards', CARD_CATEGORIES.map((cat) => ({
      id: `crd-${cat}`,
      label: CARD_LABELS[cat] ?? labelFromSlug(cat),
      path: `/cards/category/${cat}`,
      children: CARDS.filter((c) => c.category === cat).map((c) => ({ id: `card-${c.key}`, label: c.title, path: `/cards/${c.key}` })),
    })), '/cards')
  }
  if (space === 'sets') {
    const chapters = PACKAGE_ORDER
      .filter((dir) => TOP_LEVEL.some((c) => c.family === dir))
      /* a family with no sets is not a chapter (2026-09-30) */
      .filter((dir) => setsOfFamily(dir).length > 0)
      .map((dir) => ({
        id: `fam-${dir}`,
        label: packageLabel(dir),
        path: familyHref(dir),
        children: setsOfFamily(dir).map((s) => ({ id: `set-${s.key}`, label: s.title, path: `/sets/${s.key}` })),
      }))
    return one('Sets', chapters, '/sets')
  }
  /* DOCS IS THE VAULT (2026-09-30): Documentation and Operations, as `docs/` is on disk. The
   * guides and the live specimens left for Styles. */
  if (space === 'docs') {
    return (
      <div className="shell-rail-stack">
        <ShellSidebar routes={vault.filter((g) => g.category === 'documentation')} basePath="/" label="Documentation" onNavigate={onNavigate} />
        <ShellSidebar routes={vault.filter((g) => g.category === 'operations')} basePath="/" label="Operations" onNavigate={onNavigate} />
      </div>
    )
  }
  /* STYLES (2026-09-30): the reference lookup — foundations read off the packages, the icon
   * sets, the guides. */
  if (space === 'styles') {
    return one('Styles', [
      { id: 'sty-foundations', label: 'Foundations', path: '/foundations', children: rowsOf(DOCS_SPECIMENS) },
      { id: 'sty-icons', label: 'Icons', path: '/icons', children: Object.entries(ICON_SETS).map(([k, s]) => ({ id: `icons-${k}`, label: labelFromSlug(k.replace('kol-icon-set-', '')), path: `/icons/${k}` })) },
      { id: 'sty-guides', label: 'Guides', path: '/styles/guides', children: rowsOf(DOCS_GUIDES) },
    ], '/styles')
  }
  /* the Apps rail is the index's layers, each app to its home (apps review 2026-09-29) */
  if (space === 'apps') {
    /* one category, the layers as chapters — each opens its layer home (2026-09-30) */
    return one('Apps', LAYERS.map((l) => ({
      id: `layer-${l.id}`,
      label: l.label,
      path: `/apps/layer/${l.id}`,
      children: APPS.filter((a) => a.layer === l.id).map((a) => ({ id: `app-${a.name}`, label: a.name, path: `/app/${a.name}` })),
    })), '/apps')
  }
  if (space === 'packages') {
    return (
      <div className="shell-rail-stack">
        {/* every published package, by tier — its own space since 2026-09-30 */}
        <ShellSidebar
          routes={TIER_ORDER.filter((tier) => PACKAGES.some((p) => p.tier === tier)).map((tier) => ({
            id: `pkg-tier-${tier}`,
            label: tier.charAt(0).toUpperCase() + tier.slice(1),
            children: PACKAGES.filter((p) => p.tier === tier).map((p) => ({ id: `pkg-${p.dir}`, label: p.pkg.name.replace('@kolkrabbi/', ''), path: packageHref(p.dir) })),
          }))}
          basePath="/"
          label="Packages"
          labelTo="/packages"
          onNavigate={onNavigate}
        />
      </div>
    )
  }
  if (space === 'development') {
    const tools = rowsOf(DEV_TOOLS)
    return (
      <div className="shell-rail-stack">
        <ShellSidebar routes={tools} basePath="/" label="Tools" onNavigate={onNavigate} />
        <ShellSidebar routes={[PHASE_LOG_ROUTE, { id: 'dev-open-questions', label: 'Open questions', path: '/development/open-questions', children: ROUNDS.map((r) => ({ id: `oq-${r.slug}`, label: `Round ${r.meta.round}`, path: roundHref(r.slug) })) }]} basePath="/" label="Records" onNavigate={onNavigate} />
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
      renderSidebar={({ activeRoute, onNavigate }) => <SpaceRail space={activeRoute?.id} onNavigate={onNavigate} />}
      defaultTocContent={({ activeRoute }) => <SpaceToc space={activeRoute?.id} />}
      searchItems={searchItems}
      searchPath="/search"
      shortcuts={[{ id: 'frontmatter', label: 'Show or hide frontmatter', combo: 'F', key: 'f', run: toggleFrontmatter }]}
      /* the second wordmark names the space you are in (user: "change the 'workshop' to say …
       * 'design system' when you land … then it could change with the site's navigation") */
      brandLabel={({ activeRoute }) => activeRoute?.label ?? 'Design system'}
      /* GITHUB MOVED INTO SETTINGS (2026-09-30, Round 3 Q1 — decided on the recommendation, the user
       * asleep, for review): the header's right side is search · settings · theme, three glyphs,
       * and the source link is a row in the drawer's Links section. */
      settings={[{ label: 'Links', rows: [
        { id: 'github', label: 'Source', render: () => (
          <a className="kol-doc-body underline decoration-fg-16 underline-offset-4 hover:decoration-fg-64" href={REPO} target="_blank" rel="noreferrer">GitHub</a>
        ) },
      ] }, { label: 'Components', rows: [
        { id: 'group', label: 'Group the rail by', render: () => (
          <SettingsChoice value={mode} onChange={setMode} options={GROUP_OPTIONS} />
        ) },
      ] }]}
    />
  )
}
