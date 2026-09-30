import { useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { SegmentedToggle } from '@kolkrabbi/kol-component'
import { SearchPage, usePageMeta } from '@kolkrabbi/kol-workshop'
import HomeDoc, { HOMES } from '../lib/HomeDoc.jsx'
import { SHELL_ROUTES, SEARCH_VIEWS, buildShellSearchItems } from '../nav/shell-nav.js'
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
  const active = SEARCH_VIEWS.find((v) => v.path === pathname)?.value ?? 'results'
  return (
    <SegmentedToggle
      options={SEARCH_VIEWS.map(({ value, label }) => ({ value, label }))}
      value={active}
      onChange={(v) => navigate(`${SEARCH_VIEWS.find((x) => x.value === v).path}${v === 'results' ? search : ''}`)}
      size="sm"
    />
  )
}

export default function Search() {
  /* the space's home (2026-09-30) — above the results until a query is typed */
  const hasQuery = Boolean(new URLSearchParams(useLocation().search).get('q'))
  /* one caller of usePageMeta per page — a parent's call runs after its child's and wins */
  usePageMeta({ tags: hasQuery ? [] : HOMES.find((d) => d.id === 'search')?.metadata?.tags ?? [], related: [] })
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
  return (
    <div className="flex flex-col gap-6">
      {!hasQuery && <HomeDoc id="search" />}
      <SearchViews />
      <SearchPage items={items} spaces={SHELL_ROUTES.map((r) => ({ value: r.id, label: r.label }))} />
    </div>
  )
}
