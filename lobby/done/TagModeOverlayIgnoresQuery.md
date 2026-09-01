# TagModeOverlayIgnoresQuery — committing a search shows the tag census, not results

**Filed:** 2026-08-31 ← **kol-website**
**Package:** `@kolkrabbi/kol-workshop` — `src/tags/TagModeOverlay.jsx`
**Reported by the user:** *"the search in workshop doesn't have a clear results
page, it sometimes shows a list of tags but tags isn't the only thing the search
is for and should give a keyword result based on query/search input keyword."*

## What happens

Type a query in the workshop search, press return, and the result rows are
replaced by a list of every tag in the inventory with its document count —
`project/kol-monorepo 85`, `domain/design-system 13`, `domain/pages 13` … The
typed query has no effect on that list, and no document rows appear at all.

Screenshot evidence: query was `rf`, and not one of the tags shown contains the
substring `rf`. The list is the complete unfiltered census.

## Why

`ShellLayout.jsx:393` swaps the overlay body for `<TagModeOverlay />` once
`tagMode.expanded` is true, which return sets. `TagModeOverlay` then never reads
`tagMode.text`:

- `:31` — `visibleTags` filters `allTagsWithCount` by **`activeTags` only** (the
  committed chips). The query is not consulted.
- `:35-39` — `filteredDocs` filters `inventory` by **`activeTags` only**. Same.
- `:88` — `docs={hasFilters ? filteredDocs : inventory}` — with no chips
  committed, the tag cloud is computed over the **entire inventory**.
- `:118` — document rows render only when `hasFilters && filteredDocs.length > 0`,
  and `hasFilters` means *chips*, not *query*. So a typed query with no chip
  yields **zero document rows** by construction.

The engine is not the problem. `engine/search.js:19-35` already matches across
label, tags, headings and keywords and returns annotated items — `ShellLayout`
computes exactly that into `searchResults` (`:247`) and hands it to the overlay.
The expanded view simply throws it away.

## The ask

The committed view is a *results* view that offers tags as a facet — not a tag
browser that forgets the query.

1. `TagModeOverlay` consumes `tagMode.text`.
2. Document rows render when **there is a query OR a chip**, not chips alone —
   reuse `matchSearchItems` from the same package rather than adding a second
   matcher, so committed and uncommitted results rank identically.
3. The tag cloud narrows to tags present in the current result set, with counts
   recomputed over it. An empty query keeps today's full census, which is a
   perfectly good browse state — it is only wrong when a query exists.
4. A query that matches nothing says so, rather than falling back to the census.

## Remainder here once it ships

bump kol-workshop; re-check `/workshop` — type a term, press return, confirm
document rows appear and the tag list narrows.

---

## Resolution — 2026-08-31 · 🟢 closed

**Shipped: `@kolkrabbi/kol-workshop` 0.25.0.** All four asks.

1. `TagModeOverlay` reads `tagMode.text`.
2. Document rows render on **a query OR a chip**, matched with the engine's own
   `matchSearchItems` — no second predicate, so committed and uncommitted results
   rank identically. Inventory docs are mapped into the engine's item shape
   (`label` from `cleanTitle`, `tags` from `metadata.tags`, headings, keywords)
   rather than the engine being taught a new shape.
3. The tag cloud is built from the RESULT SET with counts recomputed over it;
   an empty query keeps the full census.
4. A query that matches nothing says `No documents match "…"`.

The two facets apply in order: chips narrow first, then the query matches over
what is left. Either alone is a filter, neither is required.

### Measured on `/workshop-docs`, the live shell
Committing `a` renders document row **Getting Started** plus a tag list narrowed
to `workshop 1` · `docs 1` · `getting-started 1` — the result set's tags with
their own counts, not the census. Committing `zzzzqqq` renders
`No documents match "zzzzqqq"`. Before this, a query with no chip produced zero
document rows and the complete unfiltered tag list, by construction.

Your diagnosis was right line-for-line; nothing in it needed correcting.

### Definition of done
- [x] The overlay consumes `text`
- [x] Rows render on query OR chip, through `matchSearchItems`
- [x] The cloud narrows with recomputed counts; empty query keeps the census
- [x] A no-match query says so
