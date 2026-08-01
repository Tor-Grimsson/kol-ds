import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Button, Tooltip } from '@kolkrabbi/kol-component'
import TagPath from './TagPath.jsx'
import { useTagMode } from './TagModeContext.jsx'
import TagGraph from './TagGraph.jsx'
import RailRow from '../shell/RailRow.jsx'
import { extractDocNumber, cleanTitle } from '../engine/index.js'
import { buildTagCounts } from '../engine/tags.js'

/**
 * TagModeOverlay - the tag BROWSER: the list and the graph. It does not search.
 *
 * ONE SEARCH (user ruling 2026-08-01: "search SHOULD be ONE system not 2").
 * This component owned a second one - a raw `Input` plus
 * `tag.toLowerCase().includes(q)` in a useMemo - over a corpus the shell's own
 * index already covered. Two matchers, two behaviours, and this one never
 * called the engine's `matchSearchItems` at all. Deleted rather than aligned:
 * tags are rows in the shell search index now, so the one modal finds them
 * like it finds everything else.
 *
 * `view` comes from the CONTEXT, not local state - the rail's "Graph view" row
 * has to say which mode it wants before this component exists.
 */
const TagModeOverlay = () => {
  const { activeTags, activeTag, toggleTag, clearTags, closeTagMode, inventory, docHref, tagHref, view, setView } = useTagMode()

  const allTagsWithCount = useMemo(() => buildTagCounts(inventory), [inventory])

  const visibleTags = useMemo(
    () => allTagsWithCount.filter(({ tag }) => !activeTags.includes(tag)),
    [allTagsWithCount, activeTags]
  )

  const filteredDocs = useMemo(() => {
    if (activeTags.length === 0) return []
    return inventory.filter((d) => {
      if (!Array.isArray(d.metadata?.tags)) return false
      return activeTags.every((t) => d.metadata.tags.includes(t))
    })
  }, [inventory, activeTags])

  const hasFilters = activeTags.length > 0

  return (
    /* NOT AN OVERLAY ANY MORE (user ruling 2026-08-01). This is the EXPANDED
     * BODY of ShellSearchOverlay, rendered inside its panel — so it owns no
     * scrim, no panel chrome and no close button. It was a sibling overlay
     * with its own everything, which is what "two systems" meant. */
    /* PLAIN BODY (user 2026-08-01). `.docs-article` is the PROSE wrapper — it
     * centred every row and imposed a reading measure on a filter list, which
     * is why "everything is center aligned". A results body is chrome, not
     * prose. The node/graph button is gone too: the rail's Quick actions owns
     * that entry, and a bare unlabelled hex floating at the corner was "not
     * the place for it". */
    <div className="flex flex-col gap-4 py-4">
      <div className="flex flex-col gap-4">
          {/* THE SEARCH BOX IS GONE (user ruling 2026-08-01). It was a raw
            * `Input` driving `tag.toLowerCase().includes(q)` - a second search
            * system over a corpus the shell index already holds. Tags are rows
            * in that index now, so the ONE modal searches them. This overlay
            * browses: the full list, and the graph. */}
        <div className="flex flex-col gap-4">
            {hasFilters && (
              <>
                <div className="flex items-center justify-between">
                  {/* PRIMARY (user 2026-08-01). `outline quiet` is the
                    * recessive rung — this is the one action in the body. */}
                  <Button variant="primary" size="sm" onClick={clearTags}>
                    Clear filters
                  </Button>
                  {/* NO CHIPS HERE (2026-08-01). The palette renders the
                    * active tags in its input row — this block repeated them
                    * inside the body, so one filter showed as two chips. The
                    * query's facets belong to the query's input. */}
                </div>
                <div className="border-t border-fg-08 my-4" />
              </>
            )}

            {/* `hasFilters` dropped from this condition too — with no tag
              * active the graph renders the WHOLE map, which is the view worth
              * opening cold. Gated, the button could be clicked and nothing
              * changed. */}
            {view === 'graph' ? (
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
                  {/* RAIL ROWS (user 2026-08-01: "reference the sidebars,
                    * dont introduce a different text treatment here"). These
                    * wore `.tag-list-item` / `.tag-list-count`, which have NO
                    * CSS RULE ANYWHERE — that is the whole reason they centred
                    * and carried no type. RailRow already is this row. */}
                  {visibleTags.map(({ tag, count }) => (
                    <RailRow
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      active={activeTags.includes(tag)}
                      trailing={count}
                    >
                      <TagPath tag={tag} />
                    </RailRow>
                  ))}
                  {visibleTags.length === 0 && (
                    <p className="text-fg-48 kol-mono-12 py-4">No tags</p>
                  )}
                </div>

                {hasFilters && filteredDocs.length > 0 && (
                  <div className="shell-nav-items pt-4 border-t border-fg-08">
                    {filteredDocs.map((d) => (
                      /* `d.href` wins over `docHref(d.id)` so ONE tag system can
                       * span content types that live in different URL spaces —
                       * a vault doc at /documentation/:id and a component page
                       * at /components/:slug. Without it the inventory could
                       * only ever hold one kind of thing, which is why the
                       * graph saw the vault's 46 docs and nothing else. */
                      <RailRow
                        key={d.id}
                        to={d.href ?? docHref(d.id)}
                        trailing={extractDocNumber(d.id)}
                        onNavigate={closeTagMode}
                      >
                        {cleanTitle(d.title, d.id)}
                      </RailRow>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
      </div>
    </div>
  )
}

export default TagModeOverlay
