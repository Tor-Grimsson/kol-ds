import { useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { DocHeader, DocSection, TagGraph, usePageMeta } from '@kolkrabbi/kol-workshop'
import { Tag } from '@kolkrabbi/kol-component'
import { buildTagCounts } from '@kolkrabbi/kol-markdown'
import { TAG_INVENTORY } from '../nav/vault.js'
import { buildShellSearchItems, ALL_ROUTES } from '../nav/shell-nav.js'

/**
 * Development › Tools — the three instruments that had no home (2026-09-30, the names audit:
 * *"why isnt there a way to get to certain pages/spaces like the node visual graph? tags list?
 * index page?"*). The tag graph was a right-rail quick action and nothing else; there was no list
 * of tags and no index of every page. A tag opens the search page on that tag.
 */
const linkCls = 'kol-doc-body underline decoration-fg-16 underline-offset-4 hover:decoration-fg-64'
const tagSearch = (tag) => `/search?q=${encodeURIComponent(`#${tag}`)}`

export function TagGraphPage() {
  usePageMeta({ tags: [], related: [] })
  const navigate = useNavigate()
  return (
    <div className="flex flex-col gap-10 pb-24">
      <DocHeader eyebrow="Development · Tools" title="Tag graph" lede="Every tag as a node; a line where two tags share a page. Click a tag to search it." />
      <TagGraph allDocs={TAG_INVENTORY} onTagClick={(tag) => navigate(tagSearch(tag))} />
    </div>
  )
}

export function TagsPage() {
  usePageMeta({ tags: [], related: [] })
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
      <DocHeader eyebrow="Development · Tools" title="Tags" lede="Every tag in use, by namespace, with how many pages carry it." />
      {byNamespace.map(([ns, list]) => (
        <DocSection key={ns} id={ns} title={ns.charAt(0).toUpperCase() + ns.slice(1)}>
          {/* THE TAG CHIP (kol-component `Tag`), not a link list built here — the chip every other
            * tag on the site wears; a click opens the search on it */}
          <div className="flex flex-wrap gap-2">
            {list.sort((a, b) => b.count - a.count).map(({ tag, leaf, count }) => (
              <Tag key={tag} onClick={() => navigate(tagSearch(tag))}>{`${leaf} ${count}`}</Tag>
            ))}
          </div>
        </DocSection>
      ))}
    </div>
  )
}

export function IndexPage() {
  usePageMeta({ tags: [], related: [] })
  const bySpace = useMemo(() => {
    const items = buildShellSearchItems().filter((i) => i.kind !== 'space')
    return ALL_ROUTES.map((r) => [r, items.filter((i) => i.space === r.id).sort((a, b) => a.title.localeCompare(b.title))])
      .filter(([, list]) => list.length)
  }, [])
  return (
    <div className="flex flex-col gap-10 pb-24">
      <DocHeader eyebrow="Development · Tools" title="Index" lede="Every page on the site, A to Z, by space." />
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
