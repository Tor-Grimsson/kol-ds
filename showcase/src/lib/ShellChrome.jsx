import { useEffect, useMemo, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { ShellLayout, ShellSidebar, RightRail, useTagMode, usePageMetaValue, TagPath, SHELL_SCROLL_ROOT } from '@kolkrabbi/kol-workshop'
import { buildTagCounts } from '@kolkrabbi/kol-markdown'
import { IconFrame, SegmentedToggle, SettingsChoice, Tooltip, useScrollSpy } from '@kolkrabbi/kol-component'
import { Icon } from '@kolkrabbi/kol-icons'
import { useGrouping } from './grouping.jsx'
import { SHELL_ROUTES, DOCS_GUIDES, DOCS_SPECIMENS, DEV_TOOLS, isShellTabActive, buildShellSearchItems, componentTreeRoutes, admittedVaultTree } from '../nav/shell-nav.js'
import { APPS, LAYERS } from '../pages/Apps.jsx'
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
  const one = (label, routes) => (
    <div className="shell-rail-stack">
      <ShellSidebar routes={routes} basePath="/" label={label} onNavigate={onNavigate} />
    </div>
  )

  if (space === 'components') {
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
        <ShellSidebar routes={cmpRoutes} basePath="/" label="Components" onNavigate={onNavigate} />
      </div>
    )
  }
  if (space === 'blocks' || space === 'sets') {
    const route = SHELL_ROUTES.find((r) => r.id === space)
    return one(route.label, rowsOf(route.children ?? []))
  }
  if (space === 'docs') {
    /* ONE PARENT, AS ON DISK (user: "documentation and operations are both documentations …
     * in the repo its just called docs with documentation and operations sub folders"). The
     * space is the parent; its sections are the guides, the live specimens, and the vault's two
     * categories. */
    return (
      <div className="shell-rail-stack">
        <ShellSidebar routes={rowsOf(DOCS_GUIDES)} basePath="/" label="Guides" onNavigate={onNavigate} />
        <ShellSidebar routes={rowsOf(DOCS_SPECIMENS)} basePath="/" label="Specimens" onNavigate={onNavigate} />
        <ShellSidebar routes={vault.filter((g) => g.category === 'documentation')} basePath="/" label="Documentation" onNavigate={onNavigate} />
        <ShellSidebar routes={vault.filter((g) => g.category === 'operations')} basePath="/" label="Operations" onNavigate={onNavigate} />
      </div>
    )
  }
  /* the Apps rail is the index's layers, each app to its home (apps review 2026-09-29) */
  if (space === 'apps') {
    return (
      <div className="shell-rail-stack">
        <ShellSidebar routes={[{ id: 'apps-index', label: 'All apps', path: '/apps' }]} basePath="/" label="Apps" onNavigate={onNavigate} />
        {LAYERS.map((l) => (
          <ShellSidebar
            key={l.id}
            routes={APPS.filter((a) => a.layer === l.id).map((a) => ({ id: `app-${a.name}`, label: a.name, path: `/app/${a.name}` }))}
            basePath="/"
            label={l.label}
            onNavigate={onNavigate}
          />
        ))}
      </div>
    )
  }
  if (space === 'development') {
    const tools = [...rowsOf(DEV_TOOLS), ...(import.meta.env.DEV ? [{ id: 'dev-lobby', label: 'Lobby (dev only)', path: '/lobby' }] : [])]
    return one('Tools', tools)
  }
  return one('Spaces', rowsOf(SHELL_ROUTES))
}

const REPO = 'https://github.com/Tor-Grimsson/kol-ds'

export default function ShellChrome() {
  const { pathname } = useLocation()
  const embedded = useEmbed()
  const { mode, setMode } = useGrouping()
  const searchItems = SEARCH_ITEMS

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
      /* the second wordmark names the space you are in (user: "change the 'workshop' to say …
       * 'design system' when you land … then it could change with the site's navigation") */
      brandLabel={({ activeRoute }) => activeRoute?.label ?? 'Design system'}
      settings={[{ label: 'Components', rows: [
        { id: 'group', label: 'Group the rail by', render: () => (
          <SettingsChoice value={mode} onChange={setMode} options={[{ value: 'atomic', label: 'Atomic' }, { value: 'function', label: 'Function' }]} />
        ) },
      ] }]}
      actions={
        /* Button renders an <a> when given `href`; `IconFrame` takes the glyph off the ladder. */
        <Tooltip label="Source on GitHub">
          <IconFrame name="social-github" variant="nav" size="md" href={REPO} aria-label="GitHub" />
        </Tooltip>
      }
    />
  )
}
