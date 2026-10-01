import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { DocSection, TagGraph } from '@kolkrabbi/kol-workshop'
import { Tag } from '@kolkrabbi/kol-component'
import { buildTagCounts, getTagColor } from '@kolkrabbi/kol-markdown'
import { tagGraph } from '@kolkrabbi/kol-search'
import { TAG_INVENTORY } from '../nav/vault.js'
import { buildShellSearchItems, ALL_ROUTES } from '../nav/shell-nav.js'
import { SearchViews } from './Search.jsx'
import HomeDoc from '../lib/HomeDoc.jsx'

/**
 * Search views (moved from Development › Tools 2026-09-30) — the three instruments that had no home (2026-09-30, the names audit:
 * *"why isnt there a way to get to certain pages/spaces like the node visual graph? tags list?
 * index page?"*). The tag graph was a right-rail quick action and nothing else; there was no list
 * of tags and no index of every page. A tag opens the search page on that tag.
 */
const linkCls = 'kol-doc-body underline decoration-fg-16 underline-offset-4 hover:decoration-fg-64'
const tagSearch = (tag) => `/search/results?q=${encodeURIComponent(`#${tag}`)}`

export function TagGraphPage() {
  const navigate = useNavigate()
  /* A NODE SELECTS, IT DOES NOT LEAVE (2026-10-01 — user: "pressing a node souldnt take you out of
   * node view, it should give you an option. maybe a list in the node view or sidebar of connected
   * tags"). The click picks the tag; its connected tags are listed under the graph, each one a pick
   * of its own, and opening the tag's results is the explicit second step. */
  const [picked, setPicked] = useState(null)
  const edges = useMemo(() => tagGraph(TAG_INVENTORY.map((d) => ({ id: d.id, tags: d.metadata?.tags ?? [] }))).edges, [])
  const connected = useMemo(() => (picked
    ? edges.filter((e) => e.source === picked || e.target === picked)
      .map((e) => ({ tag: e.source === picked ? e.target : e.source, weight: e.weight }))
      .sort((x, y) => y.weight - x.weight)
    : []), [edges, picked])
  return (
    <div className="flex flex-col gap-10 pb-24">
      <SearchViews />
      {/* a markdown home with frontmatter, like every other page (2026-10-01 — user: "Tags home
        * doesnt have frontmatter, nor does graph or index") */}
      <HomeDoc id="search-graph" />
      <TagGraph allDocs={TAG_INVENTORY} activeTag={picked} onTagClick={setPicked} />
      {picked && (
        <DocSection id="selected" title={picked}>
          <p className="kol-doc-body">
            <Link className={linkCls} to={tagSearch(picked)}>Open results</Link>
            <span className="text-subtle"> · {connected.length} connected</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {connected.map(({ tag, weight }) => (
              <Tag key={tag} color={getTagColor(tag)} onClick={() => setPicked(tag)}>{`${tag} ${weight}`}</Tag>
            ))}
          </div>
        </DocSection>
      )}
    </div>
  )
}

export function TagsPage() {
  const navigate = useNavigate()
  const byNamespace = useMemo(() => {
    const m = {}
    for (const { tag, count } of buildTagCounts(TAG_INVENTORY)) {
      const [ns, ...rest] = tag.split('/')
      ;(m[ns] ||= []).push({ tag, leaf: rest.join('/') || ns, count })
    }
    return Object.entries(m).sort(([a], [b]) => a.localeCompare(b))
  }, [])
  return (
    <div className="flex flex-col gap-10 pb-24">
      <SearchViews />
      <HomeDoc id="search-tags" />
      {byNamespace.map(([ns, list]) => (
        <DocSection key={ns} id={ns} title={ns.charAt(0).toUpperCase() + ns.slice(1)}>
          {/* THE TAG CHIP (kol-component `Tag`), not a link list built here — the chip every other
            * tag on the site wears; a click opens the search on it */}
          <div className="flex flex-wrap gap-2">
            {list.sort((a, b) => b.count - a.count).map(({ tag, leaf, count }) => (
              <Tag key={tag} color={getTagColor(tag)} onClick={() => navigate(tagSearch(tag))}>{`${leaf} ${count}`}</Tag>
            ))}
          </div>
        </DocSection>
      ))}
    </div>
  )
}

export function IndexPage() {
  const bySpace = useMemo(() => {
    const items = buildShellSearchItems().filter((i) => i.kind !== 'space')
    return ALL_ROUTES.map((r) => [r, items.filter((i) => i.space === r.id).sort((a, b) => a.title.localeCompare(b.title))])
      .filter(([, list]) => list.length)
  }, [])
  return (
    <div className="flex flex-col gap-10 pb-24">
      <SearchViews />
      <HomeDoc id="search-index" />
      {bySpace.map(([space, list]) => (
        <DocSection key={space.id} id={space.id} title={`${space.label} · ${list.length}`}>
          <ul className="grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((i) => (
              <li key={i.id} className="kol-doc-body truncate">
                <Link className={linkCls} to={i.href}>{i.title}</Link>
              </li>
            ))}
          </ul>
        </DocSection>
      ))}
    </div>
  )
}
