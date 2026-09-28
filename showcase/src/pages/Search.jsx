import { useMemo } from 'react'
import { SearchPage, usePageMeta } from '@kolkrabbi/kol-workshop'
import { SHELL_ROUTES, buildShellSearchItems } from '../nav/shell-nav.js'
import { useGraph } from './References.jsx'

/**
 * Search — the showcase's /search: kol-workshop's SearchPage over the same items the palette
 * searches, plus the reference graph's nodes (a family too large for the palette). Replaced
 * SearchResults (2026-09-28), whose groups were whatever `sectionLabel` each source emitted —
 * "reference graph, utilities, documentation, molecules" with no scope and no filters.
 */
export default function Search() {
  usePageMeta({ tags: [], related: [] })
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
  return <SearchPage items={items} spaces={SHELL_ROUTES.map((r) => ({ value: r.id, label: r.label }))} />
}
