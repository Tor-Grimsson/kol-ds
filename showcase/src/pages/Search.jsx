import { useEffect, useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { SegmentedToggle } from '@kolkrabbi/kol-component'
import { SearchPage, usePageMeta, DocsFrontmatter } from '@kolkrabbi/kol-workshop'
import { useFrontmatter } from '../lib/frontmatter.jsx'
import HomeDoc, { HOMES } from '../lib/HomeDoc.jsx'
import { SHELL_ROUTES, SEARCH_VIEWS, LAST_QUERY_KEY, lastSearchQuery, buildShellSearchItems } from '../nav/shell-nav.js'
import { useGraph } from './References.jsx'

/**
 * Search — the showcase's /search: kol-workshop's SearchPage over the same items the palette
 * searches, plus the reference graph's nodes (a family too large for the palette). Replaced
 * SearchResults (2026-09-28), whose groups were whatever `sectionLabel` each source emitted —
 * "reference graph, utilities, documentation, molecules" with no scope and no filters.
 */
/* The four ways to find a page, one switch on every view (2026-09-30). */
export function SearchViews() {
  const { pathname, search } = useLocation()
  const navigate = useNavigate()
  /* on the search home no view is the current one */
  const active = SEARCH_VIEWS.find((v) => v.path === pathname)?.value
  /* THE QUERY SURVIVES THE ROUND TRIP (2026-10-01 — user: "from results to tag to graph to results
   * it doesnt take you to results, but to search home … should it not show you the search keyword
   * again?"). The other views carry no `?q=`, so Results remembers its own for this tab; clearing
   * the query on Results forgets it. */
  useEffect(() => {
    if (pathname !== SEARCH_VIEWS[0].path) return
    try { search ? sessionStorage.setItem(LAST_QUERY_KEY, search) : sessionStorage.removeItem(LAST_QUERY_KEY) } catch { /* private mode */ }
  }, [pathname, search])
  return (
    <SegmentedToggle
      options={SEARCH_VIEWS.map(({ value, label }) => ({ value, label }))}
      value={active}
      onChange={(v) => navigate(`${SEARCH_VIEWS.find((x) => x.value === v).path}${v === 'results' ? lastSearchQuery() : ''}`)}
      size="sm"
    />
  )
}

/* the result row ruled on open-questions Round 6 (2026-10-01): wash, a glyph for the kind, the path as the second line */
const KIND_ICONS = { component: 'component-01', block: 'layout', card: 'rectangle', set: 'layers', package: 'database', space: 'folder', guide: 'book-open', specimen: 'paint-drop', tool: 'customize', record: 'journal', reference: 'code', doc: 'file', index: 'library' }

const RESULTS_PATH = SEARCH_VIEWS.find((v) => v.value === 'results').path

/* TWO PAGES, ONE COMPONENT (2026-10-01 — user: "results isnt even a page it just an alias to search …
 * making that home also the results page wholesale might be a mistake"). `/search` is the space's
 * home — the engine explained, and the box. `/search/results` is the results, nothing else. Both
 * routes render this one element, so the box keeps its focus when the first keystroke moves you
 * from the home to the results; an old `/search?q=` link lands on the results too. */
export default function Search() {
  const { pathname, search } = useLocation()
  const navigate = useNavigate()
  const hasQuery = Boolean(new URLSearchParams(search).get('q'))
  const onResults = pathname === RESULTS_PATH
  useEffect(() => {
    if (!onResults && hasQuery) navigate(`${RESULTS_PATH}${search}`, { replace: true })
  }, [onResults, hasQuery, search, navigate])
  /* one caller of usePageMeta per page — a parent's call runs after its child's and wins */
  usePageMeta({ tags: HOMES.find((d) => d.id === (onResults ? 'search-results' : 'search'))?.metadata?.tags ?? [], related: [] })
  const { nodes } = useGraph()
  const items = useMemo(() => [
    ...buildShellSearchItems(),
    ...nodes.map((n) => ({
      id: `node:${n.kind}:${n.name}`,
      title: n.name,
      kind: 'reference',
      space: 'development',
      category: 'Reference graph',
      keywords: [n.definedIn, n.concern].filter(Boolean),
      href: `/references/${encodeURIComponent(n.name)}`,
    })),
  ], [nodes])
  /* FRONTMATTER IS THERE, HIDDEN (2026-10-01 — user: "frontmatter can be hidden by default on this
   * page (unhidden by the F), its not important to the results"). The home's rule, not a page's. */
  const showFm = useFrontmatter('home')
  const fm = HOMES.find((d) => d.id === (onResults ? 'search-results' : 'search'))?.metadata
  return (
    <div className="flex flex-col gap-6">
      {showFm && fm && <DocsFrontmatter metadata={fm} docId={onResults ? 'search-results' : 'search'} />}
      {!onResults && <HomeDoc id="search" frontmatter={false} />}
      <SearchViews />
      <SearchPage items={items} rowVariant="wash" rowMeta="path" kindIcons={KIND_ICONS} resultsPath={RESULTS_PATH} spaces={SHELL_ROUTES.map((r) => ({ value: r.id, label: r.label }))} />
    </div>
  )
}
