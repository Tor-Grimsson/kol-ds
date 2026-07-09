import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Input, Tag, Button } from '@kolkrabbi/kol-component'
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
      <div className="max-w-[864px] mx-auto">
        <div className="flex items-center justify-start gap-1 mb-3">
          {hasFilters && (
            <Button
              variant="outline"
              quiet
              size="sm"
              iconOnly={viewMode === 'graph' ? 'view-list' : 'polygon'}
              onClick={() => setViewMode(viewMode === 'graph' ? 'list' : 'graph')}
              aria-label={viewMode === 'graph' ? 'List view' : 'Graph view'}
            />
          )}
          <Button
            variant="outline"
            quiet
            size="sm"
            iconOnly="x"
            onClick={closeTagMode}
            aria-label="Close tag mode"
          />
        </div>

        <div className="dash-card flex flex-col gap-8 -mt-4">
          <div className="flex items-center gap-2" style={{ width: '100%', alignSelf: 'stretch' }}>
            <Input
              type="text"
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
              <Button
                variant="outline"
                quiet
                size="sm"
                iconOnly="x"
                onClick={() => setSearch('')}
                aria-label="Clear search"
              />
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

            {hasFilters && viewMode === 'graph' ? (
              <div>
                <TagGraph
                  docs={filteredDocs}
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
                    <p className="text-fg-48 kol-mono-xs py-4">No tags matching "{search}"</p>
                  )}
                </div>

                {hasFilters && filteredDocs.length > 0 && (
                  <div className="flex flex-col pt-4 border-t border-fg-08">
                    {filteredDocs.map((d) => (
                      <Link
                        key={d.id}
                        to={docHref(d.id)}
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
