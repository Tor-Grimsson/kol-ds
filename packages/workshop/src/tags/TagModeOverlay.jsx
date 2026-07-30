import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Input, Tag, Button, Tooltip } from '@kolkrabbi/kol-component'
import { useTagMode } from './TagModeContext.jsx'
import TagGraph from './TagGraph.jsx'
import { extractDocNumber, cleanTitle, getTagColor } from '../engine/index.js'
import { buildTagCounts } from '../engine/tags.js'

const TagModeOverlay = () => {
  const { activeTags, activeTag, toggleTag, removeTag, clearTags, closeTagMode, inventory, docHref, tagHref } = useTagMode()
  const [viewMode, setViewMode] = useState('list')
  const [search, setSearch] = useState('')

  const allTagsWithCount = useMemo(() => buildTagCounts(inventory), [inventory])

  const visibleTags = useMemo(() => {
    let tags = allTagsWithCount.filter(({ tag }) => !activeTags.includes(tag))
    if (search.trim()) {
      const q = search.toLowerCase()
      tags = tags.filter(({ tag }) => tag.toLowerCase().includes(q))
    }
    return tags
  }, [allTagsWithCount, search, activeTags])

  const filteredDocs = useMemo(() => {
    if (activeTags.length === 0) return []
    return inventory.filter((d) => {
      if (!Array.isArray(d.metadata?.tags)) return false
      return activeTags.every((t) => d.metadata.tags.includes(t))
    })
  }, [inventory, activeTags])

  const hasFilters = activeTags.length > 0

  return (
    <article className="docs-article">
      {/* was max-w-[864px] — an improvised value in the ~900–1200 band the
        * panel token exists to settle (kol-theme "Content widths"). */}
      <div className="mx-auto max-w-[var(--kol-content-panel)]">
        <div className="flex items-center justify-start gap-1 mb-3">
          {/* ALWAYS present (2026-07-30). This was gated on `hasFilters`, so
            * the graph control did not exist in the DOM until a tag was already
            * active — you had to know it was there to make it appear. The graph
            * is the whole point of the co-occurrence data; hiding its only
            * affordance behind a state you reach by accident is why the user
            * asked "where is the NODE GRAPH? how do I open it?". With no tags
            * active the graph simply shows the full map, which is the view a
            * first-time reader wants most. */}
          <Tooltip label={viewMode === 'graph' ? 'List view' : 'Graph view'}>
            <Button
              variant="outline"
              quiet
              size="sm"
              iconOnly={viewMode === 'graph' ? 'view-list' : 'polygon'}
              onClick={() => setViewMode(viewMode === 'graph' ? 'list' : 'graph')}
              aria-label={viewMode === 'graph' ? 'List view' : 'Graph view'}
            />
          </Tooltip>
          <Tooltip label="Close tag mode">
            <Button
              variant="outline"
              quiet
              size="sm"
              iconOnly="x"
              onClick={closeTagMode}
              aria-label="Close tag mode"
            />
          </Tooltip>
        </div>

        <div className="dash-card flex flex-col gap-8 -mt-4">
          <div className="flex items-center gap-2" style={{ width: '100%', alignSelf: 'stretch' }}>
            <Input
              type="text"
              aria-label="Search tags"
              placeholder="Search tags…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && visibleTags.length > 0) {
                  toggleTag(visibleTags[0].tag)
                  setSearch('')
                }
              }}
              size="md"
              iconLeft="search"
              className="w-full"
              autoFocus
            />
            {search && (
              <Tooltip label="Clear search">
                <Button
                  variant="outline"
                  quiet
                  size="sm"
                  iconOnly="x"
                  onClick={() => setSearch('')}
                  aria-label="Clear search"
                />
              </Tooltip>
            )}
          </div>

          <div className="flex flex-col gap-4 px-10">
            {hasFilters && (
              <>
                <div className="flex items-center justify-between">
                  <Button
                    variant="outline"
                    quiet
                    size="sm"
                    onClick={clearTags}
                  >
                    clear filters
                  </Button>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {activeTags.map((tag) => (
                      <Tag
                        key={tag}
                        variant="solid"
                        color={getTagColor(tag)}
                        size="md"
                        onRemove={() => removeTag(tag)}
                      >
                        {tag}
                      </Tag>
                    ))}
                  </div>
                </div>
                <div className="border-t border-fg-08 my-4" />
              </>
            )}

            {/* `hasFilters` dropped from this condition too — with no tag
              * active the graph renders the WHOLE map, which is the view worth
              * opening cold. Gated, the button could be clicked and nothing
              * changed. */}
            {viewMode === 'graph' ? (
              <div>
                <TagGraph
                  docs={hasFilters ? filteredDocs : inventory}
                  allDocs={inventory}
                  activeTag={activeTag}
                  onTagClick={(tag) => toggleTag(tag)}
                  tagHref={tagHref}
                />
              </div>
            ) : (
              <>
                <div className="flex flex-col">
                  {visibleTags.map(({ tag, count }) => (
                    <button
                      key={tag}
                      type="button"
                      className={`tag-list-item${activeTags.includes(tag) ? ' active' : ''}`}
                      onClick={() => toggleTag(tag)}
                    >
                      <span>{tag}</span>
                      <span className="tag-list-count">{count}</span>
                    </button>
                  ))}
                  {visibleTags.length === 0 && (
                    <p className="text-fg-48 kol-mono-12 py-4">No tags matching "{search}"</p>
                  )}
                </div>

                {hasFilters && filteredDocs.length > 0 && (
                  <div className="flex flex-col pt-4 border-t border-fg-08">
                    {filteredDocs.map((d) => (
                      /* `d.href` wins over `docHref(d.id)` so ONE tag system can
                       * span content types that live in different URL spaces —
                       * a vault doc at /documentation/:id and a component page
                       * at /components/:slug. Without it the inventory could
                       * only ever hold one kind of thing, which is why the
                       * graph saw the vault's 46 docs and nothing else. */
                      <Link
                        key={d.id}
                        to={d.href ?? docHref(d.id)}
                        className="tag-list-item"
                        onClick={closeTagMode}
                      >
                        <span>{cleanTitle(d.title, d.id)}</span>
                        <span className="tag-list-count">{extractDocNumber(d.id)}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}

export default TagModeOverlay
