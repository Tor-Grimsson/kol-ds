/**
 * Pure tag aggregation over a docs inventory — no React, no d3.
 *
 * Extracted from TagModeOverlay (`buildTagCounts`) and TagGraph
 * (`buildTagCooccurrence`) so the counting/co-occurrence math is testable in
 * isolation and the components stay presentational. Each takes the docs
 * `inventory` (array of `{ id, metadata: { tags: string[] } }`) and returns
 * plain data.
 *
 * Case handling is deliberately NOT unified — it preserves the two call sites'
 * original behaviour:
 *   - buildTagCounts       keeps tags exact-case (the overlay's tag list)
 *   - buildTagCooccurrence lowercases tags (the graph's node ids)
 */
import { tagGraph } from '@kolkrabbi/kol-search'

/**
 * Count docs per tag, tags kept exact-case. Returns `[{ tag, count }]` sorted
 * by count descending.
 */
export const buildTagCounts = (inventory = []) => {
  const counts = {}
  inventory.forEach((d) => {
    if (Array.isArray(d.metadata?.tags)) {
      d.metadata.tags.forEach((t) => {
        counts[t] = (counts[t] || 0) + 1
      })
    }
  })
  return Object.entries(counts)
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count)
}

/**
 * DEPRECATED (2026-09-29, ruling D4) — the tag graph is the search index's, so it moved to
 * `@kolkrabbi/kol-search`'s `tagGraph`. This adapts a docs inventory onto it and returns the same
 * `{ nodes, edges }` as before; it goes at the next minor. Import `tagGraph` from kol-search.
 */
export const buildTagCooccurrence = (inventory = []) =>
  tagGraph(inventory.map((d) => ({ id: d.id, tags: d.metadata?.tags ?? [] })))
